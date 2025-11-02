import Link from "next/link";
import { differenceInCalendarDays, formatDistanceToNow } from "date-fns";
import { AppShell } from "../components/layout/app-shell";
import { VehicleCard } from "../components/dashboard/vehicle-card";
import { ReminderTimeline } from "../components/dashboard/reminder-timeline";
import { StatCard } from "../components/dashboard/stat-card";
import { Button } from "@repo/ui/button";
import { getDemoUser } from "../lib/demo-user";
import { getDueReminders, listVehicles } from "@repo/db";

export default async function Page() {
  const user = await getDemoUser();
  const [vehicles, reminders] = await Promise.all([
    listVehicles(user.id),
    getDueReminders({ userId: user.id, withinDays: 90 }),
  ]);

  const now = new Date();

  const remindersByVehicle = reminders.reduce<Record<string, typeof reminders>>(
    (acc, reminder) => {
      const vehicleReminders = acc[reminder.vehicleId] ?? [];
      vehicleReminders.push(reminder);
      acc[reminder.vehicleId] = vehicleReminders;
      return acc;
    },
    {},
  );

  const registrationOverdue = vehicles.filter(
    (vehicle) => differenceInCalendarDays(vehicle.registrationDueOn, now) < 0,
  );

  const emissionsOverdue = vehicles.filter(
    (vehicle) =>
      vehicle.emissionsDueOn && differenceInCalendarDays(vehicle.emissionsDueOn, now) < 0,
  );

  const totalMileage = vehicles.reduce((sum, vehicle) => sum + (vehicle.mileage ?? 0), 0);

  const upcomingReminderCount = reminders.length;

  const stats = [
    {
      title: "Vehicles managed",
      value: String(vehicles.length),
      helper: vehicles.length ? `Last updated ${formatDistanceToNow(vehicles[0].updatedAt)} ago` : "Add your first vehicle",
      tone: "default" as const,
    },
    {
      title: "Registration overdue",
      value: String(registrationOverdue.length),
      helper: registrationOverdue.length ? "Needs attention this week" : "All registrations current",
      tone: registrationOverdue.length ? (registrationOverdue.length > 1 ? "danger" : "warning") : "success",
    },
    {
      title: "Emissions overdue",
      value: String(emissionsOverdue.length),
      helper: emissionsOverdue.length ? "Schedule tests soon" : "All emissions checks up to date",
      tone: emissionsOverdue.length ? "warning" : "success",
    },
    {
      title: "Tracked miles",
      value: totalMileage.toLocaleString(),
      helper: "Total mileage across your garage",
      tone: "default" as const,
    },
  ];

  return (
    <AppShell
      title="Garage overview"
      subtitle="Stay ahead of registration renewals, emissions checks, and recurring service tasks across every vehicle you manage."
      actions={
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="#">Add vehicle</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#">Log maintenance</Link>
          </Button>
        </div>
      }
    >
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              helper={stat.helper}
              tone={stat.tone}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          {vehicles.map((vehicle) => {
            const registrationDueInDays = differenceInCalendarDays(
              vehicle.registrationDueOn,
              now,
            );
            const emissionsDueInDays = vehicle.emissionsDueOn
              ? differenceInCalendarDays(vehicle.emissionsDueOn, now)
              : null;

            return (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                compliance={{
                  registrationDueOn: vehicle.registrationDueOn,
                  registrationDueInDays,
                  emissionsDueOn: vehicle.emissionsDueOn ?? null,
                  emissionsDueInDays,
                }}
                openReminders={remindersByVehicle[vehicle.id] ?? []}
              />
            );
          })}
          {vehicles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-slate-500">
              <p className="text-base font-semibold text-slate-700">Welcome to FleetCare</p>
              <p className="mt-2 text-sm">
                Start by adding your first vehicle to automatically track registration and emissions milestones.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button>Add vehicle</Button>
                <Button variant="ghost">Import records</Button>
              </div>
            </div>
          ) : null}
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Upcoming reminders</p>
            <p className="mt-1 text-xs text-slate-500">
              {upcomingReminderCount} reminders scheduled in the next 90 days.
            </p>
            <div className="mt-4">
              <ReminderTimeline reminders={reminders} />
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
