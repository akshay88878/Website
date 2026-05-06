import { memo } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FirebaseImageField } from "@/components/admin/FirebaseImageField";
import type {
  Alignment,
  ContainerWidth,
  ProductDetailSection,
  ProductDetailSectionStyle,
  ProductItem,
  SiteConfig
} from "@/types/siteConfig";

import { EditorCard, Field, selectClassName } from "./formComponents";
import { joinLines, parseLines, removeAt, replaceAt, setField } from "./formUtils";

type FormSectionProps = {
  config: SiteConfig;
  onChange: (nextConfig: SiteConfig) => void;
};

const alignmentOptions: Alignment[] = ["left", "center", "right"];
const widthOptions: ContainerWidth[] = ["narrow", "default", "wide", "full"];
const detailSectionStyleOptions: ProductDetailSectionStyle[] = ["tags", "list", "text"];

function createEmptyDetailSection(): ProductDetailSection {
  return {
    heading: "",
    style: "text",
    body: ""
  };
}

function createEmptyProduct(): ProductItem {
  return {
    title: "",
    description: "",
    image: "",
    imageSize: "medium",
    detailSections: []
  };
}

export const ProductsFormSection = memo(function ProductsFormSection({
  config,
  onChange
}: FormSectionProps) {
  const updateField = (path: string[], value: unknown) => onChange(setField(config, path, value));
  const pageContent = config.content.productsPage;

  const updateProducts = (products: ProductItem[]) =>
    updateField(["content", "productsPage", "products"], products);

  const updateProduct = (productIndex: number, nextProduct: ProductItem) =>
    updateProducts(replaceAt(pageContent.products, productIndex, nextProduct));

  const updateDetailSection = (
    productIndex: number,
    sectionIndex: number,
    nextSection: ProductDetailSection
  ) => {
    const product = pageContent.products[productIndex];
    updateProduct(productIndex, {
      ...product,
      detailSections: replaceAt(product.detailSections, sectionIndex, nextSection)
    });
  };

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

      <Field label="Product card eyebrow">
        <Input
          value={pageContent.cardLabels.eyebrow}
          onChange={(event) =>
            updateField(["content", "productsPage", "cardLabels", "eyebrow"], event.target.value)
          }
        />
      </Field>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink-900">Products list</p>
          <Button variant="outline" size="sm" onClick={() => updateProducts([...pageContent.products, createEmptyProduct()])}>
            <Plus className="mr-2 h-4 w-4" />
            Add product
          </Button>
        </div>

        {pageContent.products.length ? (
          pageContent.products.map((product, productIndex) => (
            <div
              key={`product-${productIndex}`}
              className="rounded-3xl border border-surface-border p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink-900">
                  Product {productIndex + 1}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateProducts(removeAt(pageContent.products, productIndex))}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="Product title">
                  <Input
                    value={product.title}
                    onChange={(event) =>
                      updateProduct(productIndex, {
                        ...product,
                        title: event.target.value
                      })
                    }
                  />
                </Field>
                <Field label="Product description">
                  <Textarea
                    value={product.description}
                    onChange={(event) =>
                      updateProduct(productIndex, {
                        ...product,
                        description: event.target.value
                      })
                    }
                    className="min-h-[120px]"
                  />
                </Field>
              </div>

              <Field label="Product image">
                <FirebaseImageField
                  value={product.image ?? ""}
                  onChange={(url) =>
                    updateProduct(productIndex, {
                      ...product,
                      image: url
                    })
                  }
                  uploadPath="site-config/products"
                  previewAlt={product.title}
                />
              </Field>

              <Field label="Product image size">
                <select
                  className={selectClassName}
                  value={product.imageSize ?? "medium"}
                  onChange={(event) =>
                    updateProduct(productIndex, {
                      ...product,
                      imageSize: event.target.value as "small" | "medium" | "large"
                    })
                  }
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </Field>

              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`carousel-${productIndex}`}
                    checked={product.imageCarouselEnabled ?? false}
                    onChange={(event) =>
                      updateProduct(productIndex, {
                        ...product,
                        imageCarouselEnabled: event.target.checked,
                        images: event.target.checked && (!product.images || product.images.length === 0) 
                          ? (product.image ? [product.image] : [])
                          : product.images
                      })
                    }
                    className="h-4 w-4 rounded"
                  />
                  <label htmlFor={`carousel-${productIndex}`} className="text-sm font-medium text-ink-900">
                    Enable image gallery / carousel
                  </label>
                </div>

                {product.imageCarouselEnabled && (
                  <>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`autoslide-${productIndex}`}
                        checked={product.imageAutoSlideEnabled ?? false}
                        onChange={(event) =>
                          updateProduct(productIndex, {
                            ...product,
                            imageAutoSlideEnabled: event.target.checked
                          })
                        }
                        className="h-4 w-4 rounded"
                      />
                      <label htmlFor={`autoslide-${productIndex}`} className="text-sm font-medium text-ink-900">
                        Auto-slide images
                      </label>
                    </div>

                    {product.imageAutoSlideEnabled && (
                      <Field label="Auto-slide delay (seconds)">
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={product.imageAutoSlideDelay ?? 3}
                          onChange={(event) =>
                            updateProduct(productIndex, {
                              ...product,
                              imageAutoSlideDelay: parseInt(event.target.value, 10) || 3
                            })
                          }
                        />
                      </Field>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-ink-900">Gallery images</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateProduct(productIndex, {
                              ...product,
                              images: [...(product.images ?? []), ""]
                            })
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add image
                        </Button>
                      </div>

                      {(product.images ?? []).map((image, imageIndex) => (
                        <div key={`${productIndex}-image-${imageIndex}`} className="space-y-2 rounded-2xl bg-surface-subtle p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-medium text-ink-600">Image {imageIndex + 1}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateProduct(productIndex, {
                                  ...product,
                                  images: removeAt(product.images ?? [], imageIndex)
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <FirebaseImageField
                            value={image}
                            onChange={(url) =>
                              updateProduct(productIndex, {
                                ...product,
                                images: replaceAt(product.images ?? [], imageIndex, url)
                              })
                            }
                            uploadPath="site-config/products"
                            previewAlt={`${product.title} - Image ${imageIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink-900">Product sections</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateProduct(productIndex, {
                        ...product,
                        detailSections: [...product.detailSections, createEmptyDetailSection()]
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add section
                  </Button>
                </div>

                {product.detailSections.length ? (
                  product.detailSections.map((section, sectionIndex) => (
                    <div
                      key={`product-${productIndex}-section-${sectionIndex}`}
                      className="rounded-3xl border border-surface-border bg-surface/40 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-ink-900">
                          Section {sectionIndex + 1}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateProduct(productIndex, {
                              ...product,
                              detailSections: removeAt(product.detailSections, sectionIndex)
                            })
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <Field
                          label="Section heading"
                          hint="Leave blank if you want content without a heading."
                        >
                          <Input
                            value={section.heading}
                            onChange={(event) =>
                              updateDetailSection(productIndex, sectionIndex, {
                                ...section,
                                heading: event.target.value
                              })
                            }
                          />
                        </Field>
                        <Field label="Section style">
                          <select
                            className={selectClassName}
                            value={section.style}
                            onChange={(event) =>
                              updateDetailSection(productIndex, sectionIndex, {
                                heading: section.heading,
                                style: event.target.value as ProductDetailSectionStyle,
                                items:
                                  event.target.value === "text"
                                    ? undefined
                                    : section.items ?? [],
                                body:
                                  event.target.value === "text"
                                    ? section.body ?? ""
                                    : undefined
                              })
                            }
                          >
                            {detailSectionStyleOptions.map((style) => (
                              <option key={style} value={style}>
                                {style}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      {section.style === "text" ? (
                        <Field label="Section content">
                          <Textarea
                            value={section.body ?? ""}
                            onChange={(event) =>
                              updateDetailSection(productIndex, sectionIndex, {
                                ...section,
                                body: event.target.value
                              })
                            }
                            className="min-h-[120px]"
                          />
                        </Field>
                      ) : (
                        <Field
                          label="Section items"
                          hint="Enter one item per line."
                        >
                          <Textarea
                            value={joinLines(section.items ?? [])}
                            onChange={(event) =>
                              updateDetailSection(productIndex, sectionIndex, {
                                ...section,
                                items: parseLines(event.target.value)
                              })
                            }
                            className="min-h-[120px]"
                          />
                        </Field>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-surface-border p-4 text-sm text-ink-500">
                    No detail sections configured for this product.
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-surface-border p-4 text-sm text-ink-500">
            No products configured.
          </div>
        )}
      </div>
    </EditorCard>
  );
});
