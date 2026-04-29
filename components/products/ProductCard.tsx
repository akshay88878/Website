import { Card } from "@/components/ui/Card";
import type { ProductItem, ProductsPageContent } from "@/types/siteConfig";

type ProductCardProps = {
  product: ProductItem;
  labels: ProductsPageContent["cardLabels"];
};

export function ProductCard({ product, labels }: ProductCardProps) {
  return (
    <Card className="group h-full p-8 hover:-translate-y-1">
      <div className="flex h-full flex-col">
        <div>
          <p className="whitespace-pre-line text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
            {labels.eyebrow}
          </p>
          <h2 className="mt-4 whitespace-pre-line text-2xl font-bold">{product.title}</h2>
          <p className="mt-4 whitespace-pre-line text-base text-ink-600">
            {product.description}
          </p>
        </div>

        <div className="mt-8 flex flex-1 flex-col gap-6">
          <section>
            <h3 className="whitespace-pre-line text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              {labels.techStackHeading}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.techStack.map((item) => (
                <span
                  key={item}
                  className="whitespace-pre-line rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="whitespace-pre-line text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              {labels.featuresHeading}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent-400" />
                  <span className="whitespace-pre-line">{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="whitespace-pre-line text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              {labels.useCaseHeading}
            </h3>
            <p className="mt-3 whitespace-pre-line text-sm text-ink-600">{product.useCase}</p>
          </section>
        </div>
      </div>
    </Card>
  );
}
