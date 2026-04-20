"use client";

/* eslint-disable @next/next/no-img-element */

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

import {
  adminEditorSections,
  type AdminEditorSectionId
} from "@/components/admin/adminSections";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { getConfiguredSections } from "@/lib/sectionRegistry";
import { buildThemeStyleVariables } from "@/lib/theme";
import type { SiteConfig } from "@/types/siteConfig";

type SiteConfigPreviewProps = {
  config: SiteConfig;
  activeSection: AdminEditorSectionId;
};

function PreviewShell({
  config,
  activeSection,
  children
}: {
  config: SiteConfig;
  activeSection: AdminEditorSectionId;
  children: ReactNode;
}) {
  const style = buildThemeStyleVariables(config.theme) as CSSProperties;
  const activeRoute =
    adminEditorSections.find((section) => section.id === activeSection)?.path ?? "/";

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-surface-border bg-white">
      <div
        style={style}
        data-theme={config.theme.mode}
        className="bg-[var(--theme-body-bg)]"
      >
        <div className="pointer-events-none">
          <Navbar
            navigation={config.content.navigation.items}
            brandName={config.content.siteName}
            activePath={activeRoute}
          />
          <div className="flex-1">{children}</div>
          <Footer footer={config.footer} />
        </div>
      </div>
    </div>
  );
}

function ContactFormPreview({ config }: { config: SiteConfig }) {
  const formConfig = config.content.contactPage.form;

  return (
    <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
      <div>
        <label htmlFor="preview-name" className="mb-2 block text-sm font-semibold text-ink-800">
          {formConfig.fields.nameLabel}
        </label>
        <Input
          id="preview-name"
          value=""
          placeholder={formConfig.fields.namePlaceholder}
          disabled
          readOnly
        />
      </div>

      <div>
        <label htmlFor="preview-email" className="mb-2 block text-sm font-semibold text-ink-800">
          {formConfig.fields.emailLabel}
        </label>
        <Input
          id="preview-email"
          type="email"
          value=""
          placeholder={formConfig.fields.emailPlaceholder}
          disabled
          readOnly
        />
      </div>

      <div>
        <label
          htmlFor="preview-address"
          className="mb-2 block text-sm font-semibold text-ink-800"
        >
          {formConfig.fields.addressLabel}
        </label>
        <Input
          id="preview-address"
          value=""
          placeholder={formConfig.fields.addressPlaceholder}
          disabled
          readOnly
        />
      </div>

      <div>
        <label
          htmlFor="preview-purpose"
          className="mb-2 block text-sm font-semibold text-ink-800"
        >
          {formConfig.fields.purposeLabel}
        </label>
        <Textarea
          id="preview-purpose"
          value=""
          placeholder={formConfig.fields.purposePlaceholder}
          disabled
          readOnly
        />
      </div>

      <Button type="button" size="lg" className="w-full" disabled>
        {formConfig.submitLabel}
      </Button>
    </form>
  );
}

function HomePreview({ config }: { config: SiteConfig }) {
  const sections = getConfiguredSections(config.sections);

  return (
    <main className="page-shell">
      <SectionRenderer sections={sections} content={config.content} />
    </main>
  );
}

function ProductsPreview({ config }: { config: SiteConfig }) {
  const pageContent = config.content.productsPage;

  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
            {pageContent.eyebrow}
          </p>
          <h1 className="section-title mt-4">{pageContent.title}</h1>
          <p className="section-copy mt-5">{pageContent.description}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {pageContent.products.map((product) => (
            <ProductCard
              key={product.title}
              product={product}
              labels={pageContent.cardLabels}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function BlogsPreview({ config }: { config: SiteConfig }) {
  const pageContent = config.content.blogPage;

  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="glass-panel p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">
              {pageContent.title}
            </h1>
            <div className="prose prose-lg mt-8 max-w-none prose-headings:font-display prose-headings:text-[color:var(--theme-body-text)] prose-p:text-[color:var(--theme-muted-text)] prose-strong:text-[color:var(--theme-body-text)]">
              {pageContent.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <aside className="glass-panel overflow-hidden p-5">
            <img
              src={pageContent.imageSrc}
              alt={pageContent.imageAlt}
              className="h-full w-full rounded-[1.5rem] object-cover"
            />
          </aside>
        </div>
      </section>
    </main>
  );
}

function AboutPreview({ config }: { config: SiteConfig }) {
  const pageContent = config.content.aboutPage;

  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container space-y-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.vision.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">{pageContent.vision.title}</h1>
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
                  <img
                    src={member.image}
                    alt={member.name}
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

function ContactPreview({ config }: { config: SiteConfig }) {
  const pageContent = config.content.contactPage;

  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">{pageContent.title}</h1>
            <p className="mt-5 text-base">{pageContent.description}</p>

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
                      className="rounded-full border border-surface-border bg-white px-4 py-2 text-sm font-medium text-ink-600"
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
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">{pageContent.form.title}</h2>
            <p className="mt-5 text-base">{pageContent.form.description}</p>

            <div className="mt-8">
              <ContactFormPreview config={config} />
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}

function renderPreviewPage(config: SiteConfig, activeSection: AdminEditorSectionId) {
  switch (activeSection) {
    case "products":
      return <ProductsPreview config={config} />;
    case "blogs":
      return <BlogsPreview config={config} />;
    case "about":
      return <AboutPreview config={config} />;
    case "contact":
      return <ContactPreview config={config} />;
    case "home":
    default:
      return <HomePreview config={config} />;
  }
}

export function SiteConfigPreview({ config, activeSection }: SiteConfigPreviewProps) {
  return (
    <PreviewShell config={config} activeSection={activeSection}>
      {renderPreviewPage(config, activeSection)}
    </PreviewShell>
  );
}
