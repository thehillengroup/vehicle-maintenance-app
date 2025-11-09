"use client";

import useSWR from "swr";
import type { Reminder, Vehicle } from "@repo/core";

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return response.json();
};

export const VEHICLES_KEY = "/api/vehicles";
export const REMINDERS_KEY = "/api/reminders?withinDays=90";

export function useDashboardData(initialVehicles: Vehicle[], initialReminders: Reminder[]) {
  const { data: vehiclesResponse, mutate: mutateVehicles } = useSWR<{ data: Vehicle[] }>(
    VEHICLES_KEY,
    fetcher,
    { fallbackData: { data: initialVehicles } },
  );

  const { data: remindersResponse, mutate: mutateReminders } = useSWR<{ data: Reminder[] }>(
    REMINDERS_KEY,
    fetcher,
    { fallbackData: { data: initialReminders } },
  );

  const vehicles = vehiclesResponse?.data ?? initialVehicles;
  const reminders = remindersResponse?.data ?? initialReminders;

  const addVehicleOptimistic = (vehicle?: Vehicle | null) => {
    if (!vehicle) {
      return;
    }
    mutateVehicles(
      (current) => {
        const currentData = current?.data ?? [];
        if (currentData.some((v) => v.id === vehicle.id)) {
          return current;
        }
        return { data: [vehicle, ...currentData] };
      },
      false,
    );
  };

  const updateVehicleOptimistic = (vehicle: Vehicle) => {
    mutateVehicles(
      (current) => {
        const currentData = current?.data ?? [];
        const index = currentData.findIndex((existing) => existing.id === vehicle.id);
        if (index === -1) {
          return current;
        }
        const next = [...currentData];
        next[index] = vehicle;
        return { data: next };
      },
      false,
    );
  };

  const removeVehicleOptimistic = (vehicleId: string) => {
    mutateVehicles(
      (current) => ({
        data: (current?.data ?? []).filter((vehicle) => vehicle.id !== vehicleId),
      }),
      false,
    );
  };

  const refreshAll = async () => {
    await Promise.allSettled([mutateVehicles(), mutateReminders()]);
  };

  return {
    vehicles,
    reminders,
    refreshAll,
    addVehicleOptimistic,
    removeVehicleOptimistic,
    updateVehicleOptimistic,
  };
}
