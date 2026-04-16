import Link from "next/link";

import { SiteLogo } from "@/components/layout/SiteLogo";
import { contactDetails, socialLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/85">
      <div className="container py-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex">
              <SiteLogo
                imageClassName="h-14 w-14"
                textClassName="text-base tracking-[0.16em] sm:text-lg"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm text-ink-600">
              {contactDetails.tagline}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">
              Contact
            </h2>
            <div className="mt-4 space-y-2 text-sm text-ink-600">
              <p>{contactDetails.email}</p>
              {contactDetails.address.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">
              Social
            </h2>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink-600 hover:text-brand-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
