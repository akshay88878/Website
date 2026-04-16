import type { Metadata } from "next";

import { ProductCard } from "@/components/products/ProductCard";
import { products } from "@/data/products";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Products",
  description:
    "Explore LOMAS AI products designed for AI-enabled teaching and classroom engagement.",
  path: "/products"
});

export default function ProductsPage() {
  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Products
          </p>
          <h1 className="section-title mt-4">
            Intelligent products for modern education delivery
          </h1>
          <p className="section-copy mt-5">
            Our platform and hardware experiences are designed to support
            scalable AI adoption across institutions, classrooms, and student
            engagement programs.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
