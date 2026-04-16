import type { Metadata } from "next";
import Image from "next/image";

import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Blogs",
  description: "Insights on AI, learning systems, and the future of education.",
  path: "/blogs"
});

export default function BlogsPage() {
  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="glass-panel p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              Journal
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">
              Evolution of AI
            </h1>
            <div className="prose prose-lg mt-8 max-w-none prose-headings:font-display prose-headings:text-ink-900 prose-p:text-ink-600 prose-strong:text-ink-900">
              <p>
                Artificial intelligence has moved from theoretical promise to
                practical infrastructure. In education, that shift matters
                because schools now expect technology to improve outcomes, not
                just digitize old workflows.
              </p>
              <p>
                The first wave of AI tools automated repetitive tasks. The next
                wave is more consequential: systems that understand context,
                personalize recommendations, and help educators act with better
                timing and confidence.
              </p>
              <p>
                For learning environments, the opportunity is not simply to add
                more software. It is to create experiences where teachers stay
                in control while AI handles insight generation, orchestration,
                and support at scale.
              </p>
              <p>
                LOMAS AI is built around that model. We see AI as an operating
                layer for better teaching, stronger learner engagement, and more
                consistent educational delivery.
              </p>
            </div>
          </article>

          <aside className="glass-panel overflow-hidden p-5">
            <Image
              src="/images/blog-illustration.svg"
              alt="Illustration representing the evolution of artificial intelligence"
              width={720}
              height={860}
              className="h-full w-full rounded-[1.5rem] object-cover"
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
