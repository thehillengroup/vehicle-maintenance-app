"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiX } from "react-icons/fi";
import { GiMechanicGarage } from "react-icons/gi";
import { Button } from "@repo/ui/button";
import type { Vehicle } from "@repo/core";
import { DatePicker } from "../ui/date-picker";

interface LogMaintenanceButtonProps {
  vehicles: Vehicle[];
  onSuccess?: () => void;
}

export const LogMaintenanceButton = ({ vehicles, onSuccess }: LogMaintenanceButtonProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const disabled = vehicles.length === 0;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const payload = {
      vehicleId: formData.get("vehicleId"),
      serviceDate: formData.get("serviceDate"),
      headline: formData.get("headline"),
      odometer: formData.get("odometer") ? Number(formData.get("odometer")) : undefined,
      costCents: formData.get("cost")
        ? Math.round(Number(formData.get("cost")) * 100)
        : undefined,
      location: (formData.get("location") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    };

    try {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ??
            "Unable to log maintenance right now. Please try again shortly.",
        );
      }

      setOpen(false);
      event.currentTarget.reset();
      router.refresh();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        className="border border-white/40 bg-white/10 text-black transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => !disabled && setOpen(true)}
        type="button"
        disabled={disabled}
      >
        <GiMechanicGarage className="h-4 w-4" />
        Log maintenance
      </Button>
      {open && !disabled ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-ink">
                Log maintenance
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-ink-subtle transition hover:text-ink"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-ink sm:col-span-2">
                  Vehicle
                  <select
                    name="vehicleId"
                    required
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select vehicle
                    </option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.vin}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Service date
                  <DatePicker
                    name="serviceDate"
                    placeholder="Select date"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Odometer
                  <input
                    name="odometer"
                    type="number"
                    min="0"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink sm:col-span-2">
                  Headline
                  <input
                    required
                    name="headline"
                    placeholder="Oil change, tire rotation..."
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Cost (USD)
                  <input
                    name="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Location / provider
                  <input
                    name="location"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink sm:col-span-2">
                  Notes
                  <textarea
                    name="notes"
                    rows={3}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
              </div>
              {disabled ? (
                <p className="text-sm text-ink-subtle" role="alert">
                  Add a vehicle first to log maintenance.
                </p>
              ) : error ? (
                <p className="text-sm text-danger" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-ink-subtle transition hover:text-ink"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="flex min-w-[160px] items-center justify-center gap-2 bg-brand-600 text-white transition hover:bg-brand-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FiLoader className="h-4 w-4 animate-spin" />
                      Logging
                    </>
                  ) : (
                    "Log maintenance"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};
