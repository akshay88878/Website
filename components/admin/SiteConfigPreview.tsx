"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, memo, Suspense, lazy, type CSSProperties, type ReactNode } from "react";
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
import {
  getBlockAlignClass,
  getContainerWidth,
  getFlexAlignClass,
  getJustifyClass,
  getTextAlignClass
} from "@/lib/layoutUtils";
import { getConfiguredSections } from "@/lib/sectionRegistry";
import { buildThemeStyleVariables } from "@/lib/theme";
import type { SiteConfig } from "@/types/siteConfig";

type SiteConfigPreviewProps = {
  config: SiteConfig;
  activeSection: AdminEditorSectionId;
};

const MemoizedNavbar = memo(Navbar);
const MemoizedFooter = memo(Footer);

const PreviewShell = memo(function PreviewShell({
  config,
  activeSection,
  children
}: {
  config: SiteConfig;
  activeSection: AdminEditorSectionId;
  children: ReactNode;
}) {
  // Cache theme style object - only recalculate when theme changes
  const style = useMemo(
    () => buildThemeStyleVariables(config.theme) as CSSProperties,
    [config.theme]
  );

  // Cache active route - only recalculate when activeSection changes
  const activeRoute = useMemo(
    () => adminEditorSections.find((section) => section.id === activeSection)?.path ?? "/",
    [activeSection]
  );

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-surface-border bg-white">
      <div
        style={style}
        data-theme={config.theme.mode}
        className="bg-[var(--theme-body-bg)]"
      >
        <div className="pointer-events-none">
          <MemoizedNavbar
            navigation={config.content.navigation.items}
            brandName={config.content.siteName}
            activePath={activeRoute}
          />
          <div className="flex-1">{children}</div>
          <MemoizedFooter footer={config.footer} />
        </div>
      </div>
    </div>
  );
});

const ContactFormPreview = memo(function ContactFormPreview({ config }: { config: SiteConfig }) {
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
});

const HomePreview = memo(function HomePreview({ config }: { config: SiteConfig }) {
  const sections = getConfiguredSections(config.sections);

  return (
    <main className="page-shell">
      <MemoizedSectionRenderer sections={sections} content={config.content} />
    </main>
  );
});

const ProductsPreview = memo(function ProductsPreview({ config }: { config: SiteConfig }) {
  const pageContent = config.content.productsPage;

  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
            {pageContent.eyebrow}
          </p>
          <h1 className="section-title mt-4 whitespace-pre-line">{pageContent.title}</h1>
          <p className="section-copy mt-5 whitespace-pre-line">{pageContent.description}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {pageContent.products.map((product) => (
            <MemoizedProductCard
              key={product.title}
              product={product}
              labels={pageContent.cardLabels}
            />
          ))}
        </div>
      </section>
    </main>
  );
});

const BlogsPreview = memo(function BlogsPreview({ config }: { config: SiteConfig }) {
  const pageContent = config.content.blogPage;

  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="glass-panel p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.eyebrow}
            </p>
            <h1 className="mt-4 whitespace-pre-line font-display text-4xl font-bold md:text-5xl">
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
});

const AboutPreview = memo(function AboutPreview({ config }: { config: SiteConfig }) {
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
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.vision.eyebrow}
            </p>
            <h1 className="mt-4 whitespace-pre-line text-4xl font-bold md:text-5xl">
              {pageContent.vision.title}
            </h1>
            <p className="mt-6 whitespace-pre-line text-base">{pageContent.vision.description}</p>
          </Card>

          <Card className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
              {pageContent.ceoMessage.eyebrow}
            </p>
            <p className="mt-4 whitespace-pre-line text-lg text-[color:var(--theme-body-text)]">
              {pageContent.ceoMessage.quote}
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              {pageContent.ceoMessage.signature}
            </p>
          </Card>
        </div>

        <div
          className={`${getContainerWidth(pageContent.team.width ?? "wide")} ${getBlockAlignClass(
            teamHeadingAlignment
          )} ${getTextAlignClass(teamHeadingAlignment)}`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
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
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
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
});

const ContactPreview = memo(function ContactPreview({ config }: { config: SiteConfig }) {
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
            <h2 className="mt-4 whitespace-pre-line text-3xl font-bold md:text-4xl">
              {pageContent.form.title}
            </h2>
            <p className="mt-5 whitespace-pre-line text-base">{pageContent.form.description}</p>

            <div className="mt-8">
              <ContactFormPreview config={config} />
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
});

function renderPreviewPage(config: SiteConfig, activeSection: AdminEditorSectionId) {
  return (
    <Suspense fallback={<div className="h-96 bg-surface-subtle" />}>
      {(() => {
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
      })()}
    </Suspense>
  );
}

const MemoizedSectionRenderer = memo(SectionRenderer);
const MemoizedProductCard = memo(ProductCard);

const SiteConfigPreviewComponent = function SiteConfigPreview({
  config,
  activeSection
}: SiteConfigPreviewProps) {
  return (
    <PreviewShell config={config} activeSection={activeSection}>
      {renderPreviewPage(config, activeSection)}
    </PreviewShell>
  );
};

export const SiteConfigPreview = memo(
  SiteConfigPreviewComponent,
  (prevProps, nextProps) =>
    prevProps.config === nextProps.config &&
    prevProps.activeSection === nextProps.activeSection
);
