import { memo, type ReactNode } from "react";
import type { Alignment, ContainerWidth, SiteConfig } from "@/types/siteConfig";
import { EditorCard, Field, LinkListEditor, selectClassName, checkboxClassName } from "./formComponents";
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
      </EditorCard>
    </>
  );
});
