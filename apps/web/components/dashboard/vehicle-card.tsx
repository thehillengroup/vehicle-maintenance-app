import { differenceInCalendarDays, format } from "date-fns";
import { Badge } from "@repo/ui/badge";
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

const describeWindow = (days: number) => {
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
};

export const VehicleCard = ({ vehicle, compliance, openReminders }: VehicleCardProps) => {
  return (
    <Card className="border-slate-200 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <span>
            {vehicle.year} {vehicle.make} {vehicle.model}
            {vehicle.trim ? <span className="text-sm text-slate-500"> - {vehicle.trim}</span> : null}
          </span>
          {vehicle.nickname ? (
            <Badge tone="info" className="text-xs uppercase tracking-wide">
              {vehicle.nickname}
            </Badge>
          ) : null}
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide">
          <span className="font-semibold text-slate-600">VIN:</span>
          <span className="font-mono text-slate-500">{vehicle.vin}</span>
          {vehicle.licensePlate ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
              Plate {vehicle.licensePlate}
            </span>
          ) : null}
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
            {vehicle.registrationState} - {vehicle.fuelType}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-700">Registration</h4>
          <p className="mt-1 text-sm text-slate-500">
            Expires {format(compliance.registrationDueOn, "MMM d, yyyy")} - {describeWindow(compliance.registrationDueInDays)}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-700">Emissions</h4>
          {compliance.emissionsDueOn ? (
            <p className="mt-1 text-sm text-slate-500">
              Expires {format(compliance.emissionsDueOn, "MMM d, yyyy")} - {describeWindow(compliance.emissionsDueInDays ?? 0)}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">Not required for this vehicle</p>
          )}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-700">Mileage</h4>
          <p className="mt-1 text-sm text-slate-500">
            {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : "Mileage not logged"}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-700">Last updated</h4>
          <p className="mt-1 text-sm text-slate-500">
            {format(vehicle.updatedAt, "MMM d, yyyy")} - {differenceInCalendarDays(new Date(), vehicle.updatedAt)} days ago
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {openReminders.length ? (
          openReminders.map((reminder) => (
            <Badge key={reminder.id} tone={reminder.type === "SERVICE" ? "warning" : "danger"}>
              {reminder.type.toLowerCase()} - {format(reminder.dueDate, "MMM d")}
            </Badge>
          ))
        ) : (
          <Badge tone="success">No active reminders</Badge>
        )}
      </CardFooter>
    </Card>
  );
};

