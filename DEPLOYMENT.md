# LOMAS AI Deployment Checklist

## Environment
- Copy `.env.example` to `.env.local` for local development.
- Set `NEXT_PUBLIC_SITE_URL` to the final production domain.
- Set `NEXT_PUBLIC_ENQUIRY_PROVIDER` to `firebase` or `mongodb`.
- Add the matching Firebase or MongoDB credentials.
- Add `ADMIN_PASSWORD_HASH` and `ADMIN_JWT_SECRET` for `/admin`.

## Pre-deploy Verification
- Run `npm install`.
- Run `npm run lint`.
- Run `npm run build`.
- Confirm all public routes render correctly.
- Confirm the enquiry form succeeds with the configured provider.
- Confirm `/api/data` returns the normalized config.
- Confirm admin login and config save work with the configured auth values.

## Vercel Setup
1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add all variables from `.env.example` in the Vercel project settings.
4. Set the production domain and update `NEXT_PUBLIC_SITE_URL`.
5. Trigger the first production deployment.

## Backend Notes
- Firebase mode writes directly to the `enquiries` Firestore collection.
- MongoDB mode sends the form payload to `/api/enquiry`.
- Production should use only one provider at a time to avoid ambiguous behavior.
- Site configuration reads from MongoDB when configured, otherwise from `storage/site-config.json`.
- Admin config updates write to the same active storage source.

## Post-deploy Checks
- Inspect page metadata with the deployed URL.
- Confirm `sitemap.xml` and `robots.txt` are reachable.
- Submit a test enquiry and verify it appears in the configured backend.
- Re-run Lighthouse to confirm performance, accessibility, and SEO targets.
