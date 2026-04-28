import { memo } from "react";
import type { SiteConfig } from "@/types/siteConfig";
import { EditorCard, Field } from "./formComponents";
import { setField } from "./formUtils";
import { Input } from "@/components/ui/Input";

type FormSectionProps = {
  config: SiteConfig;
  onChange: (nextConfig: SiteConfig) => void;
};

export const ThemeFormSection = memo(function ThemeFormSection({
  config,
  onChange
}: FormSectionProps) {
  const updateField = (path: string[], value: unknown) => onChange(setField(config, path, value));
  const theme = config.theme;

  return (
    <EditorCard title="Theme Colors" description="Customize the site color scheme and styling.">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Primary color" hint="Hex color code (e.g., #4F46E5)">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme.primaryColor || theme.primary}
              onChange={(event) =>
                updateField(["theme", "primaryColor"], event.target.value)
              }
              className="h-10 w-16 cursor-pointer rounded-lg border border-surface-border"
            />
            <Input
              value={theme.primaryColor || theme.primary}
              onChange={(event) =>
                updateField(["theme", "primaryColor"], event.target.value)
              }
              className="flex-1"
            />
          </div>
        </Field>

        <Field label="Background color" hint="Hex color code (e.g., #FFFFFF)">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme.backgroundColor || "#FFFFFF"}
              onChange={(event) =>
                updateField(["theme", "backgroundColor"], event.target.value)
              }
              className="h-10 w-16 cursor-pointer rounded-lg border border-surface-border"
            />
            <Input
              value={theme.backgroundColor || "#FFFFFF"}
              onChange={(event) =>
                updateField(["theme", "backgroundColor"], event.target.value)
              }
              className="flex-1"
            />
          </div>
        </Field>

        <Field label="Text color" hint="Hex color code (e.g., #1F2937)">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme.textColor || "#1F2937"}
              onChange={(event) =>
                updateField(["theme", "textColor"], event.target.value)
              }
              className="h-10 w-16 cursor-pointer rounded-lg border border-surface-border"
            />
            <Input
              value={theme.textColor || "#1F2937"}
              onChange={(event) =>
                updateField(["theme", "textColor"], event.target.value)
              }
              className="flex-1"
            />
          </div>
        </Field>

        <Field label="Accent color" hint="Hex color code (e.g., #7C3AED)">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme.accentColor || "#7C3AED"}
              onChange={(event) =>
                updateField(["theme", "accentColor"], event.target.value)
              }
              className="h-10 w-16 cursor-pointer rounded-lg border border-surface-border"
            />
            <Input
              value={theme.accentColor || "#7C3AED"}
              onChange={(event) =>
                updateField(["theme", "accentColor"], event.target.value)
              }
              className="flex-1"
            />
          </div>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Theme mode">
          <select
            className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
            value={theme.mode}
            onChange={(event) => updateField(["theme", "mode"], event.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </Field>

        <Field label="Card style">
          <select
            className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
            value={theme.cardStyle}
            onChange={(event) => updateField(["theme", "cardStyle"], event.target.value)}
          >
            <option value="elevated">Elevated</option>
            <option value="flat">Flat</option>
            <option value="outlined">Outlined</option>
          </select>
        </Field>

        <Field label="Section style">
          <select
            className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
            value={theme.sectionStyle}
            onChange={(event) => updateField(["theme", "sectionStyle"], event.target.value)}
          >
            <option value="glass">Glass</option>
            <option value="solid">Solid</option>
            <option value="gradient">Gradient</option>
          </select>
        </Field>

        <Field label="Background palette">
          <select
            className="block w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm transition-colors focus:border-ink-400 focus:outline-none"
            value={theme.backgroundPalette}
            onChange={(event) => updateField(["theme", "backgroundPalette"], event.target.value)}
          >
            <option value="aurora">Aurora</option>
            <option value="neutral">Neutral</option>
            <option value="cool">Cool</option>
            <option value="warm">Warm</option>
          </select>
        </Field>
      </div>
    </EditorCard>
  );
});
