import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeRuntime } from "@/components/layout/ThemeRuntime";
import { createMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/services/siteConfigStore";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  return createMetadata({
    title: config.content.siteName,
    description: config.content.siteDescription,
    path: "/",
    siteName: config.content.siteName
  });
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();

  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="flex min-h-screen flex-col">
        <ThemeRuntime theme={config.theme} />
        <Navbar
          navigation={config.content.navigation.items}
          brandName={config.content.siteName}
        />
        <div className="flex-1">{children}</div>
        <Footer footer={config.footer} />
      </body>
    </html>
  );
}
