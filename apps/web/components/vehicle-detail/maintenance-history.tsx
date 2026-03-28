"use client";

import { useState, useRef, FormEvent } from "react";
import { format } from "date-fns";
import { FiTool, FiEdit2, FiTrash2, FiCheck, FiX, FiLoader } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface MaintenanceEvent {
  id: string;
  serviceDate: Date | string;
  headline: string;
  odometer: number | null;
  costCents: number | null;
  location: string | null;
  notes: string | null;
}

interface MaintenanceHistoryProps {
  events: MaintenanceEvent[];
}

function MaintenanceEventRow({ event, onMutated }: { event: MaintenanceEvent; onMutated: () => void }) {
  const [mode, setMode] = useState<"view" | "edit" | "confirm-delete">("view");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/maintenance/${event.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Delete failed");
      }
      onMutated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setMode("view");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const costRaw = data.get("cost") as string;
    const odometerRaw = data.get("odometer") as string;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/maintenance/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceDate: data.get("serviceDate"),
          headline: data.get("headline"),
          odometer: odometerRaw ? parseInt(odometerRaw, 10) : null,
          costCents: costRaw ? Math.round(parseFloat(costRaw) * 100) : null,
          location: (data.get("location") as string) || null,
          notes: (data.get("notes") as string) || null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Save failed");
      }
      setMode("view");
      onMutated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-ink shadow-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200";

  if (mode === "edit") {
    return (
      <li className="py-4">
        <form ref={formRef} onSubmit={handleSave} className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-ink-subtle">Date</label>
              <input
                name="serviceDate"
                type="date"
                required
                defaultValue={format(new Date(event.serviceDate), "yyyy-MM-dd")}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-ink-subtle">Odometer (mi)</label>
              <input
                name="odometer"
                type="number"
                min="0"
                defaultValue={event.odometer ?? ""}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs text-ink-subtle">Headline</label>
              <input
                name="headline"
                required
                defaultValue={event.headline}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-ink-subtle">Cost (USD)</label>
              <input
                name="cost"
                type="number"
                min="0"
                step="0.01"
                defaultValue={event.costCents != null ? (event.costCents / 100).toFixed(2) : ""}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-ink-subtle">Location / provider</label>
              <input name="location" defaultValue={event.location ?? ""} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs text-ink-subtle">Notes</label>
              <textarea name="notes" rows={2} defaultValue={event.notes ?? ""} className={inputClass} />
            </div>
          </div>
          {error ? <p className="text-xs text-danger">{error}</p> : null}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? <FiLoader className="h-3 w-3 animate-spin" /> : <FiCheck className="h-3 w-3" />}
              Save
            </button>
            <button
              type="button"
              onClick={() => { setMode("view"); setError(null); }}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-ink-subtle transition hover:text-ink"
            >
              <FiX className="h-3 w-3" />
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  if (mode === "confirm-delete") {
    return (
      <li className="flex items-center justify-between gap-4 py-4">
        <p className="text-sm text-ink">
          Delete <span className="font-medium">{event.headline}</span>?
        </p>
        {error ? <p className="text-xs text-danger">{error}</p> : null}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-md bg-danger px-3 py-1.5 text-xs font-medium text-white transition hover:bg-danger/90 disabled:opacity-50"
          >
            {deleting ? <FiLoader className="h-3 w-3 animate-spin" /> : null}
            Delete
          </button>
          <button
            onClick={() => setMode("view")}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-ink-subtle transition hover:text-ink"
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex gap-4 py-4 group">
      <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
        <FiTool className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
          <p className="text-sm font-medium text-ink">{event.headline}</p>
          <p className="text-xs text-ink-subtle">{format(new Date(event.serviceDate), "MMM d, yyyy")}</p>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-subtle">
          {event.odometer != null ? <span>{event.odometer.toLocaleString()} mi</span> : null}
          {event.costCents != null ? <span>${(event.costCents / 100).toFixed(2)}</span> : null}
          {event.location ? <span>{event.location}</span> : null}
        </div>
        {event.notes ? <p className="mt-1 text-xs text-ink-subtle">{event.notes}</p> : null}
      </div>
      <div className="flex flex-none items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setMode("edit")}
          className="rounded-full p-1.5 text-ink-muted transition hover:bg-ink-muted/10"
          aria-label="Edit"
        >
          <FiEdit2 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setMode("confirm-delete")}
          className="rounded-full p-1.5 text-ink-muted transition hover:bg-danger/10 hover:text-danger"
          aria-label="Delete"
        >
          <FiTrash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  );
}

export const MaintenanceHistory = ({ events }: MaintenanceHistoryProps) => {
  const router = useRouter();

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-ink-subtle">
        No maintenance logged yet.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {events.map((event) => (
        <MaintenanceEventRow
          key={event.id}
          event={event}
          onMutated={() => router.refresh()}
        />
      ))}
    </ul>
  );
};
