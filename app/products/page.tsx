import type { Metadata } from "next";

import { ProductCard } from "@/components/products/ProductCard";
import { createMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/services/siteConfigStore";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  return createMetadata({
    title: config.content.productsPage.metaTitle,
    description: config.content.productsPage.metaDescription,
    path: "/products"
  });
}

export default async function ProductsPage() {
  const config = await getSiteConfig();
  const pageContent = config.content.productsPage;

  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
            {pageContent.eyebrow}
          </p>
          <h1 className="section-title mt-4">{pageContent.title}</h1>
          <p className="section-copy mt-5">{pageContent.description}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {pageContent.products.map((product) => (
            <ProductCard
              key={product.title}
              product={product}
              labels={pageContent.cardLabels}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
