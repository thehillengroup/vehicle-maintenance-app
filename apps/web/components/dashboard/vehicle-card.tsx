import { differenceInCalendarDays, format } from "date-fns";
import { Badge } from "@repo/ui/badge";
import { VehicleActions } from "./vehicle-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import type { Vehicle } from "@repo/core";

interface ComplianceStatus {
  registrationDueOn: Date;
  registrationDueInDays: number;
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
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
};

export const VehicleCard = ({ vehicle, compliance, openReminders }: VehicleCardProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <span>
            {vehicle.year} {vehicle.make} {vehicle.model}
            {vehicle.trim ? <span className="text-sm text-ink-subtle"> - {vehicle.trim}</span> : null}
          </span>
          <Badge tone="info" className="text-xs uppercase tracking-wide">
            {vehicle.purpose.replaceAll("_", " ")}
          </Badge>
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-ink-muted">
          <span className="font-semibold text-ink">VIN:</span>
          <span className="font-mono text-ink-muted">{vehicle.vin}</span>
        </CardDescription>
        <CardDescription className="text-xs uppercase tracking-wide text-ink-muted">
          {vehicleTypeLabel[vehicle.vehicleType]}
          {vehicle.licensePlate ? ` · Plate ${vehicle.licensePlate}` : ""}
          {` · ${vehicle.registrationState} - ${vehicle.fuelType}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-ink">Registration</h4>
          <p className="mt-1 text-sm text-ink-subtle">
            Expires {format(compliance.registrationDueOn, "MMM d, yyyy")} - {describeWindow(compliance.registrationDueInDays)}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Emissions</h4>
          {compliance.emissionsDueOn ? (
            <p className="mt-1 text-sm text-ink-subtle">
              Expires {format(compliance.emissionsDueOn, "MMM d, yyyy")} - {describeWindow(compliance.emissionsDueInDays ?? 0)}
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink-subtle">Not required for this vehicle</p>
          )}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Mileage</h4>
          <p className="mt-1 text-sm text-ink-subtle">
            {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : "Mileage not logged"}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Last updated</h4>
          <p className="mt-1 text-sm text-ink-subtle">
            {format(vehicle.updatedAt, "MMM d, yyyy")} - {differenceInCalendarDays(new Date(), vehicle.updatedAt)} days ago
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {openReminders.length ? (
            openReminders.map((reminder) => (
              <Badge key={reminder.id} tone={reminder.type === "SERVICE" ? "warning" : "danger"}>
                {reminder.type.toLowerCase()} - {format(reminder.dueDate, "MMM d")}
              </Badge>
            ))
          ) : (
            <Badge tone="success">No active reminders</Badge>
          )}
        </div>
        <VehicleActions vehicleId={vehicle.id} vehicleLabel={`${vehicle.make} ${vehicle.model}`} />
      </CardFooter>
    </Card>
  );
};

