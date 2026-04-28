import { memo } from "react";
import type { Alignment, ContainerWidth, SiteConfig } from "@/types/siteConfig";
import { EditorCard, Field } from "./formComponents";
import { setField } from "./formUtils";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type FormSectionProps = {
  config: SiteConfig;
  onChange: (nextConfig: SiteConfig) => void;
};

const alignmentOptions: Alignment[] = ["left", "center", "right"];
const widthOptions: ContainerWidth[] = ["narrow", "default", "wide", "full"];

export const AboutFormSection = memo(function AboutFormSection({
  config,
  onChange
}: FormSectionProps) {
  const updateField = (path: string[], value: unknown) => onChange(setField(config, path, value));
  const pageContent = config.content.aboutPage;

  return (
    <>
      <EditorCard
        title="About"
        description="Manage About page SEO, company vision, and leadership message."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="About meta title">
            <Input
              value={pageContent.metaTitle}
              onChange={(event) =>
                updateField(["content", "aboutPage", "metaTitle"], event.target.value)
              }
            />
          </Field>
          <Field label="About meta description">
            <Input
              value={pageContent.metaDescription}
              onChange={(event) =>
                updateField(["content", "aboutPage", "metaDescription"], event.target.value)
              }
            />
          </Field>
        </div>
      </EditorCard>

      <EditorCard title="Vision Section" description="Configure vision section layout and content.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Vision title">
            <Input
              value={pageContent.vision.title}
              onChange={(event) =>
                updateField(["content", "aboutPage", "vision", "title"], event.target.value)
              }
            />
          </Field>
          <Field label="Vision eyebrow">
            <Input
              value={pageContent.vision.eyebrow}
              onChange={(event) =>
                updateField(["content", "aboutPage", "vision", "eyebrow"], event.target.value)
              }
            />
          </Field>
        </div>

        <Field label="Vision description">
          <Textarea
            value={pageContent.vision.description}
            onChange={(event) =>
              updateField(["content", "aboutPage", "vision", "description"], event.target.value)
            }
            className="min-h-[160px]"
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Vision alignment">
            <select
              className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
              value={pageContent.vision.alignment ?? "center"}
              onChange={(event) =>
                updateField(
                  ["content", "aboutPage", "vision", "alignment"],
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
          <Field label="Vision width">
            <select
              className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
              value={pageContent.vision.width ?? "default"}
              onChange={(event) =>
                updateField(
                  ["content", "aboutPage", "vision", "width"],
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
      </EditorCard>

      <EditorCard title="CEO Message" description="Configure CEO message section layout and content.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="CEO message eyebrow">
            <Input
              value={pageContent.ceoMessage.eyebrow}
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
              value={pageContent.ceoMessage.signature}
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
            value={pageContent.ceoMessage.quote}
            onChange={(event) =>
              updateField(["content", "aboutPage", "ceoMessage", "quote"], event.target.value)
            }
            className="min-h-[160px]"
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="CEO message alignment">
            <select
              className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
              value={pageContent.ceoMessage.alignment ?? "center"}
              onChange={(event) =>
                updateField(
                  ["content", "aboutPage", "ceoMessage", "alignment"],
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
          <Field label="CEO message width">
            <select
              className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
              value={pageContent.ceoMessage.width ?? "narrow"}
              onChange={(event) =>
                updateField(
                  ["content", "aboutPage", "ceoMessage", "width"],
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
      </EditorCard>

      <EditorCard title="Team Section" description="Configure team section layout and content.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Team eyebrow">
            <Input
              value={pageContent.team.eyebrow}
              onChange={(event) =>
                updateField(["content", "aboutPage", "team", "eyebrow"], event.target.value)
              }
            />
          </Field>
          <Field label="Team title">
            <Input
              value={pageContent.team.title}
              onChange={(event) =>
                updateField(["content", "aboutPage", "team", "title"], event.target.value)
              }
            />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Team heading alignment">
            <select
              className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
              value={pageContent.team.headingAlignment ?? pageContent.team.alignment ?? "center"}
              onChange={(event) =>
                updateField(
                  ["content", "aboutPage", "team", "headingAlignment"],
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
          <Field label="Team content alignment">
            <select
              className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
              value={pageContent.team.contentAlignment ?? pageContent.team.alignment ?? "center"}
              onChange={(event) =>
                updateField(
                  ["content", "aboutPage", "team", "contentAlignment"],
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
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Team width">
            <select
              className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
              value={pageContent.team.width ?? "wide"}
              onChange={(event) =>
                updateField(
                  ["content", "aboutPage", "team", "width"],
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
      </EditorCard>
    </>
  );
});
