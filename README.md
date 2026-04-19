# LOMAS AI

A production-ready marketing website and enquiry workflow built with Next.js 14, TypeScript, Tailwind CSS, and App Router. The project now uses a centralized site config model, dynamic home section registry, `/api/data` content endpoint, and a minimal `/admin` CMS surface.

## Setup
```bash
npm install
npm run dev
```

## Verification
```bash
npm run lint
npm run build
```

## Routes
- `/`
- `/products`
- `/blogs`
- `/about-us`
- `/contact-us`
- `/admin`
- `/api/data`
- `/api/enquiry`

## Folder Structure
```text
app/
components/
models/
services/
storage/
types/
lib/
public/
```

## Enquiry Providers
- `mock` for local UI verification
- `firebase` for Firestore submissions
- `mongodb` for API-based MongoDB submissions

## Media Uploads
- Image fields in `/admin` can upload directly to Firebase Storage.
- The uploaded download URL is written back into the centralized site config.
- Firebase Storage rules must allow authenticated admin users to upload and read those files.

## Site Config Storage
- When Firebase config is present, the centralized site config is read from Firestore document `site_configs/default-site-config`.
- In Firebase mode, `/admin` saves the site config directly to Firestore instead of the local `storage/site-config.json` file.
- Firestore rules must allow public reads for the site config document and authenticated admin writes for `/admin`.

## Admin Auth
- Firebase email/password login is used automatically on `/admin` when the Firebase web config is present.
- Set `ADMIN_JWT_SECRET` to a long random secret because the admin API still uses a server-issued session cookie.
- Set `ADMIN_FIREBASE_EMAILS` to a comma-separated allowlist to restrict which Firebase accounts can access admin.
- Optional legacy fallback: generate a hash with `npm run admin:hash -- your-password` and set `ADMIN_PASSWORD_HASH`.
- Visit `/admin` to edit and save the centralized config.
