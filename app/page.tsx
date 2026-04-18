import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getConfiguredSections } from "@/lib/sectionRegistry";
import { getSiteConfig } from "@/services/siteConfigStore";

export default async function HomePage() {
  const config = await getSiteConfig();
  const sections = getConfiguredSections(config.sections);

  return (
    <main className="page-shell">
      <SectionRenderer sections={sections} content={config.content} />
    </main>
  );
}
