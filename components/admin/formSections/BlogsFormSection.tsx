import { memo } from "react";
import type { Alignment, ContainerWidth, SiteConfig } from "@/types/siteConfig";
import { EditorCard, Field } from "./formComponents";
import { setField, parseParagraphs, joinParagraphs } from "./formUtils";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type FormSectionProps = {
  config: SiteConfig;
  onChange: (nextConfig: SiteConfig) => void;
};

const alignmentOptions: Alignment[] = ["left", "center", "right"];
const widthOptions: ContainerWidth[] = ["narrow", "default", "wide", "full"];

export const BlogsFormSection = memo(function BlogsFormSection({
  config,
  onChange
}: FormSectionProps) {
  const updateField = (path: string[], value: unknown) => onChange(setField(config, path, value));
  const pageContent = config.content.blogPage;

  return (
    <EditorCard
      title="Blogs"
      description="Edit the blog page SEO, article copy, and cover image."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Blog meta title">
          <Input
            value={pageContent.metaTitle}
            onChange={(event) =>
              updateField(["content", "blogPage", "metaTitle"], event.target.value)
            }
          />
        </Field>
        <Field label="Blog meta description">
          <Input
            value={pageContent.metaDescription}
            onChange={(event) =>
              updateField(["content", "blogPage", "metaDescription"], event.target.value)
            }
          />
        </Field>
        <Field label="Blog eyebrow">
          <Input
            value={pageContent.eyebrow}
            onChange={(event) =>
              updateField(["content", "blogPage", "eyebrow"], event.target.value)
            }
          />
        </Field>
        <Field label="Blog title">
          <Input
            value={pageContent.title}
            onChange={(event) =>
              updateField(["content", "blogPage", "title"], event.target.value)
            }
          />
        </Field>
      </div>

      <Field label="Blog paragraphs" hint="Separate paragraphs with || (double pipe). Each paragraph can contain newlines for multi-line paragraphs.">
        <Textarea
          value={joinParagraphs(pageContent.paragraphs)}
          onChange={(event) =>
            updateField(
              ["content", "blogPage", "paragraphs"],
              parseParagraphs(event.target.value)
            )
          }
          className="min-h-[220px] font-mono text-xs"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Blog alignment">
          <select
            className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
            value={pageContent.alignment ?? "left"}
            onChange={(event) =>
              updateField(["content", "blogPage", "alignment"], event.target.value as Alignment)
            }
          >
            {alignmentOptions.map((alignment) => (
              <option key={alignment} value={alignment}>
                {alignment}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Blog width">
          <select
            className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
            value={pageContent.width ?? "default"}
            onChange={(event) =>
              updateField(["content", "blogPage", "width"], event.target.value as ContainerWidth)
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
  );
});
