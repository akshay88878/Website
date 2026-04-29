import type { Metadata } from "next";
import Image from "next/image";

import { Card } from "@/components/ui/Card";
import {
  getBlockAlignClass,
  getContainerWidth,
  getFlexAlignClass,
  getJustifyClass,
  getTextAlignClass
} from "@/lib/layoutUtils";
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
  const teamHeadingAlignment =
    pageContent.team.headingAlignment ?? pageContent.team.alignment ?? "center";
  const teamContentAlignment =
    pageContent.team.contentAlignment ?? pageContent.team.alignment ?? "center";

  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container space-y-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-8 md:p-10">
            <p className="whitespace-pre-line text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.vision.eyebrow}
            </p>
            <h1 className="mt-4 whitespace-pre-line text-4xl font-bold md:text-5xl">
              {pageContent.vision.title}
            </h1>
            <p className="mt-6 whitespace-pre-line text-base">{pageContent.vision.description}</p>
          </Card>

          <Card className="p-8 md:p-10">
            <p className="whitespace-pre-line text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.ceoMessage.eyebrow}
            </p>
            <p className="mt-4 whitespace-pre-line text-lg text-[color:var(--theme-body-text)]">
              {pageContent.ceoMessage.quote}
            </p>
            <p className="mt-6 whitespace-pre-line text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              {pageContent.ceoMessage.signature}
            </p>
          </Card>
        </div>

        <div
          className={`${getContainerWidth(pageContent.team.width ?? "wide")} ${getBlockAlignClass(
            teamHeadingAlignment
          )} ${getTextAlignClass(teamHeadingAlignment)}`}
        >
          <p className="whitespace-pre-line text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
            {pageContent.team.eyebrow}
          </p>
          <h2 className="section-title mt-4 whitespace-pre-line">{pageContent.team.title}</h2>

          <div className={`mt-10 flex flex-wrap gap-6 ${getJustifyClass(teamContentAlignment)}`}>
            {pageContent.team.members.map((member) => (
              <Card
                key={member.name}
                className={`w-full p-6 sm:w-[calc((100%_-_1.5rem)/2)] xl:w-[calc((100%_-_4.5rem)/4)] ${getTextAlignClass(
                  teamContentAlignment
                )}`}
              >
                <div className={`flex ${getFlexAlignClass(teamContentAlignment)}`}>
                  <div className="h-28 w-28 overflow-hidden rounded-full border border-[color:var(--theme-primary-border)] bg-[var(--theme-primary-soft)]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="mt-5 whitespace-pre-line text-xl font-bold">{member.name}</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-ink-500">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
