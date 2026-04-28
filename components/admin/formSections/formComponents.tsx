import { memo, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { LinkItem, ProductItem, TeamMember } from "@/types/siteConfig";
import { removeAt, replaceAt } from "./formUtils";

const selectClassName =
  "flex h-12 w-full rounded-2xl border border-surface-border bg-white px-4 text-sm text-ink-900 shadow-sm outline-none transition duration-200 focus:border-[color:var(--theme-primary-border)] focus:ring-4 focus:ring-[var(--theme-primary-soft)]";
const checkboxClassName =
  "h-5 w-5 rounded border border-surface-border text-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary-soft)]";

export const Field = memo(function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-ink-900">{label}</label>
        {hint ? <p className="text-xs text-ink-500">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
});

export const EditorCard = memo(function EditorCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-ink-600">{description}</p>
      <div className="mt-6 space-y-5">{children}</div>
    </Card>
  );
});

export const LinkListEditor = memo(function LinkListEditor({
  title,
  items,
  addLabel,
  onChange
}: {
  title: string;
  items: LinkItem[];
  addLabel: string;
  onChange: (items: LinkItem[]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, { label: "", url: "" }])}
        >
          <Plus className="mr-2 h-4 w-4" />
          {addLabel}
        </Button>
      </div>

      {items.length ? (
        items.map((item, index) => (
          <div key={`${title}-${index}`} className="rounded-3xl border border-surface-border p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink-900">Item {index + 1}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange(removeAt(items, index))}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Label">
                <Input
                  value={item.label}
                  onChange={(event) =>
                    onChange(
                      replaceAt(items, index, {
                        ...item,
                        label: event.target.value
                      })
                    )
                  }
                />
              </Field>
              <Field label="URL">
                <Input
                  value={item.url}
                  onChange={(event) =>
                    onChange(
                      replaceAt(items, index, {
                        ...item,
                        url: event.target.value
                      })
                    )
                  }
                />
              </Field>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-3xl border border-dashed border-surface-border p-4 text-sm text-ink-500">
          No items configured.
        </div>
      )}
    </div>
  );
});

export { selectClassName, checkboxClassName };
