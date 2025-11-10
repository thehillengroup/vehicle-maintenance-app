"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { Vehicle } from "@repo/core";
import { Button } from "@repo/ui/button";
import { DatePicker } from "../ui/date-picker";

const toDateInputValue = (value: Date | string | null) => {
  if (!value) return "";
  const isoString = typeof value === "string" ? value : value.toISOString();
  return isoString.slice(0, 10);
};

const buildFormState = (source: Vehicle) => ({
  licensePlate: source.licensePlate ?? "",
  mileage: source.mileage?.toString() ?? "",
  registrationRenewedOn: toDateInputValue(source.registrationRenewedOn),
  emissionsTestedOn: toDateInputValue(source.emissionsTestedOn),
});

interface VehicleInlineEditorProps {
  vehicle: Vehicle;
  onUpdated?: (vehicle: Vehicle) => void;
  onClose: () => void;
}

export function VehicleInlineEditor({ vehicle, onUpdated, onClose }: VehicleInlineEditorProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [formState, setFormState] = useState(() => buildFormState(vehicle));

  useEffect(() => {
    setFormState(buildFormState(vehicle));
  }, [vehicle]);

  const disableSave = useMemo(() => {
    return formState.mileage !== "" && Number.isNaN(Number(formState.mileage));
  }, [formState.mileage]);

  const resetForm = (source: Vehicle = vehicle) => {
    setFormState(buildFormState(source));
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

        const data = await response.json().catch(() => null);
        const updatedVehicle = data?.data as Vehicle | undefined;
        const fallbackVehicle: Vehicle = {
          ...vehicle,
          licensePlate: payload.licensePlate,
          mileage: payload.mileage,
          registrationRenewedOn: registrationRenewedOnValue ? new Date(registrationRenewedOnValue) : null,
          emissionsTestedOn: emissionsTestedOnValue ? new Date(emissionsTestedOnValue) : null,
          registrationDueOn: registrationRenewedOnValue ? new Date(registrationRenewedOnValue) : null,
          emissionsDueOn: emissionsTestedOnValue ? new Date(emissionsTestedOnValue) : null,
          updatedAt: new Date(),
        };

        setSuccess("Vehicle updated");
        const resolvedVehicle = updatedVehicle ?? fallbackVehicle;
        onUpdated?.(resolvedVehicle);
        resetForm(resolvedVehicle);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      }
    });
  };

  return (
    <div className="border-t border-border bg-surface-raised/60 px-4 py-3">
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
                onClose();
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
            <DatePicker
              name="registrationRenewedOn"
              required
              placeholder="Select date"
              defaultValue={formState.registrationRenewedOn || null}
              onValueChange={(value) =>
                setFormState((prev) => ({
                  ...prev,
                  registrationRenewedOn: value ?? "",
                }))
              }
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-ink-subtle sm:col-span-2">
            Emission due date
            <DatePicker
              name="emissionsTestedOn"
              placeholder="Select date"
              defaultValue={formState.emissionsTestedOn || null}
              onValueChange={(value) =>
                setFormState((prev) => ({
                  ...prev,
                  emissionsTestedOn: value ?? "",
                }))
              }
            />
          </label>
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {success ? <p className="text-sm text-success">{success}</p> : null}
      </form>
    </div>
  );
}
