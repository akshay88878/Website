import type { Metadata } from "next";
import Image from "next/image";

import { createMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/services/siteConfigStore";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  return createMetadata({
    title: config.content.blogPage.metaTitle,
    description: config.content.blogPage.metaDescription,
    path: "/blogs",
    siteName: config.content.siteName
  });
}

export default async function BlogsPage() {
  const config = await getSiteConfig();
  const pageContent = config.content.blogPage;

  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="glass-panel p-8 md:p-10">
            <p className="whitespace-pre-line text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.eyebrow}
            </p>
            <h1 className="mt-4 whitespace-pre-line font-display text-4xl font-bold md:text-5xl">
              {pageContent.title}
            </h1>
            <div className="prose prose-lg mt-8 max-w-none prose-headings:font-display prose-headings:text-[color:var(--theme-body-text)] prose-p:text-[color:var(--theme-muted-text)] prose-strong:text-[color:var(--theme-body-text)]">
              {pageContent.paragraphs.map((paragraph) => (
                <p key={paragraph} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <aside className="glass-panel overflow-hidden p-5">
            <Image
              src={pageContent.imageSrc}
              alt={pageContent.imageAlt}
              width={720}
              height={860}
              className="h-full w-full rounded-[1.5rem] object-cover"
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
