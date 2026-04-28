import { memo } from "react";
import type { Alignment, ContainerWidth, SiteConfig } from "@/types/siteConfig";
import { EditorCard, Field, selectClassName } from "./formComponents";
import { setField } from "./formUtils";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type FormSectionProps = {
  config: SiteConfig;
  onChange: (nextConfig: SiteConfig) => void;
};

const alignmentOptions: Alignment[] = ["left", "center", "right"];
const widthOptions: ContainerWidth[] = ["narrow", "default", "wide", "full"];

export const ProductsFormSection = memo(function ProductsFormSection({
  config,
  onChange
}: FormSectionProps) {
  const updateField = (path: string[], value: unknown) => onChange(setField(config, path, value));
  const pageContent = config.content.productsPage;

  return (
    <EditorCard
      title="Products"
      description="Edit the products page SEO, structure, and product cards."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Products meta title">
          <Input
            value={pageContent.metaTitle}
            onChange={(event) =>
              updateField(["content", "productsPage", "metaTitle"], event.target.value)
            }
          />
        </Field>
        <Field label="Products meta description">
          <Input
            value={pageContent.metaDescription}
            onChange={(event) =>
              updateField(["content", "productsPage", "metaDescription"], event.target.value)
            }
          />
        </Field>
        <Field label="Products eyebrow">
          <Input
            value={pageContent.eyebrow}
            onChange={(event) =>
              updateField(["content", "productsPage", "eyebrow"], event.target.value)
            }
          />
        </Field>
        <Field label="Products title">
          <Input
            value={pageContent.title}
            onChange={(event) =>
              updateField(["content", "productsPage", "title"], event.target.value)
            }
          />
        </Field>
      </div>

      <Field label="Products page description">
        <Textarea
          value={pageContent.description}
          onChange={(event) =>
            updateField(["content", "productsPage", "description"], event.target.value)
          }
          className="min-h-[160px]"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Products alignment">
          <select
            className={selectClassName}
            value={pageContent.alignment ?? "center"}
            onChange={(event) =>
              updateField(["content", "productsPage", "alignment"], event.target.value as Alignment)
            }
          >
            {alignmentOptions.map((alignment) => (
              <option key={alignment} value={alignment}>
                {alignment}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Products width">
          <select
            className={selectClassName}
            value={pageContent.width ?? "default"}
            onChange={(event) =>
              updateField(["content", "productsPage", "width"], event.target.value as ContainerWidth)
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
        <Field label="Product card eyebrow">
          <Input
            value={pageContent.cardLabels.eyebrow}
            onChange={(event) =>
              updateField(["content", "productsPage", "cardLabels", "eyebrow"], event.target.value)
            }
          />
        </Field>
        <Field label="Tech stack heading">
          <Input
            value={pageContent.cardLabels.techStackHeading}
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
            value={pageContent.cardLabels.featuresHeading}
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
            value={pageContent.cardLabels.useCaseHeading}
            onChange={(event) =>
              updateField(
                ["content", "productsPage", "cardLabels", "useCaseHeading"],
                event.target.value
              )
            }
          />
        </Field>
      </div>
    </EditorCard>
  );
});
