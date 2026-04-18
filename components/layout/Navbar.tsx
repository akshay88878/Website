"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { SiteLogo } from "@/components/layout/SiteLogo";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/siteConfig";

type NavbarProps = {
  navigation: NavigationItem[];
  brandName: string;
};

export function Navbar({ navigation, brandName }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="container">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <SiteLogo
              brandName={brandName}
              priority
              imageClassName="h-12 w-12 rounded-xl"
              textClassName="text-base tracking-[0.18em] sm:text-lg"
            />
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.url;

              return (
                <Link
                  key={item.url}
                  href={item.url}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition-all duration-200 hover:bg-brand-50 hover:text-brand-700",
                    isActive && "bg-brand-50 text-brand-700"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface-border bg-white text-ink-900 transition hover:border-brand-200 hover:text-brand-600 md:hidden"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden bg-white/95 transition-[max-height] duration-300 md:hidden",
          isOpen ? "max-h-80 border-t border-white/70" : "max-h-0"
        )}
      >
        <div className="container py-4">
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.url;

              return (
                <Link
                  key={item.url}
                  href={item.url}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-medium text-ink-600 transition hover:bg-brand-50 hover:text-brand-700",
                    isActive && "bg-brand-50 text-brand-700"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
