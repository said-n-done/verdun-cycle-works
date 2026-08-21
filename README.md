# Verdun Cycle Works

Fixture site for said-n-done Phase 1 testing. Static HTML/CSS/JS for the shop pages,
plus a Vercel Function (`api/products.js`) backed by Neon Postgres for product CRUD --
this is the site that proves the tool works against dynamic code, not only static pages.

## Local development

```
vercel dev
```

Needs `DATABASE_URL` (Neon connection string) and `ADMIN_TOKEN` set -- both are
injected by the Vercel Neon Marketplace integration / project env vars in production.

CI: html-validate + api-syntax on every PR. Auto-merge enabled once required checks pass.
