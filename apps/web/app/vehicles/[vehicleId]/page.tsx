export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { differenceInCalendarDays, format } from "date-fns";
import { FiArrowLeft } from "react-icons/fi";
import { auth } from "../../../auth";
import { ensureUserByEmail, getVehicleDetail } from "@repo/db";
import { AppShell } from "../../../components/layout/app-shell";
import { LogMaintenanceButton } from "../../../components/actions/log-maintenance-button";
import { MaintenanceHistory } from "../../../components/vehicle-detail/maintenance-history";
import { Badge } from "@repo/ui/badge";

interface PageProps {
  params: Promise<{ vehicleId: string }>;
}

const vehicleTypeLabel: Record<string, string> = {
  SEDAN: "Sedan",
  COUPE: "Coupe",
  SPORTS_CAR: "Sports Car",
  SUV: "SUV",
  MOTORCYCLE: "Motorcycle",
  CROSSOVER: "Crossover",
};

const complianceTone = (days: number | null): "danger" | "warning" | "success" => {
  if (days === null) return "success";
  if (days < 0) return "danger";
  if (days <= 30) return "warning";
  return "success";
};

const describeWindow = (days: number) => {
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `${days}d remaining`;
};

export default async function VehicleDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.email) redirect("/signin");

  const user = await ensureUserByEmail(session.user.email);
  const { vehicleId } = await params;

  const detail = await getVehicleDetail(user.id, vehicleId);
  if (!detail) notFound();

  const { vehicle, maintenanceEvents } = detail;
  const now = new Date();

  const registrationDueInDays = vehicle.registrationDueOn
    ? differenceInCalendarDays(vehicle.registrationDueOn, now)
    : null;
  const emissionsDueInDays = vehicle.emissionsDueOn
    ? differenceInCalendarDays(vehicle.emissionsDueOn, now)
    : null;

  const actions = (
    <LogMaintenanceButton
      vehicles={[vehicle]}
      initialVehicleId={vehicle.id}
    />
  );

  return (
    <AppShell actions={actions}>
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-ink-subtle transition hover:text-ink"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>

      {/* Vehicle header */}
      <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-heading text-xl font-semibold text-ink">
              {vehicle.year} {vehicle.make} {vehicle.model}
              {vehicle.trim ? (
                <span className="ml-2 text-base font-normal text-ink-subtle">{vehicle.trim}</span>
              ) : null}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-subtle">
              <span className="font-mono">{vehicle.vin}</span>
              <span>·</span>
              <span>{vehicleTypeLabel[vehicle.vehicleType] ?? vehicle.vehicleType}</span>
              {vehicle.licensePlate ? (
                <><span>·</span><span>{vehicle.licensePlate}</span></>
              ) : null}
              <span>·</span>
              <span>{vehicle.registrationState}</span>
              {vehicle.color ? (
                <><span>·</span><span>{vehicle.color}</span></>
              ) : null}
            </div>
          </div>
          <Badge tone="info" className="flex-shrink-0 text-xs uppercase tracking-wide">
            {vehicle.purpose.replaceAll("_", " ")}
          </Badge>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">Registration</p>
            {vehicle.registrationDueOn ? (
              <>
                <p className="text-sm font-medium text-ink">{format(vehicle.registrationDueOn, "MMM d, yyyy")}</p>
                <Badge tone={complianceTone(registrationDueInDays)} className="mt-1">
                  {describeWindow(registrationDueInDays ?? 0)}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-ink-subtle">Not scheduled</p>
            )}
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">Emissions</p>
            {vehicle.emissionsDueOn ? (
              <>
                <p className="text-sm font-medium text-ink">{format(vehicle.emissionsDueOn, "MMM d, yyyy")}</p>
                <Badge tone={complianceTone(emissionsDueInDays)} className="mt-1">
                  {describeWindow(emissionsDueInDays ?? 0)}
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
            <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">Fuel type</p>
            <p className="text-sm font-medium text-ink capitalize">
              {vehicle.fuelType?.toLowerCase() ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance history */}
      <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-base font-semibold text-ink">Maintenance history</h2>
            <p className="mt-0.5 text-xs text-ink-subtle">
              {maintenanceEvents.length} event{maintenanceEvents.length !== 1 ? "s" : ""} logged
            </p>
          </div>
        </div>
        <div className="mt-4">
          <MaintenanceHistory events={maintenanceEvents} />
        </div>
      </div>
    </AppShell>
  );
}
