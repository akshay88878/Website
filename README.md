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

## Enquiry Delivery
- `NEXT_PUBLIC_ENQUIRY_STORAGE_PROVIDER` controls storage: `mock`, `firebase`, `mongodb`, or `none`
- `NEXT_PUBLIC_ENQUIRY_EMAIL_PROVIDER` controls email delivery: `smtp` or `none`
- Use `firebase + smtp` for store and email
- Use `firebase + none` for storage only
- Use `none + smtp` for email only
- Use `mongodb + smtp` for MongoDB storage and email
- `NEXT_PUBLIC_ENQUIRY_PROVIDER` is still accepted as a legacy fallback for storage only

## Enquiry Email
- Contact form submissions can also send an SMTP notification email after storing the enquiry.
- Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `ENQUIRY_NOTIFICATION_TO`.
- In `firebase + smtp` mode, the enquiry is stored in Firestore first and then `/api/enquiry/notify` sends the email.
- In `mongodb + smtp` mode, `/api/enquiry` stores the enquiry and sends the email in the same request.
- In `none + smtp` mode, the form sends only the SMTP notification email without storing the enquiry.

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
- The admin API verifies the Firebase ID token directly on each request. No extra admin password hash or JWT secret is required.
- Set `ADMIN_FIREBASE_EMAILS` to a comma-separated allowlist to restrict which Firebase accounts can access admin.
- Visit `/admin` to edit and save the centralized config.
