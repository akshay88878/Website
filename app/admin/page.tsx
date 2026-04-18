import type { Metadata } from "next";

import { AdminPanel } from "@/components/admin/AdminPanel";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Admin",
  description: "Minimal CMS interface for editing the centralized site config.",
  path: "/admin"
});

export default function AdminPage() {
  return (
    <main className="page-shell py-16 md:py-20">
      <section className="container">
        <AdminPanel />
      </section>
    </main>
  );
}
