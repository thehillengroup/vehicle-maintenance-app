"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiEdit3, FiSave, FiX } from "react-icons/fi";
import { Vehicle } from "@repo/core";
import { Button } from "@repo/ui/button";

interface EditableVehiclePayload {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim: string | null;
  registrationState: string;
  fuelType: Vehicle["fuelType"];
  purpose: Vehicle["purpose"];
  vehicleType: Vehicle["vehicleType"];
  registrationRenewedOn: string | null;
  emissionsTestedOn: string | null;
  mileage: number | null;
  color: string | null;
  licensePlate: string | null;
}

const formatISODate = (value: string | null) => {
  if (!value) return "";
  return value.slice(0, 10);
};

export function VehicleInlineEditor({ vehicle }: { vehicle: EditableVehiclePayload }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [formState, setFormState] = useState({
    licensePlate: vehicle.licensePlate ?? "",
    mileage: vehicle.mileage?.toString() ?? "",
    registrationRenewedOn: formatISODate(vehicle.registrationRenewedOn),
    emissionsTestedOn: formatISODate(vehicle.emissionsTestedOn),
  });

  const disableSave = useMemo(() => {
    return formState.mileage !== "" && Number.isNaN(Number(formState.mileage));
  }, [formState.mileage]);

  const resetForm = () => {
    setFormState({
      licensePlate: vehicle.licensePlate ?? "",
      mileage: vehicle.mileage?.toString() ?? "",
      registrationRenewedOn: formatISODate(vehicle.registrationRenewedOn),
      emissionsTestedOn: formatISODate(vehicle.emissionsTestedOn),
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const registrationRenewedOnValue = formState.registrationRenewedOn?.trim()
      ? formState.registrationRenewedOn
      : null;
    const emissionsTestedOnValue = formState.emissionsTestedOn?.trim()
      ? formState.emissionsTestedOn
      : null;

    const payload = {
      id: vehicle.id,
      vin: vehicle.vin,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      trim: vehicle.trim,
      registrationState: vehicle.registrationState,
      fuelType: vehicle.fuelType,
      purpose: vehicle.purpose,
      vehicleType: vehicle.vehicleType,
      registrationRenewedOn: registrationRenewedOnValue,
      emissionsTestedOn: emissionsTestedOnValue,
      mileage: formState.mileage ? Number(formState.mileage.replace(/[^\d]/g, "")) : null,
      color: vehicle.color,
      licensePlate: formState.licensePlate ? formState.licensePlate.toUpperCase() : null,
    };

    startTransition(async () => {
      try {
        const response = await fetch("/api/vehicles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.error ??
              data?.details?.formErrors?.[0] ??
              "Unable to update vehicle right now.",
          );
        }

        setSuccess("Vehicle updated");
        setEditing(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      }
    });
  };

  return (
    <div className="border-t border-border bg-surface-raised/60 px-4 py-3">
      {editing ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Quick edit</p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                className="text-sm text-ink-subtle hover:text-ink"
                onClick={() => {
                  resetForm();
                  setEditing(false);
                }}
              >
                <FiX className="mr-1 inline h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={disableSave || isPending}
              >
                <FiSave className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs uppercase tracking-wide text-ink-subtle">
              License plate
              <input
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                value={formState.licensePlate}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    licensePlate: event.target.value.toUpperCase(),
                  }))
                }
              />
            </label>
            <label className="text-xs uppercase tracking-wide text-ink-subtle">
              Mileage
              <input
                type="number"
                min="0"
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                value={formState.mileage}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, mileage: event.target.value }))
                }
                placeholder="e.g. 45210"
              />
            </label>
            <label className="text-xs uppercase tracking-wide text-ink-subtle">
              Registration expires on
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                value={formState.registrationRenewedOn}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    registrationRenewedOn: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label className="text-xs uppercase tracking-wide text-ink-subtle sm:col-span-2">
              Emission due date
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                value={formState.emissionsTestedOn}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    emissionsTestedOn: event.target.value,
                  }))
                }
              />
            </label>
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {success ? <p className="text-sm text-success">{success}</p> : null}
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Quick edit</p>
            <p className="text-xs text-ink-subtle">
              Update plates, mileage, or compliance dates inline.
            </p>
          </div>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-sm"
            onClick={() => setEditing(true)}
          >
            <FiEdit3 className="h-4 w-4" />
            Edit details
          </Button>
        </div>
      )}
    </div>
  );
}
