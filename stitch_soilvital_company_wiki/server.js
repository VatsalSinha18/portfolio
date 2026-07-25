const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const LEADS_FILE = process.env.LEADS_FILE || path.join(__dirname, 'data', 'leads.jsonl');
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_BODY_BYTES = 32 * 1024;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 20);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const buckets = new Map();

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  });
  res.end(JSON.stringify(payload));
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return String(forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress || 'unknown').trim();
}

function isRateLimited(ip) {
  const now = Date.now();
  const existing = buckets.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > existing.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  existing.count += 1;
  buckets.set(ip, existing);
  return existing.count > RATE_LIMIT_MAX;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let body = '';
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function cleanString(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function normalizeLead(input) {
  const lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    source: cleanString(input.source, 80) || 'website',
    name: cleanString(input.name, 120),
    email: cleanString(input.email, 160).toLowerCase(),
    phone: cleanString(input.phone, 40),
    location: cleanString(input.location, 160),
    message: cleanString(input.message, 2000)
  };

  const errors = [];
  if (!lead.name) errors.push('Name is required.');
  if (!lead.phone && !lead.email) errors.push('Phone or email is required.');
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.push('Email is invalid.');
  if (lead.phone && !/^[+()\-\s\d]{7,20}$/.test(lead.phone)) errors.push('Phone number is invalid.');

  return { lead, errors };
}

async function persistLead(lead, req) {
  await fs.promises.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  const record = {
    ...lead,
    ip: getClientIp(req),
    userAgent: cleanString(req.headers['user-agent'] || '', 300)
  };
  await fs.promises.appendFile(LEADS_FILE, `${JSON.stringify(record)}\n`, 'utf8');
  return record;
}

async function postWebhook(record) {
  if (!process.env.LEAD_WEBHOOK_URL || typeof fetch !== 'function') return;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    await fetch(process.env.LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(record),
      signal: controller.signal
    });
  } catch (error) {
    console.error('Lead webhook failed:', error.message);
  } finally {
    clearTimeout(timeout);
  }
}

function serveStatic(req, res) {
  const rawPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const pageRoutes = { '/': '/index.html', '/about': '/about.html', '/privacy': '/privacy.html', '/terms': '/terms.html', '/careers': '/careers.html' };
  const routePath = pageRoutes[rawPath] || rawPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, routePath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      res.end('<h1>Not found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'content-type': contentTypes[ext] || 'application/octet-stream',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin',
      'permissions-policy': 'geolocation=(), microphone=(), camera=()'
    });
    res.end(content);
  });
}

async function handleApi(req, res) {
  if (req.method === 'GET' && req.url.startsWith('/api/health')) {
    sendJson(res, 200, { ok: true, service: 'soilvital-backend', environment: NODE_ENV });
    return;
  }

  if (req.method === 'POST' && req.url.startsWith('/api/leads')) {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      sendJson(res, 429, { ok: false, error: 'Too many submissions. Please try again later.' });
      return;
    }

    try {
      const rawBody = await readBody(req);
      const payload = rawBody ? JSON.parse(rawBody) : {};
      const { lead, errors } = normalizeLead(payload);
      if (errors.length) {
        sendJson(res, 400, { ok: false, errors });
        return;
      }

      const record = await persistLead(lead, req);
      postWebhook(record);
      sendJson(res, 201, { ok: true, id: record.id, message: 'Thanks. Our team will contact you shortly.' });
    } catch (error) {
      const status = error.statusCode || (error instanceof SyntaxError ? 400 : 500);
      sendJson(res, status, { ok: false, error: status === 400 ? 'Invalid JSON request.' : 'Could not save the lead.' });
    }
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/api/leads')) {
    if (!ADMIN_TOKEN || req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
      sendJson(res, 401, { ok: false, error: 'Unauthorized.' });
      return;
    }

    try {
      const contents = await fs.promises.readFile(LEADS_FILE, 'utf8');
      const leads = contents.trim().split('\n').filter(Boolean).map(line => JSON.parse(line)).reverse();
      sendJson(res, 200, { ok: true, leads });
    } catch (error) {
      if (error.code === 'ENOENT') {
        sendJson(res, 200, { ok: true, leads: [] });
        return;
      }
      sendJson(res, 500, { ok: false, error: 'Could not read leads.' });
    }
    return;
  }

  sendJson(res, 404, { ok: false, error: 'API route not found.' });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    handleApi(req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed.' });
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`SoilVital backend running on http://${HOST}:${PORT}`);
});

