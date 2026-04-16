import type { Metadata } from "next";
import Link from "next/link";

import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Card } from "@/components/ui/Card";
import { contactDetails, socialLinks } from "@/data/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact Us",
  description:
    "Reach out to LOMAS AI for product enquiries, partnerships, and institution onboarding.",
  path: "/contact-us"
});

export default function ContactPage() {
  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              Contact
            </p>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              Start a conversation with the LOMAS AI team
            </h1>
            <p className="mt-5 text-base text-ink-600">
              Share your institution profile, partnership objective, or product
              interest. We will respond with the right team and next steps.
            </p>

            <div className="mt-10 space-y-8">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">
                  Registered Address
                </h2>
                <div className="mt-3 space-y-2 text-sm text-ink-600">
                  {contactDetails.address.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">
                  Email
                </h2>
                <p className="mt-3 text-sm text-ink-600">{contactDetails.email}</p>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">
                  Social Links
                </h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {socialLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-surface-border bg-white px-4 py-2 text-sm font-medium text-ink-600 hover:border-brand-200 hover:text-brand-700"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              Enquiry Form
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Tell us what you need
            </h2>
            <p className="mt-5 text-base text-ink-600">
              Share the essentials. The form validates input and can route
              submissions through Firebase or MongoDB depending on environment
              configuration.
            </p>

            <div className="mt-8">
              <EnquiryForm />
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
