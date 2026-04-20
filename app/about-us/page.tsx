import type { Metadata } from "next";
import Image from "next/image";

import { Card } from "@/components/ui/Card";
import { createMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/services/siteConfigStore";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  return createMetadata({
    title: config.content.aboutPage.metaTitle,
    description: config.content.aboutPage.metaDescription,
    path: "/about-us",
    siteName: config.content.siteName
  });
}

export default async function AboutPage() {
  const config = await getSiteConfig();
  const pageContent = config.content.aboutPage;

  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container space-y-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.vision.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              {pageContent.vision.title}
            </h1>
            <p className="mt-6 text-base">{pageContent.vision.description}</p>
          </Card>

          <Card className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.ceoMessage.eyebrow}
            </p>
            <p className="mt-4 text-lg text-[color:var(--theme-body-text)]">
              {pageContent.ceoMessage.quote}
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              {pageContent.ceoMessage.signature}
            </p>
          </Card>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
            {pageContent.team.eyebrow}
          </p>
          <h2 className="section-title mt-4">{pageContent.team.title}</h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {pageContent.team.members.map((member) => (
              <Card key={member.name} className="p-6 text-center">
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border border-[color:var(--theme-primary-border)] bg-[var(--theme-primary-soft)]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-5 text-xl font-bold">{member.name}</h3>
                <p className="mt-2 text-sm text-ink-500">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
