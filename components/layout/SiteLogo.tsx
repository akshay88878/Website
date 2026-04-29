import Image from "next/image";

import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  priority?: boolean;
  brandName?: string;
};

export function SiteLogo({
  className,
  imageClassName,
  textClassName,
  priority = false,
  brandName = "Site"
}: SiteLogoProps) {
  const resolvedBrandName = brandName.trim() || "Site";

  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "overflow-hidden rounded-2xl border border-ink-900/10 shadow-soft",
          imageClassName
        )}
      >
        <Image
          src="/logo.jpeg"
          alt={`${resolvedBrandName} logo`}
          width={56}
          height={56}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </span>
      <span
        className={cn(
          "whitespace-pre-line font-display text-lg font-bold tracking-[0.2em] text-ink-900",
          textClassName
        )}
      >
        {resolvedBrandName}
      </span>
    </span>
  );
}
