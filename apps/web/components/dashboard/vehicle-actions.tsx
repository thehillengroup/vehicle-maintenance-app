'use client';

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "@repo/ui/button";

interface VehicleActionsProps {
  vehicleId: string;
  vehicleLabel: string;
  onDeleted?: () => void;
  onEdit?: () => void;
  isEditing?: boolean;
}

export const VehicleActions = ({ vehicleId, vehicleLabel, onDeleted, onEdit, isEditing = false }: VehicleActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // helpful while wiring up delete flow
    console.debug("[VehicleActions] mounted for", vehicleId);
  }, [vehicleId]);

  useEffect(() => {
    if (!showConfirm) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowConfirm(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showConfirm]);

  const handleDelete = async () => {
    if (!vehicleId) {
      console.error("Missing vehicle id for delete");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Delete failed");
      }

      setShowConfirm(false);
      onDeleted?.();
    } catch (error) {
      console.error(error);
      setShowConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const disabled = isDeleting;

  return (
    <>
      <div className="flex items-center gap-2 text-ink-muted">
        <button
          type="button"
          aria-label="Edit vehicle"
          className={`rounded-full p-2 transition disabled:opacity-50 ${
            isEditing
              ? "bg-white text-brand-600 ring-1 ring-brand-200 shadow-sm"
              : "hover:bg-ink-muted/10"
          }`}
          disabled={disabled}
          onClick={onEdit}
          aria-pressed={isEditing}
        >
          <FiEdit2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Delete vehicle"
          onClick={() => setShowConfirm(true)}
          className="rounded-full p-2 transition hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      </div>
      {showConfirm
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-ink">
                  Delete the {vehicleLabel}?
                </h3>
                <p className="mt-2 text-sm text-ink-subtle">
                  This will remove the vehicle and its reminders. This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowConfirm(false)}
                    disabled={disabled}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-danger text-white hover:bg-danger/90"
                    onClick={handleDelete}
                    disabled={disabled}
                  >
                    {isDeleting ? "Deleting…" : "Delete"}
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};
