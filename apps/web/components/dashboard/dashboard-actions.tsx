"use client";

import type { Reminder, Vehicle } from "@repo/core";
import { AddVehicleButton } from "../actions/add-vehicle-button";
import { LogMaintenanceButton } from "../actions/log-maintenance-button";
import { useDashboardData } from "./use-dashboard-data";

interface DashboardActionsProps {
  initialVehicles: Vehicle[];
  initialReminders: Reminder[];
}

export function DashboardActions({ initialVehicles, initialReminders }: DashboardActionsProps) {
  const { vehicles, refreshAll } = useDashboardData(initialVehicles, initialReminders);

  const handleSuccess = () => {
    refreshAll();
  };

  return (
    <div className="flex items-center gap-2">
      <AddVehicleButton onSuccess={handleSuccess} />
      <LogMaintenanceButton vehicles={vehicles} />
    </div>
  );
}
