"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiPlus } from "react-icons/fi";
import { Button } from "@repo/ui/button";

interface AddVehicleButtonProps {
  onSuccess?: () => void;
}

export const AddVehicleButton = ({ onSuccess }: AddVehicleButtonProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const registrationRenewedOn = formData.get("registrationRenewedOn") as
      | string
      | null;
    const emissionsTestedOn = formData.get("emissionsTestedOn") as string | null;

    const payload = {
      make: formData.get("make"),
      model: formData.get("model"),
      year: Number(formData.get("year")),
      vin: (formData.get("vin") as string)?.trim(),
      registrationState: (formData.get("registrationState") as string)
        ?.toUpperCase()
        .slice(0, 2),
      nickname: (formData.get("nickname") as string) || undefined,
      mileage: formData.get("mileage") ? Number(formData.get("mileage")) : undefined,
      fuelType: formData.get("fuelType") || "GAS",
      registrationRenewedOn: registrationRenewedOn || undefined,
      emissionsTestedOn: emissionsTestedOn || undefined,
      licensePlate: (formData.get("licensePlate") as string) || undefined,
    };

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ??
            "Unable to save vehicle right now. Please try again shortly.",
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
        className="border border-white/40 bg-white/10 text-black transition hover:bg-white/20"
        onClick={() => setOpen(true)}
        type="button"
      >
        <FiPlus className="h-4 w-4" />
        Add vehicle
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-ink">
                Add vehicle
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-ink-subtle transition hover:text-ink"
              >
                Close
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Make
                  <input
                    required
                    name="make"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Model
                  <input
                    required
                    name="model"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Year
                  <input
                    required
                    name="year"
                    type="number"
                    min="1980"
                    max={new Date().getFullYear() + 1}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  VIN
                  <input
                    required
                    name="vin"
                    minLength={11}
                    maxLength={17}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Registration state
                  <input
                    required
                    name="registrationState"
                    maxLength={2}
                    className="uppercase rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  License plate
                  <input
                    name="licensePlate"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Fuel type
                  <select
                    name="fuelType"
                    defaultValue="GAS"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  >
                    <option value="GAS">Gasoline</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="EV">Electric</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Mileage
                  <input
                    name="mileage"
                    type="number"
                    min="0"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Registration renewed on
                  <input
                    name="registrationRenewedOn"
                    type="date"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Emissions tested on
                  <input
                    name="emissionsTestedOn"
                    type="date"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink sm:col-span-2">
                  Nickname
                  <input
                    name="nickname"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
              </div>
              {error ? (
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
                  className="flex min-w-[120px] items-center justify-center gap-2 bg-brand-600 text-white transition hover:bg-brand-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FiLoader className="h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Save vehicle"
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
