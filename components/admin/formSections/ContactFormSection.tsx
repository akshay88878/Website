import { memo } from "react";
import type { Alignment, ContainerWidth, SiteConfig } from "@/types/siteConfig";
import { EditorCard, Field, LinkListEditor } from "./formComponents";
import { setField, contactFormFields } from "./formUtils";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type FormSectionProps = {
  config: SiteConfig;
  onChange: (nextConfig: SiteConfig) => void;
};

const alignmentOptions: Alignment[] = ["left", "center", "right"];
const widthOptions: ContainerWidth[] = ["narrow", "default", "wide", "full"];

export const ContactFormSection = memo(function ContactFormSection({
  config,
  onChange
}: FormSectionProps) {
  const updateField = (path: string[], value: unknown) => onChange(setField(config, path, value));
  const pageContent = config.content.contactPage;

  return (
    <EditorCard
      title="Contact"
      description="Manage contact details, social links, and enquiry form."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Contact meta title">
          <Input
            value={pageContent.metaTitle}
            onChange={(event) =>
              updateField(["content", "contactPage", "metaTitle"], event.target.value)
            }
          />
        </Field>
        <Field label="Contact meta description">
          <Input
            value={pageContent.metaDescription}
            onChange={(event) =>
              updateField(["content", "contactPage", "metaDescription"], event.target.value)
            }
          />
        </Field>
        <Field label="Contact eyebrow">
          <Input
            value={pageContent.eyebrow}
            onChange={(event) =>
              updateField(["content", "contactPage", "eyebrow"], event.target.value)
            }
          />
        </Field>
        <Field label="Contact title">
          <Input
            value={pageContent.title}
            onChange={(event) =>
              updateField(["content", "contactPage", "title"], event.target.value)
            }
          />
        </Field>
      </div>

      <Field label="Contact description">
        <Textarea
          value={pageContent.description}
          onChange={(event) =>
            updateField(["content", "contactPage", "description"], event.target.value)
          }
          className="min-h-[160px]"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Contact alignment">
          <select
            className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
            value={pageContent.alignment ?? "center"}
            onChange={(event) =>
              updateField(["content", "contactPage", "alignment"], event.target.value as Alignment)
            }
          >
            {alignmentOptions.map((alignment) => (
              <option key={alignment} value={alignment}>
                {alignment}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Contact width">
          <select
            className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
            value={pageContent.width ?? "default"}
            onChange={(event) =>
              updateField(["content", "contactPage", "width"], event.target.value as ContainerWidth)
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
        <Field label="Address heading">
          <Input
            value={pageContent.info.registeredAddressHeading}
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
            value={pageContent.info.emailHeading}
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
            value={pageContent.info.email}
            onChange={(event) =>
              updateField(["content", "contactPage", "info", "email"], event.target.value)
            }
          />
        </Field>
        <Field label="Social heading">
          <Input
            value={pageContent.info.socialHeading}
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
          value={pageContent.info.address.join("\n")}
          onChange={(event) =>
            updateField(
              ["content", "contactPage", "info", "address"],
              event.target.value
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean)
            )
          }
          className="min-h-[180px]"
        />
      </Field>

      <LinkListEditor
        title="Contact social links"
        addLabel="Add social link"
        items={pageContent.info.socialLinks}
        onChange={(items) => updateField(["content", "contactPage", "info", "socialLinks"], items)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Form eyebrow">
          <Input
            value={pageContent.form.eyebrow}
            onChange={(event) =>
              updateField(["content", "contactPage", "form", "eyebrow"], event.target.value)
            }
          />
        </Field>
        <Field label="Form title">
          <Input
            value={pageContent.form.title}
            onChange={(event) =>
              updateField(["content", "contactPage", "form", "title"], event.target.value)
            }
          />
        </Field>
        <Field label="Submit button label">
          <Input
            value={pageContent.form.submitLabel}
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
          value={pageContent.form.description}
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
              value={pageContent.form.fields[key]}
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
  );
});
