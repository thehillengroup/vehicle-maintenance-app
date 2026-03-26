import { useState } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { Badge } from "@repo/ui/badge";
import { VehicleActions } from "./vehicle-actions";
import { VehicleInlineEditor } from "./vehicle-inline-editor";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import type { Vehicle } from "@repo/core";

interface ComplianceStatus {
  registrationDueOn: Date | null;
  registrationDueInDays: number | null;
  emissionsDueOn: Date | null;
  emissionsDueInDays: number | null;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  compliance: ComplianceStatus;
  openReminders: Array<{
    id: string;
    type: "REGISTRATION" | "EMISSIONS" | "SERVICE";
    dueDate: Date;
  }>;
  onDeleted?: () => void;
  onUpdated?: (vehicle: Vehicle) => void;
}

const vehicleTypeLabel: Record<Vehicle["vehicleType"], string> = {
  SEDAN: "Sedan",
  COUPE: "Coupe",
  SPORTS_CAR: "Sports Car",
  SUV: "SUV",
  MOTORCYCLE: "Motorcycle",
  CROSSOVER: "Crossover",
};

const describeWindow = (days: number) => {
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `${days}d remaining`;
};

const complianceTone = (days: number | null): "danger" | "warning" | "success" => {
  if (days === null) return "success";
  if (days < 0) return "danger";
  if (days <= 30) return "warning";
  return "success";
};

export const VehicleCard = ({ vehicle, compliance, openReminders, onDeleted, onUpdated }: VehicleCardProps) => {
  const [showQuickEdit, setShowQuickEdit] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>
              {vehicle.year} {vehicle.make} {vehicle.model}
              {vehicle.trim ? <span className="ml-1 text-sm font-normal text-ink-subtle">{vehicle.trim}</span> : null}
            </CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-subtle">
              <span className="font-mono">{vehicle.vin}</span>
              <span>·</span>
              <span>{vehicleTypeLabel[vehicle.vehicleType]}</span>
              {vehicle.licensePlate ? <><span>·</span><span>{vehicle.licensePlate}</span></> : null}
              <span>·</span>
              <span>{vehicle.registrationState}</span>
            </div>
          </div>
          <Badge tone="info" className="flex-shrink-0 text-xs uppercase tracking-wide">
            {vehicle.purpose.replaceAll("_", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="!space-y-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">Registration</p>
            {compliance.registrationDueOn ? (
              <>
                <p className="text-sm font-medium text-ink">{format(compliance.registrationDueOn, "MMM d, yyyy")}</p>
                <Badge tone={complianceTone(compliance.registrationDueInDays)} className="mt-1">
                  {describeWindow(compliance.registrationDueInDays ?? 0)}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-ink-subtle">Not scheduled</p>
            )}
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">Emissions</p>
            {compliance.emissionsDueOn ? (
              <>
                <p className="text-sm font-medium text-ink">{format(compliance.emissionsDueOn, "MMM d, yyyy")}</p>
                <Badge tone={complianceTone(compliance.emissionsDueInDays)} className="mt-1">
                  {describeWindow(compliance.emissionsDueInDays ?? 0)}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-ink-subtle">Not required</p>
            )}
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">Mileage</p>
            <p className="text-sm font-medium text-ink">
              {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : "—"}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">Updated</p>
            <p className="text-sm font-medium text-ink">
              {differenceInCalendarDays(new Date(), vehicle.updatedAt) === 0
                ? "Today"
                : `${differenceInCalendarDays(new Date(), vehicle.updatedAt)}d ago`}
            </p>
          </div>
        </div>
      </CardContent>

      {showQuickEdit ? (
        <VehicleInlineEditor
          vehicle={vehicle}
          onUpdated={onUpdated}
          onClose={() => setShowQuickEdit(false)}
        />
      ) : null}

      <CardFooter>
        <div className="flex flex-wrap gap-1.5">
          {openReminders.length ? (
            openReminders.map((reminder) => (
              <Badge key={reminder.id} tone={reminder.type === "SERVICE" ? "warning" : "danger"}>
                {reminder.type.toLowerCase()} · {format(reminder.dueDate, "MMM d")}
              </Badge>
            ))
          ) : (
            <Badge tone="success">All clear</Badge>
          )}
        </div>
        <VehicleActions
          vehicleId={vehicle.id}
          vehicleLabel={`${vehicle.make} ${vehicle.model}`}
          onDeleted={onDeleted}
          onEdit={() => setShowQuickEdit((prev) => !prev)}
          isEditing={showQuickEdit}
        />
      </CardFooter>
    </Card>
  );
};
