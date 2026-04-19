"use client";

import type { ReactNode } from "react";

import { FileJson, LayoutTemplate, Plus, Trash2 } from "lucide-react";

import {
  adminEditorSections,
  type AdminEditorSectionId
} from "@/components/admin/adminSections";
import { FirebaseImageField } from "@/components/admin/FirebaseImageField";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type {
  Alignment,
  ContainerWidth,
  HomeSectionType,
  LinkItem,
  ProductItem,
  SectionConfig,
  SiteConfig,
  TeamMember,
  ThemeMode
} from "@/types/siteConfig";

export type EditorMode = "form" | "json";

type SiteConfigFormProps = {
  config: SiteConfig;
  activeSection: AdminEditorSectionId;
  editorMode: EditorMode;
  editorValue: string;
  onChange: (nextConfig: SiteConfig) => void;
  onActiveSectionChange: (section: AdminEditorSectionId) => void;
  onEditorModeChange: (mode: EditorMode) => void;
  onJsonChange: (value: string) => void;
};

const selectClassName =
  "flex h-12 w-full rounded-2xl border border-surface-border bg-white px-4 text-sm text-ink-900 shadow-sm outline-none transition duration-200 focus:border-[color:var(--theme-primary-border)] focus:ring-4 focus:ring-[var(--theme-primary-soft)]";
const checkboxClassName =
  "h-5 w-5 rounded border border-surface-border text-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary-soft)]";

const alignmentOptions: Alignment[] = ["left", "center", "right"];
const widthOptions: ContainerWidth[] = ["narrow", "default", "wide", "full"];
const themeModeOptions: ThemeMode[] = ["light", "dark"];

const contactFormFields = [
  ["nameLabel", "Name label"],
  ["namePlaceholder", "Name placeholder"],
  ["emailLabel", "Email label"],
  ["emailPlaceholder", "Email placeholder"],
  ["addressLabel", "Address label"],
  ["addressPlaceholder", "Address placeholder"],
  ["purposeLabel", "Purpose label"],
  ["purposePlaceholder", "Purpose placeholder"]
] as const;

function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function joinLines(value: string[]) {
  return value.join("\n");
}

function replaceAt<T>(items: T[], index: number, nextValue: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? nextValue : item));
}

function removeAt<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

function setField<T>(target: T, path: string[], value: unknown): T {
  const [head, ...rest] = path;

  if (!head) {
    return value as T;
  }

  const record = target as Record<string, unknown>;

  return {
    ...record,
    [head]: rest.length ? setField(record[head], rest, value) : value
  } as T;
}

function getSection(config: SiteConfig, type: HomeSectionType): SectionConfig {
  return (
    config.sections.find((section) => section.type === type) ?? {
      type,
      enabled: true,
      order: type === "hero" ? 1 : 2,
      alignment: type === "hero" ? "left" : "center",
      width: "wide"
    }
  );
}

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-ink-900">{label}</label>
        {hint ? <p className="text-xs text-ink-500">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

function EditorCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-ink-600">{description}</p>
      <div className="mt-6 space-y-5">{children}</div>
    </Card>
  );
}

function LinkListEditor({
  title,
  items,
  addLabel,
  onChange
}: {
  title: string;
  items: LinkItem[];
  addLabel: string;
  onChange: (items: LinkItem[]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, { label: "", url: "" }])}
        >
          <Plus className="mr-2 h-4 w-4" />
          {addLabel}
        </Button>
      </div>

      {items.length ? (
        items.map((item, index) => (
          <div key={`${title}-${index}`} className="rounded-3xl border border-surface-border p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink-900">Item {index + 1}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange(removeAt(items, index))}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Label">
                <Input
                  value={item.label}
                  onChange={(event) =>
                    onChange(
                      replaceAt(items, index, {
                        ...item,
                        label: event.target.value
                      })
                    )
                  }
                />
              </Field>
              <Field label="URL">
                <Input
                  value={item.url}
                  onChange={(event) =>
                    onChange(
                      replaceAt(items, index, {
                        ...item,
                        url: event.target.value
                      })
                    )
                  }
                />
              </Field>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-3xl border border-dashed border-surface-border p-4 text-sm text-ink-500">
          No items configured.
        </div>
      )}
    </div>
  );
}

function SectionControl({
  section,
  onChange
}: {
  section: SectionConfig;
  onChange: (section: SectionConfig) => void;
}) {
  return (
    <div className="rounded-3xl border border-surface-border bg-surface-subtle p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--theme-primary)]">
            {section.type}
          </p>
          <p className="mt-1 text-sm text-ink-600">
            Configure homepage visibility, order, and layout override.
          </p>
        </div>

        <label className="flex items-center gap-3 text-sm font-semibold text-ink-900">
          <input
            type="checkbox"
            checked={section.enabled}
            className={checkboxClassName}
            onChange={(event) => onChange({ ...section, enabled: event.target.checked })}
          />
          Section enabled
        </label>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Field label="Order">
          <Input
            type="number"
            min={1}
            value={section.order}
            onChange={(event) =>
              onChange({
                ...section,
                order: Number(event.target.value) || 1
              })
            }
          />
        </Field>

        <Field label="Alignment">
          <select
            className={selectClassName}
            value={section.alignment ?? "left"}
            onChange={(event) =>
              onChange({
                ...section,
                alignment: event.target.value as Alignment
              })
            }
          >
            {alignmentOptions.map((alignment) => (
              <option key={alignment} value={alignment}>
                {alignment}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Width">
          <select
            className={selectClassName}
            value={section.width ?? "wide"}
            onChange={(event) =>
              onChange({
                ...section,
                width: event.target.value as ContainerWidth
              })
            }
          >
            {widthOptions.map((width) => (
              <option key={width} value={width}>
                {width}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
}

function ProductListEditor({
  items,
  onChange
}: {
  items: ProductItem[];
  onChange: (items: ProductItem[]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-900">Products</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onChange([
              ...items,
              { title: "", description: "", techStack: [], features: [], useCase: "" }
            ])
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add product
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={`product-${index}`} className="rounded-3xl border border-surface-border p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink-900">Product {index + 1}</p>
            <Button variant="ghost" size="sm" onClick={() => onChange(removeAt(items, index))}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Title">
              <Input
                value={item.title}
                onChange={(event) =>
                  onChange(replaceAt(items, index, { ...item, title: event.target.value }))
                }
              />
            </Field>
            <Field label="Use case">
              <Input
                value={item.useCase}
                onChange={(event) =>
                  onChange(replaceAt(items, index, { ...item, useCase: event.target.value }))
                }
              />
            </Field>
          </div>

          <div className="mt-4 space-y-4">
            <Field label="Description">
              <Textarea
                value={item.description}
                onChange={(event) =>
                  onChange(
                    replaceAt(items, index, { ...item, description: event.target.value })
                  )
                }
                className="min-h-[140px]"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Tech stack" hint="One item per line.">
                <Textarea
                  value={joinLines(item.techStack)}
                  onChange={(event) =>
                    onChange(
                      replaceAt(items, index, {
                        ...item,
                        techStack: parseLines(event.target.value)
                      })
                    )
                  }
                  className="min-h-[140px]"
                />
              </Field>
              <Field label="Features" hint="One item per line.">
                <Textarea
                  value={joinLines(item.features)}
                  onChange={(event) =>
                    onChange(
                      replaceAt(items, index, {
                        ...item,
                        features: parseLines(event.target.value)
                      })
                    )
                  }
                  className="min-h-[140px]"
                />
              </Field>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamListEditor({
  items,
  onChange
}: {
  items: TeamMember[];
  onChange: (items: TeamMember[]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-900">Team Members</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, { name: "", role: "", image: "" }])}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add member
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={`team-${index}`} className="rounded-3xl border border-surface-border p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink-900">Member {index + 1}</p>
            <Button variant="ghost" size="sm" onClick={() => onChange(removeAt(items, index))}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="Name">
              <Input
                value={item.name}
                onChange={(event) =>
                  onChange(replaceAt(items, index, { ...item, name: event.target.value }))
                }
              />
            </Field>
            <Field label="Role">
              <Input
                value={item.role}
                onChange={(event) =>
                  onChange(replaceAt(items, index, { ...item, role: event.target.value }))
                }
              />
            </Field>
            <Field label="Image" hint="Upload to Firebase Storage or paste an image URL.">
              <FirebaseImageField
                value={item.image}
                onChange={(value) =>
                  onChange(replaceAt(items, index, { ...item, image: value }))
                }
                uploadPath={`site-assets/team/member-${index + 1}`}
                previewAlt={item.name || `Team member ${index + 1}`}
              />
            </Field>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SiteConfigForm({
  config,
  activeSection,
  editorMode,
  editorValue,
  onChange,
  onActiveSectionChange,
  onEditorModeChange,
  onJsonChange
}: SiteConfigFormProps) {
  const heroSection = getSection(config, "hero");
  const highlightsSection = getSection(config, "highlights");
  const activeSectionConfig =
    adminEditorSections.find((section) => section.id === activeSection) ?? adminEditorSections[0];

  const updateField = (path: string[], value: unknown) => onChange(setField(config, path, value));
  const updateSection = (type: HomeSectionType, nextSection: SectionConfig) =>
    onChange({
      ...config,
      sections: [...config.sections.filter((section) => section.type !== type), nextSection].sort(
        (left, right) => left.order - right.order
      )
    });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold">Configuration Editor</h2>
            <p className="mt-2 text-sm text-ink-600">
              Use the form editor for normal updates. Switch to raw JSON only for direct
              model-level edits.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-surface-border bg-surface-subtle p-1">
            <Button
              size="sm"
              variant={editorMode === "form" ? "primary" : "ghost"}
              onClick={() => onEditorModeChange("form")}
            >
              <LayoutTemplate className="mr-2 h-4 w-4" />
              Structured form
            </Button>
            <Button
              size="sm"
              variant={editorMode === "json" ? "primary" : "ghost"}
              onClick={() => onEditorModeChange("json")}
            >
              <FileJson className="mr-2 h-4 w-4" />
              Advanced JSON
            </Button>
          </div>
        </div>

        {editorMode === "form" ? (
          <div className="mt-6 space-y-4 border-t border-surface-border pt-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--theme-primary)]">
                Edit By Section
              </p>
              <p className="mt-2 text-sm text-ink-600">
                Choose the page section from the top row and edit only that area.
              </p>
            </div>

            <div className="-mx-1 overflow-x-auto px-1 pb-1">
              <div className="flex w-max min-w-full gap-3">
              {adminEditorSections.map((section) => {
                const isActive = section.id === activeSection;

                return (
                  <button
                    key={section.id}
                    type="button"
                    className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "border-[var(--theme-primary-border)] bg-[var(--theme-primary-soft)] shadow-soft"
                        : "border-surface-border bg-white hover:border-[color:var(--theme-primary-border)] hover:bg-surface-subtle"
                    }`}
                    onClick={() => onActiveSectionChange(section.id)}
                  >
                    {section.label}
                  </button>
                );
              })}
              </div>
            </div>

            <div className="rounded-3xl border border-surface-border bg-surface-subtle p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-primary)]">
                Current Section
              </p>
              <h3 className="mt-2 text-lg font-bold">{activeSectionConfig.label}</h3>
              <p className="mt-2 text-sm text-ink-600">{activeSectionConfig.description}</p>
            </div>
          </div>
        ) : null}
      </Card>

      {editorMode === "json" ? (
        <EditorCard
          title="Raw Configuration"
          description="Direct JSON editing remains available for advanced and bulk changes."
        >
          <Textarea
            value={editorValue}
            onChange={(event) => onJsonChange(event.target.value)}
            className="min-h-[820px] font-mono text-xs leading-6"
            spellCheck={false}
          />
        </EditorCard>
      ) : (
        <>
          {activeSection === "home" ? (
            <EditorCard
              title="Brand & Navigation"
              description="Manage the site identity copy and the header navigation links."
            >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Site name">
                <Input
                  value={config.content.siteName}
                  onChange={(event) => updateField(["content", "siteName"], event.target.value)}
                />
              </Field>
              <Field label="Site description">
                <Input
                  value={config.content.siteDescription}
                  onChange={(event) =>
                    updateField(["content", "siteDescription"], event.target.value)
                  }
                />
              </Field>
            </div>

            <LinkListEditor
              title="Navigation links"
              addLabel="Add link"
              items={config.content.navigation.items}
              onChange={(items) => updateField(["content", "navigation", "items"], items)}
            />
            </EditorCard>
          ) : null}

          {activeSection === "home" ? (
            <EditorCard
              title="Homepage"
              description="Configure homepage structure, hero messaging, and highlights."
            >
            <SectionControl
              section={heroSection}
              onChange={(section) => updateSection("hero", section)}
            />
            <SectionControl
              section={highlightsSection}
              onChange={(section) => updateSection("highlights", section)}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Hero eyebrow">
                <Input
                  value={config.content.hero.eyebrow}
                  onChange={(event) =>
                    updateField(["content", "hero", "eyebrow"], event.target.value)
                  }
                />
              </Field>
              <Field label="Hero title">
                <Input
                  value={config.content.hero.title}
                  onChange={(event) =>
                    updateField(["content", "hero", "title"], event.target.value)
                  }
                />
              </Field>
            </div>

            <Field label="Hero description">
              <Textarea
                value={config.content.hero.description}
                onChange={(event) =>
                  updateField(["content", "hero", "description"], event.target.value)
                }
                className="min-h-[160px]"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Primary CTA label">
                <Input
                  value={config.content.hero.primaryCta.label}
                  onChange={(event) =>
                    updateField(["content", "hero", "primaryCta", "label"], event.target.value)
                  }
                />
              </Field>
              <Field label="Primary CTA link">
                <Input
                  value={config.content.hero.primaryCta.href}
                  onChange={(event) =>
                    updateField(["content", "hero", "primaryCta", "href"], event.target.value)
                  }
                />
              </Field>
              <Field label="Secondary CTA label">
                <Input
                  value={config.content.hero.secondaryCta.label}
                  onChange={(event) =>
                    updateField(["content", "hero", "secondaryCta", "label"], event.target.value)
                  }
                />
              </Field>
              <Field label="Secondary CTA link">
                <Input
                  value={config.content.hero.secondaryCta.href}
                  onChange={(event) =>
                    updateField(["content", "hero", "secondaryCta", "href"], event.target.value)
                  }
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Hero illustration"
                hint="Upload directly to Firebase Storage or keep using a manual URL."
              >
                <FirebaseImageField
                  value={config.content.hero.illustrationSrc}
                  onChange={(value) => updateField(["content", "hero", "illustrationSrc"], value)}
                  uploadPath="site-assets/hero"
                  previewAlt={config.content.hero.illustrationAlt || "Hero illustration"}
                />
              </Field>
              <Field label="Hero illustration alt text">
                <Input
                  value={config.content.hero.illustrationAlt}
                  onChange={(event) =>
                    updateField(["content", "hero", "illustrationAlt"], event.target.value)
                  }
                />
              </Field>
              <Field label="Hero alignment">
                <select
                  className={selectClassName}
                  value={config.content.hero.alignment}
                  onChange={(event) =>
                    updateField(
                      ["content", "hero", "alignment"],
                      event.target.value as Alignment
                    )
                  }
                >
                  {alignmentOptions.map((alignment) => (
                    <option key={alignment} value={alignment}>
                      {alignment}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Hero width">
                <select
                  className={selectClassName}
                  value={config.content.hero.width}
                  onChange={(event) =>
                    updateField(["content", "hero", "width"], event.target.value as ContainerWidth)
                  }
                >
                  {widthOptions.map((width) => (
                    <option key={width} value={width}>
                      {width}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Highlights alignment">
                <select
                  className={selectClassName}
                  value={config.content.highlights.alignment}
                  onChange={(event) =>
                    updateField(
                      ["content", "highlights", "alignment"],
                      event.target.value as Alignment
                    )
                  }
                >
                  {alignmentOptions.map((alignment) => (
                    <option key={alignment} value={alignment}>
                      {alignment}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Highlights width">
                <select
                  className={selectClassName}
                  value={config.content.highlights.width}
                  onChange={(event) =>
                    updateField(
                      ["content", "highlights", "width"],
                      event.target.value as ContainerWidth
                    )
                  }
                >
                  {widthOptions.map((width) => (
                    <option key={width} value={width}>
                      {width}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Highlight items" hint="One line per highlight.">
              <Textarea
                value={joinLines(config.content.highlights.items)}
                onChange={(event) =>
                  updateField(["content", "highlights", "items"], parseLines(event.target.value))
                }
                className="min-h-[180px]"
              />
            </Field>
            </EditorCard>
          ) : null}

          {activeSection === "products" ? (
            <EditorCard
              title="Products"
              description="Edit the products page SEO, structure, and product cards."
            >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Products meta title">
                <Input
                  value={config.content.productsPage.metaTitle}
                  onChange={(event) =>
                    updateField(["content", "productsPage", "metaTitle"], event.target.value)
                  }
                />
              </Field>
              <Field label="Products meta description">
                <Input
                  value={config.content.productsPage.metaDescription}
                  onChange={(event) =>
                    updateField(
                      ["content", "productsPage", "metaDescription"],
                      event.target.value
                    )
                  }
                />
              </Field>
              <Field label="Products eyebrow">
                <Input
                  value={config.content.productsPage.eyebrow}
                  onChange={(event) =>
                    updateField(["content", "productsPage", "eyebrow"], event.target.value)
                  }
                />
              </Field>
              <Field label="Products title">
                <Input
                  value={config.content.productsPage.title}
                  onChange={(event) =>
                    updateField(["content", "productsPage", "title"], event.target.value)
                  }
                />
              </Field>
            </div>

            <Field label="Products page description">
              <Textarea
                value={config.content.productsPage.description}
                onChange={(event) =>
                  updateField(["content", "productsPage", "description"], event.target.value)
                }
                className="min-h-[160px]"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Product card eyebrow">
                <Input
                  value={config.content.productsPage.cardLabels.eyebrow}
                  onChange={(event) =>
                    updateField(
                      ["content", "productsPage", "cardLabels", "eyebrow"],
                      event.target.value
                    )
                  }
                />
              </Field>
              <Field label="Tech stack heading">
                <Input
                  value={config.content.productsPage.cardLabels.techStackHeading}
                  onChange={(event) =>
                    updateField(
                      ["content", "productsPage", "cardLabels", "techStackHeading"],
                      event.target.value
                    )
                  }
                />
              </Field>
              <Field label="Features heading">
                <Input
                  value={config.content.productsPage.cardLabels.featuresHeading}
                  onChange={(event) =>
                    updateField(
                      ["content", "productsPage", "cardLabels", "featuresHeading"],
                      event.target.value
                    )
                  }
                />
              </Field>
              <Field label="Use case heading">
                <Input
                  value={config.content.productsPage.cardLabels.useCaseHeading}
                  onChange={(event) =>
                    updateField(
                      ["content", "productsPage", "cardLabels", "useCaseHeading"],
                      event.target.value
                    )
                  }
                />
              </Field>
            </div>

            <ProductListEditor
              items={config.content.productsPage.products}
              onChange={(items) => updateField(["content", "productsPage", "products"], items)}
            />
            </EditorCard>
          ) : null}

          {activeSection === "blogs" ? (
            <EditorCard
              title="Blogs"
              description="Edit the blog page SEO, article copy, and cover image."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Blog meta title">
                  <Input
                    value={config.content.blogPage.metaTitle}
                    onChange={(event) =>
                      updateField(["content", "blogPage", "metaTitle"], event.target.value)
                    }
                  />
                </Field>
                <Field label="Blog meta description">
                  <Input
                    value={config.content.blogPage.metaDescription}
                    onChange={(event) =>
                      updateField(["content", "blogPage", "metaDescription"], event.target.value)
                    }
                  />
                </Field>
                <Field label="Blog eyebrow">
                  <Input
                    value={config.content.blogPage.eyebrow}
                    onChange={(event) =>
                      updateField(["content", "blogPage", "eyebrow"], event.target.value)
                    }
                  />
                </Field>
                <Field label="Blog title">
                  <Input
                    value={config.content.blogPage.title}
                    onChange={(event) =>
                      updateField(["content", "blogPage", "title"], event.target.value)
                    }
                  />
                </Field>
                <Field
                  label="Blog image"
                  hint="Upload to Firebase Storage or enter an existing image URL."
                >
                  <FirebaseImageField
                    value={config.content.blogPage.imageSrc}
                    onChange={(value) => updateField(["content", "blogPage", "imageSrc"], value)}
                    uploadPath="site-assets/blog"
                    previewAlt={config.content.blogPage.imageAlt || "Blog image"}
                  />
                </Field>
                <Field label="Blog image alt text">
                  <Input
                    value={config.content.blogPage.imageAlt}
                    onChange={(event) =>
                      updateField(["content", "blogPage", "imageAlt"], event.target.value)
                    }
                  />
                </Field>
              </div>

              <Field label="Blog paragraphs" hint="One paragraph per line.">
                <Textarea
                  value={joinLines(config.content.blogPage.paragraphs)}
                  onChange={(event) =>
                    updateField(
                      ["content", "blogPage", "paragraphs"],
                      parseLines(event.target.value)
                    )
                  }
                  className="min-h-[220px]"
                />
              </Field>
            </EditorCard>
          ) : null}

          {activeSection === "about" ? (
            <EditorCard
              title="About"
              description="Manage About page SEO, company vision, leadership message, and team."
            >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="About meta title">
                <Input
                  value={config.content.aboutPage.metaTitle}
                  onChange={(event) =>
                    updateField(["content", "aboutPage", "metaTitle"], event.target.value)
                  }
                />
              </Field>
              <Field label="About meta description">
                <Input
                  value={config.content.aboutPage.metaDescription}
                  onChange={(event) =>
                    updateField(["content", "aboutPage", "metaDescription"], event.target.value)
                  }
                />
              </Field>
              <Field label="Vision eyebrow">
                <Input
                  value={config.content.aboutPage.vision.eyebrow}
                  onChange={(event) =>
                    updateField(["content", "aboutPage", "vision", "eyebrow"], event.target.value)
                  }
                />
              </Field>
              <Field label="Vision title">
                <Input
                  value={config.content.aboutPage.vision.title}
                  onChange={(event) =>
                    updateField(["content", "aboutPage", "vision", "title"], event.target.value)
                  }
                />
              </Field>
            </div>

            <Field label="Vision description">
              <Textarea
                value={config.content.aboutPage.vision.description}
                onChange={(event) =>
                  updateField(
                    ["content", "aboutPage", "vision", "description"],
                    event.target.value
                  )
                }
                className="min-h-[160px]"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="CEO message eyebrow">
                <Input
                  value={config.content.aboutPage.ceoMessage.eyebrow}
                  onChange={(event) =>
                    updateField(
                      ["content", "aboutPage", "ceoMessage", "eyebrow"],
                      event.target.value
                    )
                  }
                />
              </Field>
              <Field label="CEO signature">
                <Input
                  value={config.content.aboutPage.ceoMessage.signature}
                  onChange={(event) =>
                    updateField(
                      ["content", "aboutPage", "ceoMessage", "signature"],
                      event.target.value
                    )
                  }
                />
              </Field>
            </div>

            <Field label="CEO quote">
              <Textarea
                value={config.content.aboutPage.ceoMessage.quote}
                onChange={(event) =>
                  updateField(["content", "aboutPage", "ceoMessage", "quote"], event.target.value)
                }
                className="min-h-[160px]"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Team eyebrow">
                <Input
                  value={config.content.aboutPage.team.eyebrow}
                  onChange={(event) =>
                    updateField(["content", "aboutPage", "team", "eyebrow"], event.target.value)
                  }
                />
              </Field>
              <Field label="Team title">
                <Input
                  value={config.content.aboutPage.team.title}
                  onChange={(event) =>
                    updateField(["content", "aboutPage", "team", "title"], event.target.value)
                  }
                />
              </Field>
            </div>

            <TeamListEditor
              items={config.content.aboutPage.team.members}
              onChange={(items) => updateField(["content", "aboutPage", "team", "members"], items)}
            />
            </EditorCard>
          ) : null}

          {activeSection === "contact" ? (
            <EditorCard
              title="Contact"
              description="Update contact page SEO, company details, social links, and form labels."
            >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Contact meta title">
                <Input
                  value={config.content.contactPage.metaTitle}
                  onChange={(event) =>
                    updateField(["content", "contactPage", "metaTitle"], event.target.value)
                  }
                />
              </Field>
              <Field label="Contact meta description">
                <Input
                  value={config.content.contactPage.metaDescription}
                  onChange={(event) =>
                    updateField(["content", "contactPage", "metaDescription"], event.target.value)
                  }
                />
              </Field>
              <Field label="Contact eyebrow">
                <Input
                  value={config.content.contactPage.eyebrow}
                  onChange={(event) =>
                    updateField(["content", "contactPage", "eyebrow"], event.target.value)
                  }
                />
              </Field>
              <Field label="Contact title">
                <Input
                  value={config.content.contactPage.title}
                  onChange={(event) =>
                    updateField(["content", "contactPage", "title"], event.target.value)
                  }
                />
              </Field>
            </div>

            <Field label="Contact description">
              <Textarea
                value={config.content.contactPage.description}
                onChange={(event) =>
                  updateField(["content", "contactPage", "description"], event.target.value)
                }
                className="min-h-[160px]"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Address heading">
                <Input
                  value={config.content.contactPage.info.registeredAddressHeading}
                  onChange={(event) =>
                    updateField(
                      ["content", "contactPage", "info", "registeredAddressHeading"],
                      event.target.value
                    )
                  }
                />
              </Field>
              <Field label="Email heading">
                <Input
                  value={config.content.contactPage.info.emailHeading}
                  onChange={(event) =>
                    updateField(
                      ["content", "contactPage", "info", "emailHeading"],
                      event.target.value
                    )
                  }
                />
              </Field>
              <Field label="Contact email">
                <Input
                  value={config.content.contactPage.info.email}
                  onChange={(event) =>
                    updateField(["content", "contactPage", "info", "email"], event.target.value)
                  }
                />
              </Field>
              <Field label="Social heading">
                <Input
                  value={config.content.contactPage.info.socialHeading}
                  onChange={(event) =>
                    updateField(
                      ["content", "contactPage", "info", "socialHeading"],
                      event.target.value
                    )
                  }
                />
              </Field>
            </div>

            <Field label="Registered address" hint="One line per address line.">
              <Textarea
                value={joinLines(config.content.contactPage.info.address)}
                onChange={(event) =>
                  updateField(
                    ["content", "contactPage", "info", "address"],
                    parseLines(event.target.value)
                  )
                }
                className="min-h-[180px]"
              />
            </Field>

            <LinkListEditor
              title="Contact social links"
              addLabel="Add social link"
              items={config.content.contactPage.info.socialLinks}
              onChange={(items) => updateField(["content", "contactPage", "info", "socialLinks"], items)}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Form eyebrow">
                <Input
                  value={config.content.contactPage.form.eyebrow}
                  onChange={(event) =>
                    updateField(["content", "contactPage", "form", "eyebrow"], event.target.value)
                  }
                />
              </Field>
              <Field label="Form title">
                <Input
                  value={config.content.contactPage.form.title}
                  onChange={(event) =>
                    updateField(["content", "contactPage", "form", "title"], event.target.value)
                  }
                />
              </Field>
              <Field label="Submit button label">
                <Input
                  value={config.content.contactPage.form.submitLabel}
                  onChange={(event) =>
                    updateField(
                      ["content", "contactPage", "form", "submitLabel"],
                      event.target.value
                    )
                  }
                />
              </Field>
            </div>

            <Field label="Form description">
              <Textarea
                value={config.content.contactPage.form.description}
                onChange={(event) =>
                  updateField(
                    ["content", "contactPage", "form", "description"],
                    event.target.value
                  )
                }
                className="min-h-[160px]"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              {contactFormFields.map(([key, label]) => (
                <Field key={key} label={label}>
                  <Input
                    value={config.content.contactPage.form.fields[key]}
                    onChange={(event) =>
                      updateField(
                        ["content", "contactPage", "form", "fields", key],
                        event.target.value
                      )
                    }
                  />
                </Field>
              ))}
            </div>
            </EditorCard>
          ) : null}

          {activeSection === "home" ? (
            <EditorCard
              title="Footer & Theme"
              description="Control footer contact blocks and the site-wide visual system."
            >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Footer brand name">
                <Input
                  value={config.footer.brandName}
                  onChange={(event) => updateField(["footer", "brandName"], event.target.value)}
                />
              </Field>
              <Field label="Footer email">
                <Input
                  value={config.footer.email}
                  onChange={(event) => updateField(["footer", "email"], event.target.value)}
                />
              </Field>
              <Field label="Footer contact heading">
                <Input
                  value={config.footer.contactHeading}
                  onChange={(event) =>
                    updateField(["footer", "contactHeading"], event.target.value)
                  }
                />
              </Field>
              <Field label="Footer social heading">
                <Input
                  value={config.footer.socialHeading}
                  onChange={(event) =>
                    updateField(["footer", "socialHeading"], event.target.value)
                  }
                />
              </Field>
              <Field label="Footer alignment">
                <select
                  className={selectClassName}
                  value={config.footer.alignment}
                  onChange={(event) =>
                    updateField(["footer", "alignment"], event.target.value as Alignment)
                  }
                >
                  {alignmentOptions.map((alignment) => (
                    <option key={alignment} value={alignment}>
                      {alignment}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Primary color">
                <div className="flex gap-3">
                  <Input
                    value={config.theme.primary}
                    onChange={(event) => updateField(["theme", "primary"], event.target.value)}
                  />
                  <input
                    type="color"
                    value={config.theme.primary}
                    className="h-12 w-16 rounded-2xl border border-surface-border bg-white p-2"
                    onChange={(event) => updateField(["theme", "primary"], event.target.value)}
                  />
                </div>
              </Field>
              <Field label="Theme mode">
                <select
                  className={selectClassName}
                  value={config.theme.mode}
                  onChange={(event) =>
                    updateField(["theme", "mode"], event.target.value as ThemeMode)
                  }
                >
                  {themeModeOptions.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Background palette">
                <Input
                  value={config.theme.backgroundPalette}
                  onChange={(event) =>
                    updateField(["theme", "backgroundPalette"], event.target.value)
                  }
                />
              </Field>
              <Field label="Section style">
                <Input
                  value={config.theme.sectionStyle}
                  onChange={(event) =>
                    updateField(["theme", "sectionStyle"], event.target.value)
                  }
                />
              </Field>
              <Field label="Card style">
                <Input
                  value={config.theme.cardStyle}
                  onChange={(event) => updateField(["theme", "cardStyle"], event.target.value)}
                />
              </Field>
            </div>

            <Field label="Footer text">
              <Textarea
                value={config.footer.text}
                onChange={(event) => updateField(["footer", "text"], event.target.value)}
                className="min-h-[140px]"
              />
            </Field>

            <Field label="Footer address" hint="One line per address line.">
              <Textarea
                value={joinLines(config.footer.address)}
                onChange={(event) =>
                  updateField(["footer", "address"], parseLines(event.target.value))
                }
                className="min-h-[180px]"
              />
            </Field>

            <LinkListEditor
              title="Footer links"
              addLabel="Add footer link"
              items={config.footer.links}
              onChange={(items) => updateField(["footer", "links"], items)}
            />
            </EditorCard>
          ) : null}
        </>
      )}
    </div>
  );
}
