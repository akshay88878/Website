import Link from "next/link";

import { SiteLogo } from "@/components/layout/SiteLogo";
import { getTextAlignClass } from "@/lib/layoutUtils";
import { cn } from "@/lib/utils";
import type { FooterConfig } from "@/types/siteConfig";

type FooterProps = {
  footer: FooterConfig;
};

export function Footer({ footer }: FooterProps) {
  return (
    <footer className="border-t border-white/70 bg-white/85">
      <div className="container py-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className={cn(getTextAlignClass(footer.alignment))}>
            <Link href="/" className="inline-flex">
              <SiteLogo
                brandName={footer.brandName}
                imageClassName="h-14 w-14"
                textClassName="text-base tracking-[0.16em] sm:text-lg"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm text-ink-600">
              {footer.text}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">
              {footer.contactHeading}
            </h2>
            <div className="mt-4 space-y-2 text-sm text-ink-600">
              <p>{footer.email}</p>
              {footer.address.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">
              {footer.socialHeading}
            </h2>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              {footer.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.url}
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
