# SoilVital Backend

Deployable Node backend for the SoilVital static pages.

## What it includes

- Static site routes: `/` and `/about`
- Health check: `GET /api/health`
- Public lead capture: `POST /api/leads`
- Admin lead list: `GET /api/leads` with `Authorization: Bearer <ADMIN_TOKEN>`
- File-backed lead storage at `data/leads.jsonl`
- Basic validation, rate limiting, and security headers
- Optional `LEAD_WEBHOOK_URL` forwarding for Zapier, Make, Google Apps Script, Slack, or a CRM

## Run locally

```bash
npm start
```

Open `http://localhost:3000`.

## Deploy today

### Render

1. Push this folder to GitHub.
2. Create a Render Web Service from the repo, or use the included `render.yaml` blueprint.
3. Set environment variables:
   - `NODE_ENV=production`
   - `ADMIN_TOKEN=<a long random secret>`
   - Optional `LEAD_WEBHOOK_URL=<your automation webhook>`
4. Deploy. Render will run `npm install` and `npm start`.

### Railway / Heroku-compatible hosts

Use the included `Procfile`. Set the same environment variables and deploy as a Node app.

## API examples

Submit a lead:

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "content-type: application/json" \
  -d '{"name":"Sameer","phone":"+91 9166293899","location":"Jaipur","source":"homepage-popup"}'
```

Read leads:

```bash
curl http://localhost:3000/api/leads \
  -H "Authorization: Bearer your-admin-token"
```
