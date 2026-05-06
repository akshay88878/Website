import type { ProductDetailSection, ProductItem, ProductsPageContent } from "@/types/siteConfig";
import { ImageCarousel } from "./ImageCarousel";

type ProductCardProps = {
  product: ProductItem;
  labels: ProductsPageContent["cardLabels"];
  index?: number;
};

function renderSectionContent(section: ProductDetailSection) {
  if (section.style === "tags") {
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {(section.items ?? []).map((item) => (
          <span
            key={item}
            className="whitespace-pre-line rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
          >
            {item}
          </span>
        ))}
      </div>
    );
  }

  if (section.style === "list") {
    return (
      <ul className="mt-3 space-y-2 text-sm text-ink-600">
        {(section.items ?? []).map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-2 h-2 w-2 rounded-full bg-accent-400" />
            <span className="whitespace-pre-line">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return <p className="mt-3 whitespace-pre-line text-sm text-ink-600">{section.body}</p>;
}

export function ProductCard({ product, labels, index = 0 }: ProductCardProps) {
  const imageSizeClasses = {
    small: "h-64",
    medium: "h-80",
    large: "h-96"
  };

  const sizeClass = imageSizeClasses[product.imageSize ?? "medium"];
  const isImageLeft = index % 2 === 0;

  // Use multiple images if available, otherwise fall back to single image
  const imagesToDisplay = (product.images && product.images.length > 0) 
    ? product.images 
    : (product.image ? [product.image] : []);

  const imageElement = imagesToDisplay.length > 0 ? (
    <ImageCarousel
      images={imagesToDisplay}
      alt={product.title}
      sizeClass={sizeClass}
      autoSlideEnabled={product.imageAutoSlideEnabled}
      autoSlideDelay={product.imageAutoSlideDelay ?? 3}
    />
  ) : (
    <div className={`${sizeClass} flex items-center justify-center rounded-3xl bg-surface-subtle`}>
      <p className="text-sm text-ink-400">No image</p>
    </div>
  );

  const contentElement = (
    <div className="flex flex-col justify-start">
      <div>
        <p className="whitespace-pre-line text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
          {labels.eyebrow}
        </p>
        <h2 className="mt-4 whitespace-pre-line text-2xl font-bold">{product.title}</h2>
        <p className="mt-4 whitespace-pre-line text-base text-ink-600">
          {product.description}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {product.detailSections
          .filter((section) =>
            section.style === "text"
              ? Boolean(section.body?.trim())
              : Boolean(section.items?.length)
          )
          .map((section, sectionIndex) => (
            <div key={`${product.title}-${section.heading || "section"}-${sectionIndex}`}>
              {section.heading.trim() ? (
                <h3 className="whitespace-pre-line text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
                  {section.heading}
                </h3>
              ) : null}
              {renderSectionContent(section)}
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center py-16">
      {isImageLeft ? (
        <>
          {imageElement}
          {contentElement}
        </>
      ) : (
        <>
          {contentElement}
          {imageElement}
        </>
      )}
    </div>
  );
}
