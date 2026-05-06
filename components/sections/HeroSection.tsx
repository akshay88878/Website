import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { getContainerWidth, getFlexAlignClass, getTextAlignClass } from "@/lib/layoutUtils";
import { cn } from "@/lib/utils";
import type { HeroContent, SectionConfig } from "@/types/siteConfig";

type HeroSectionProps = {
  data: HeroContent;
  section: SectionConfig;
};

export function HeroSection({ data, section }: HeroSectionProps) {
  const alignment = section.alignment || data.alignment;
  const width = section.width || data.width;
  const spacingPercent = Math.max(0, Math.min(100, data.topSpacing));
  const mobileTopSpacing = `${spacingPercent * 0.05}rem`;
  const desktopTopSpacing = `${spacingPercent * 0.07}rem`;

  return (
    <section
      className="container pb-16 pt-[var(--hero-top-spacing-mobile)] lg:pb-24 lg:pt-[var(--hero-top-spacing-desktop)]"
      style={
        {
          "--hero-top-spacing-mobile": mobileTopSpacing,
          "--hero-top-spacing-desktop": desktopTopSpacing
        } as CSSProperties
      }
    >
      <div
        className={cn(
          "grid min-h-[calc(100vh-5rem)] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]",
          getContainerWidth(width)
        )}
      >
        <div className={cn("animate-fade-in-up", getTextAlignClass(alignment))}>
          <span className="theme-eyebrow inline-flex whitespace-pre-line rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] shadow-sm">
            {data.eyebrow}
          </span>
          <h1 className="mt-8 whitespace-pre-line text-5xl font-bold leading-tight md:text-6xl lg:max-w-xl">
            {data.title}
          </h1>
          <p className="mt-6 max-w-2xl whitespace-pre-line text-lg lg:max-w-xl">
            {data.description}
          </p>

          <div
            className={cn(
              "mt-8 flex flex-col gap-4 sm:flex-row",
              alignment === "center"
                ? "sm:justify-center"
                : alignment === "right"
                  ? "sm:justify-end"
                  : "sm:justify-start",
              getFlexAlignClass(alignment)
            )}
          >
            <Link href={data.primaryCta.href}>
              <Button size="lg">{data.primaryCta.label}</Button>
            </Link>
            <Link href={data.secondaryCta.href}>
              <Button variant="outline" size="lg">
                {data.secondaryCta.label}
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl animate-fade-in-up">
          <div className="absolute inset-8 rounded-full bg-[var(--theme-primary-soft)] blur-3xl" />
          <div className="absolute left-8 top-10 h-24 w-24 animate-pulse-ring rounded-full bg-cyan-200/70 blur-xl" />
          <div className="glass-panel relative overflow-hidden p-5">
            <Image
              src={data.illustrationSrc}
              alt={data.illustrationAlt}
              width={880}
              height={760}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
