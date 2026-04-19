# LOMAS AI Deployment Checklist

## Environment
- Copy `.env.example` to `.env.local` for local development.
- Set `NEXT_PUBLIC_SITE_URL` to the final production domain.
- Set `NEXT_PUBLIC_ENQUIRY_STORAGE_PROVIDER` to `firebase`, `mongodb`, `none`, or `mock`.
- Set `NEXT_PUBLIC_ENQUIRY_EMAIL_PROVIDER` to `smtp` or `none`.
- Add the matching Firebase or MongoDB credentials.
- Add the SMTP credentials for enquiry email delivery.
- Set `ADMIN_FIREBASE_EMAILS` to the Firebase account email(s) that can access `/admin`.

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
- Firebase storage mode writes directly to the `enquiries` Firestore collection.
- Firebase storage + SMTP mode then calls `/api/enquiry/notify` to send the SMTP notification email.
- MongoDB storage mode sends the form payload to `/api/enquiry`.
- MongoDB storage + SMTP mode stores the enquiry and sends the SMTP notification email in the same request.
- SMTP-only mode uses `/api/enquiry/notify` without storing the enquiry.
- Site configuration reads from MongoDB when configured, otherwise from `storage/site-config.json`.
- Admin config updates write to the same active storage source.

## Post-deploy Checks
- Inspect page metadata with the deployed URL.
- Confirm `sitemap.xml` and `robots.txt` are reachable.
- Submit a test enquiry and verify it appears in the configured backend.
- Re-run Lighthouse to confirm performance, accessibility, and SEO targets.
