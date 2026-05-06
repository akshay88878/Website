import { memo } from "react";
import { FirebaseImageField } from "@/components/admin/FirebaseImageField";
import type { Alignment, ContainerWidth, SiteConfig } from "@/types/siteConfig";
import { EditorCard, Field, LinkListEditor, selectClassName } from "./formComponents";
import { setField } from "./formUtils";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type FormSectionProps = {
  config: SiteConfig;
  onChange: (nextConfig: SiteConfig) => void;
};

const alignmentOptions: Alignment[] = ["left", "center", "right"];
const widthOptions: ContainerWidth[] = ["narrow", "default", "wide", "full"];

export const HomeFormSection = memo(function HomeFormSection({
  config,
  onChange
}: FormSectionProps) {
  const updateField = (path: string[], value: unknown) => onChange(setField(config, path, value));

  return (
    <>
      <EditorCard
        title="Brand & Navigation"
        description="Manage the header brand name, site identity copy, and header navigation links."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Header/site name">
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

      <EditorCard title="Homepage" description="Hero and highlights configuration.">
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
          <Field label="Hero image">
            <FirebaseImageField
              value={config.content.hero.illustrationSrc}
              onChange={(value) => updateField(["content", "hero", "illustrationSrc"], value)}
              uploadPath="site-config/blog"
              previewAlt={config.content.hero.illustrationAlt || "Hero image"}
            />
          </Field>
          <Field label="Hero image alt text">
            <Input
              value={config.content.hero.illustrationAlt}
              onChange={(event) =>
                updateField(["content", "hero", "illustrationAlt"], event.target.value)
              }
            />
          </Field>
        </div>

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
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
          <Field label="Hero alignment">
            <select
              className={selectClassName}
              value={config.content.hero.alignment}
              onChange={(event) =>
                updateField(["content", "hero", "alignment"], event.target.value as Alignment)
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

        <Field
          label="Hero top spacing"
          hint={`Controls the space below the navbar. Current value: ${config.content.hero.topSpacing}%`}
        >
          <div className="space-y-3">
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={config.content.hero.topSpacing}
              onChange={(event) =>
                updateField(["content", "hero", "topSpacing"], Number(event.target.value))
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-border accent-[var(--theme-primary)]"
            />
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span>Less</span>
              <span>{config.content.hero.topSpacing}%</span>
              <span>More</span>
            </div>
          </div>
        </Field>
      </EditorCard>
    </>
  );
});
