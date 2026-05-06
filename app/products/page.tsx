import type { Metadata } from "next";

import { ProductCard } from "@/components/products/ProductCard";
import { createMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/services/siteConfigStore";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  return createMetadata({
    title: config.content.productsPage.metaTitle,
    description: config.content.productsPage.metaDescription,
    path: "/products",
    siteName: config.content.siteName
  });
}

export default async function ProductsPage() {
  const config = await getSiteConfig();
  const pageContent = config.content.productsPage;

  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <div className="max-w-3xl">
          <p className="whitespace-pre-line text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-primary)]">
            {pageContent.eyebrow}
          </p>
          <h1 className="section-title mt-4 whitespace-pre-line">{pageContent.title}</h1>
          <p className="section-copy mt-5 whitespace-pre-line">{pageContent.description}</p>
        </div>

        <div className="mt-12 space-y-0">
          {pageContent.products.map((product, index) => (
            <ProductCard
              key={product.title}
              product={product}
              labels={pageContent.cardLabels}
              index={index}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
