import type { Metadata } from "next";
import Link from "next/link";

import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Card } from "@/components/ui/Card";
import { createMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/services/siteConfigStore";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  return createMetadata({
    title: config.content.contactPage.metaTitle,
    description: config.content.contactPage.metaDescription,
    path: "/contact-us",
    siteName: config.content.siteName
  });
}

export default async function ContactPage() {
  const config = await getSiteConfig();
  const pageContent = config.content.contactPage;

  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.eyebrow}
            </p>
            <h1 className="mt-4 whitespace-pre-line text-4xl font-bold md:text-5xl">
              {pageContent.title}
            </h1>
            <p className="mt-5 whitespace-pre-line text-base">{pageContent.description}</p>

            <div className="mt-10 space-y-8">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">
                  {pageContent.info.registeredAddressHeading}
                </h2>
                <div className="mt-3 space-y-2 text-sm text-ink-600">
                  {pageContent.info.address.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">
                  {pageContent.info.emailHeading}
                </h2>
                <p className="mt-3 text-sm text-ink-600">{pageContent.info.email}</p>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">
                  {pageContent.info.socialHeading}
                </h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {pageContent.info.socialLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-surface-border bg-white px-4 py-2 text-sm font-medium text-ink-600 hover:border-[color:var(--theme-primary-border)] hover:text-[var(--theme-primary)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.form.eyebrow}
            </p>
            <h2 className="mt-4 whitespace-pre-line text-3xl font-bold md:text-4xl">
              {pageContent.form.title}
            </h2>
            <p className="mt-5 whitespace-pre-line text-base">{pageContent.form.description}</p>

            <div className="mt-8">
              <EnquiryForm formConfig={pageContent.form} />
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
