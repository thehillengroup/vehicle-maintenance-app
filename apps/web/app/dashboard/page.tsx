export const dynamic = "force-dynamic";

import { AppShell } from "../../components/layout/app-shell";
import { getDemoUser } from "../../lib/demo-user";
import { getDueReminders, listVehicles } from "@repo/db";
import { DashboardClient } from "../../components/dashboard/dashboard-client";
import { DashboardActions } from "../../components/dashboard/dashboard-actions";

export default async function DashboardPage() {
  const user = await getDemoUser();
  const [vehicles, reminders] = await Promise.all([
    listVehicles(user.id),
    getDueReminders({ userId: user.id, withinDays: 90 }),
  ]);

  return (
    <AppShell actions={<DashboardActions initialVehicles={vehicles} initialReminders={reminders} />}>
      <DashboardClient initialVehicles={vehicles} initialReminders={reminders} />
    </AppShell>
  );
}
