"use client";

import { differenceInCalendarDays, formatDistanceToNow } from "date-fns";
import type { Reminder, Vehicle } from "@repo/core";
import { StatCard } from "./stat-card";
import { VehicleCard } from "./vehicle-card";
import { ReminderTimeline } from "./reminder-timeline";
import { useDashboardData } from "./use-dashboard-data";
import { AddVehicleButton } from "../actions/add-vehicle-button";
import { LogMaintenanceButton } from "../actions/log-maintenance-button";
import { Button } from "@repo/ui/button";

interface DashboardClientProps {
  initialVehicles: Vehicle[];
  initialReminders: Reminder[];
}

export function DashboardClient({ initialVehicles, initialReminders }: DashboardClientProps) {
  const {
    vehicles,
    reminders,
    refreshAll,
    addVehicleOptimistic,
    removeVehicleOptimistic,
  } = useDashboardData(initialVehicles, initialReminders);
  const now = new Date();

  const handleVehicleAdded = (vehicle: Vehicle) => {
    addVehicleOptimistic(vehicle);
    refreshAll();
  };

  const handleVehicleDeleted = (vehicleId: string) => {
    removeVehicleOptimistic(vehicleId);
    refreshAll();
  };

  const remindersByVehicle = reminders.reduce<Record<string, Reminder[]>>((acc, reminder) => {
    const list = acc[reminder.vehicleId] ?? [];
    list.push(reminder);
    acc[reminder.vehicleId] = list;
    return acc;
  }, {});

  const registrationOverdue = vehicles.filter(
    (vehicle) =>
      vehicle.registrationDueOn &&
      differenceInCalendarDays(vehicle.registrationDueOn, now) < 0,
  );

  const emissionsOverdue = vehicles.filter(
    (vehicle) =>
      vehicle.emissionsDueOn &&
      differenceInCalendarDays(vehicle.emissionsDueOn, now) < 0,
  );

  const totalMileage = vehicles.reduce((sum, vehicle) => sum + (vehicle.mileage ?? 0), 0);
  const upcomingReminderCount = reminders.length;

  const latestVehicleUpdatedAt = vehicles.reduce<Date | null>((latest, vehicle) => {
    const updated = new Date(vehicle.updatedAt);
    if (!latest || updated > latest) {
      return updated;
    }
    return latest;
  }, null);

  const stats = [
    {
      title: "Vehicles managed",
      value: String(vehicles.length),
      helper: latestVehicleUpdatedAt
        ? `Last updated ${formatDistanceToNow(latestVehicleUpdatedAt)} ago`
        : "Add your first vehicle",
      tone: "default" as const,
    },
    {
      title: "Registration overdue",
      value: String(registrationOverdue.length),
      helper: registrationOverdue.length ? "Needs attention this week" : "All registrations current",
      tone: "danger" as const,
    },
    {
      title: "Emissions overdue",
      value: String(emissionsOverdue.length),
      helper: emissionsOverdue.length ? "Schedule tests soon" : "All emissions checks up to date",
      tone: "warning" as const,
    },
    {
      title: "Tracked miles",
      value: totalMileage.toLocaleString(),
      helper: "Total mileage across your garage",
      tone: "success" as const,
    },
  ];

  return (
    <>
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} helper={stat.helper} tone={stat.tone} />
          ))}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          {vehicles.map((vehicle) => {
            const registrationDueInDays = vehicle.registrationDueOn
              ? differenceInCalendarDays(vehicle.registrationDueOn, now)
              : null;
            const emissionsDueInDays = vehicle.emissionsDueOn
              ? differenceInCalendarDays(vehicle.emissionsDueOn, now)
              : null;

            return (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                compliance={{
                  registrationDueOn: vehicle.registrationDueOn ?? null,
                  registrationDueInDays,
                  emissionsDueOn: vehicle.emissionsDueOn ?? null,
                  emissionsDueInDays,
                }}
                openReminders={remindersByVehicle[vehicle.id] ?? []}
                onDeleted={() => handleVehicleDeleted(vehicle.id)}
              />
            );
          })}
          {vehicles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface-raised p-8 text-center text-ink-subtle">
              <p className="text-base font-semibold text-ink">Welcome to FleetCare</p>
              <p className="mt-2 text-sm text-ink-subtle">
                Start by adding your first vehicle to automatically track registration and emissions milestones.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <AddVehicleButton appearance="primary" onSuccess={handleVehicleAdded} />
                <Button variant="ghost">Import records</Button>
              </div>
            </div>
          ) : null}
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
            <p className="text-sm font-semibold text-ink">Upcoming reminders</p>
            <p className="mt-1 text-xs text-ink-subtle">
              {upcomingReminderCount} reminders scheduled in the next 90 days.
            </p>
            <div className="mt-4">
              <ReminderTimeline reminders={reminders} />
            </div>
          </div>
        </aside>
      </section>

      <div className="mt-8 flex items-center gap-2">
        <AddVehicleButton onSuccess={handleVehicleAdded} />
        <LogMaintenanceButton vehicles={vehicles} onSuccess={refreshAll} />
      </div>
    </>
  );
}
