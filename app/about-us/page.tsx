import type { Metadata } from "next";
import Image from "next/image";

import { Card } from "@/components/ui/Card";
import { teamMembers } from "@/data/team";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description:
    "Meet the LOMAS AI team building trusted AI products for learning environments.",
  path: "/about-us"
});

export default function AboutPage() {
  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container space-y-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              Vision
            </p>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              Building trusted AI infrastructure for every learning journey
            </h1>
            <p className="mt-6 text-base text-ink-600">
              We believe the future of education will be shaped by systems that
              increase teacher capacity, deepen student engagement, and make
              institutional operations more intelligent. Our work focuses on
              practical AI that respects classroom realities while elevating
              educational quality at scale.
            </p>
          </Card>

          <Card className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              CEO Message
            </p>
            <p className="mt-4 text-lg text-ink-700">
              “LOMAS AI exists to make advanced learning technology accessible,
              credible, and deeply useful for institutions across India. We are
              not building novelty. We are building dependable systems that help
              educators lead with more clarity and impact.”
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              Aarav Mehta, Founder & CEO
            </p>
          </Card>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Our Team
          </p>
          <h2 className="section-title mt-4">
            Cross-functional operators with an education-first lens
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {teamMembers.map((member) => (
              <Card key={member.name} className="p-6 text-center">
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border border-brand-100 bg-brand-50">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-5 text-xl font-bold">{member.name}</h3>
                <p className="mt-2 text-sm text-ink-500">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
