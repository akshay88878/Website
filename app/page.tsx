import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";

const highlights = [
  "AI-led lesson intelligence",
  "Teacher-first classroom workflows",
  "Built for modern Indian learning environments"
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="container grid min-h-[calc(100vh-5rem)] items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="animate-fade-in-up text-center lg:text-left">
          <span className="inline-flex rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-600 shadow-sm">
            Learning Intelligence for India
          </span>
          <h1 className="mt-8 text-5xl font-bold leading-tight md:text-6xl lg:max-w-xl">
            Empowering every learner in India with AI-driven teaching.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-600 lg:max-w-xl">
            LOMAS AI helps institutions modernize classrooms with intelligent
            lesson support, engaging student experiences, and scalable digital
            learning workflows.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/products">
              <Button size="lg">Explore Products</Button>
            </Link>
            <Link href="/contact-us">
              <Button variant="outline" size="lg">
                Speak to the Team
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/70 bg-white/85 px-4 py-4 text-sm font-medium text-ink-700 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl animate-fade-in-up">
          <div className="absolute inset-8 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute left-8 top-10 h-24 w-24 animate-pulse-ring rounded-full bg-accent-200/70 blur-xl" />
          <div className="glass-panel relative overflow-hidden p-5">
            <Image
              src="/images/hero-illustration.svg"
              alt="AI robot teaching learners in a modern digital classroom"
              width={880}
              height={760}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
