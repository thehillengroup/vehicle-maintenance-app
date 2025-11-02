import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  reminderSchema,
  type Reminder,
  vehicleSchema,
  type Vehicle,
} from "@repo/core";
import { differenceInCalendarDays, format } from "date-fns";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

interface VehicleSummary {
  vehicle: Vehicle;
  registrationDueIn: number;
  emissionsDueIn: number | null;
}

const FALLBACK_VEHICLES: Array<Partial<Vehicle> & { id: string }> = [
  {
    id: "demo-vehicle-1",
    userId: "demo",
    vin: "1HGCM82633A004352",
    make: "Honda",
    model: "Civic",
    year: 2021,
    trim: "EX",
    nickname: "Daily Driver",
    licensePlate: "7XYZ123",
    registrationState: "CA",
    fuelType: "GAS",
    registrationRenewedOn: "2025-02-12",
    registrationDueOn: "2026-02-12",
    emissionsTestedOn: "2024-12-15",
    emissionsDueOn: "2026-12-15",
    mileage: 18234,
    color: "Blue",
    createdAt: "2024-01-01",
    updatedAt: "2025-05-01",
  },
  {
    id: "demo-vehicle-2",
    userId: "demo",
    vin: "5YJ3E1EA7KF317111",
    make: "Tesla",
    model: "Model 3",
    year: 2020,
    trim: "Long Range",
    nickname: "Commuter",
    licensePlate: "EV12345",
    registrationState: "CA",
    fuelType: "EV",
    registrationRenewedOn: "2025-06-01",
    registrationDueOn: "2026-06-01",
    emissionsTestedOn: null,
    emissionsDueOn: null,
    mileage: 40211,
    color: "Pearl White",
    createdAt: "2023-06-15",
    updatedAt: "2025-04-10",
  },
];

const FALLBACK_REMINDERS: Reminder[] = [
  reminderSchema.parse({
    id: "demo-reminder-1",
    vehicleId: "demo-vehicle-1",
    type: "REGISTRATION",
    dueDate: "2026-02-12",
    satisfiedAt: null,
    leadTimeDays: 30,
    channels: ["PUSH", "EMAIL"],
    notes: "Registration renewal",
    createdAt: "2025-04-10",
    updatedAt: "2025-04-10",
  }),
];

export default function App() {
  const [vehicleSummaries, setVehicleSummaries] = useState<VehicleSummary[]>(
    [],
  );
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        const [vehicleRes, reminderRes] = await Promise.all([
          fetch(`${API_URL}/api/vehicles`).catch(() => null),
          fetch(`${API_URL}/api/reminders`).catch(() => null),
        ]);

        const vehiclePayload = await vehicleRes?.json().catch(() => null);
        const reminderPayload = await reminderRes?.json().catch(() => null);

        const parsedVehicles =
          vehiclePayload?.data?.map((item: unknown) =>
            vehicleSchema.parse(item),
          ) ??
          FALLBACK_VEHICLES.map((item) =>
            vehicleSchema.parse({
              ...item,
              registrationRenewedOn: item.registrationRenewedOn ?? new Date(),
              registrationDueOn: item.registrationDueOn ?? new Date(),
              emissionsTestedOn: item.emissionsTestedOn ?? null,
              emissionsDueOn: item.emissionsDueOn ?? null,
              mileage: item.mileage ?? null,
              color: item.color ?? null,
              trim: item.trim ?? null,
              nickname: item.nickname ?? null,
              licensePlate: item.licensePlate ?? null,
            }),
          );

        const parsedReminders =
          reminderPayload?.data?.map((item: unknown) =>
            reminderSchema.parse(item),
          ) ?? FALLBACK_REMINDERS;

        if (cancelled) return;

        setVehicleSummaries(
          parsedVehicles.map((vehicle) => ({
            vehicle,
            registrationDueIn: differenceInCalendarDays(
              vehicle.registrationDueOn,
              new Date(),
            ),
            emissionsDueIn: vehicle.emissionsDueOn
              ? differenceInCalendarDays(vehicle.emissionsDueOn, new Date())
              : null,
          })),
        );
        setReminders(parsedReminders);
      } catch (error) {
        if (cancelled) return;
        console.warn("Falling back to demo data", error);
        const parsedVehicles = FALLBACK_VEHICLES.map((item) =>
          vehicleSchema.parse({
            ...item,
            registrationRenewedOn: item.registrationRenewedOn ?? new Date(),
            registrationDueOn: item.registrationDueOn ?? new Date(),
            emissionsTestedOn: item.emissionsTestedOn ?? null,
            emissionsDueOn: item.emissionsDueOn ?? null,
            mileage: item.mileage ?? null,
            color: item.color ?? null,
            trim: item.trim ?? null,
            nickname: item.nickname ?? null,
            licensePlate: item.licensePlate ?? null,
          }),
        );
        setVehicleSummaries(
          parsedVehicles.map((vehicle) => ({
            vehicle,
            registrationDueIn: differenceInCalendarDays(
              vehicle.registrationDueOn,
              new Date(),
            ),
            emissionsDueIn: vehicle.emissionsDueOn
              ? differenceInCalendarDays(vehicle.emissionsDueOn, new Date())
              : null,
          })),
        );
        setReminders(FALLBACK_REMINDERS);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const overdueRegistrations = vehicleSummaries.filter(
      (summary) => summary.registrationDueIn < 0,
    ).length;
    const overdueEmissions = vehicleSummaries.filter(
      (summary) =>
        summary.emissionsDueIn != null && summary.emissionsDueIn < 0,
    ).length;
    const totalMileage = vehicleSummaries.reduce(
      (sum, summary) => sum + (summary.vehicle.mileage ?? 0),
      0,
    );

    return [
      {
        label: "Vehicles",
        value: vehicleSummaries.length.toString(),
        helper:
          vehicleSummaries.length > 0
            ? "Garage is active"
            : "Add your first vehicle",
      },
      {
        label: "Registration overdue",
        value: overdueRegistrations.toString(),
        helper:
          overdueRegistrations > 0
            ? "Renew licences soon"
            : "All registrations current",
      },
      {
        label: "Emissions overdue",
        value: overdueEmissions.toString(),
        helper:
          overdueEmissions > 0
            ? "Schedule state inspection"
            : "Emissions in good standing",
      },
      {
        label: "Tracked miles",
        value: totalMileage.toLocaleString(),
        helper: "Total mileage across vehicles",
      },
    ];
  }, [vehicleSummaries]);

  const remindersByVehicle = useMemo(() => {
    return reminders.reduce<Record<string, Reminder[]>>((acc, reminder) => {
      const list = acc[reminder.vehicleId] ?? [];
      list.push(reminder);
      acc[reminder.vehicleId] = list;
      return acc;
    }, {});
  }, [reminders]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
        <View style={styles.header}>
          <Text style={styles.brand}>FleetCare</Text>
          <Text style={styles.title}>Garage Overview</Text>
          <Text style={styles.subtitle}>
            Monitor renewals, inspections, and service reminders while you are
            on the go.
          </Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statHelper}>{stat.helper}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicles</Text>
          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#265cff" />
              <Text style={styles.loadingText}>Syncing your garage...</Text>
            </View>
          ) : vehicleSummaries.length ? (
            vehicleSummaries.map((summary) => (
              <View key={summary.vehicle.id} style={styles.vehicleCard}>
                <View style={styles.vehicleHeader}>
                  <View>
                    <Text style={styles.vehicleName}>
                      {summary.vehicle.year} {summary.vehicle.make}{" "}
                      {summary.vehicle.model}
                    </Text>
                    <Text style={styles.vehicleVin}>
                      VIN {summary.vehicle.vin}
                    </Text>
                  </View>
                  {summary.vehicle.nickname ? (
                    <View style={styles.badgeInfo}>
                      <Text style={styles.badgeText}>
                        {summary.vehicle.nickname}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.vehicleMeta}>
                  <View style={styles.metaColumn}>
                    <Text style={styles.metaLabel}>Registration</Text>
                    <Text style={styles.metaValue}>
                      Due {format(summary.vehicle.registrationDueOn, "MMM d, yyyy")}
                    </Text>
                    <Text style={styles.metaHelper}>
                      {describeWindow(summary.registrationDueIn)}
                    </Text>
                  </View>
                  <View style={styles.metaColumn}>
                    <Text style={styles.metaLabel}>Emissions</Text>
                    {summary.vehicle.emissionsDueOn ? (
                      <>
                        <Text style={styles.metaValue}>
                          Due {format(summary.vehicle.emissionsDueOn, "MMM d, yyyy")}
                        </Text>
                        <Text style={styles.metaHelper}>
                          {describeWindow(summary.emissionsDueIn ?? 0)}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.metaHelper}>Not required</Text>
                    )}
                  </View>
                </View>
                <View style={styles.vehicleBadges}>
                  <View
                    style={[
                      styles.badge,
                      summary.registrationDueIn < 0
                        ? styles.badgeDanger
                        : styles.badgeInfo,
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {summary.vehicle.registrationState} Plate{" "}
                      {summary.vehicle.licensePlate ?? "-"}
                    </Text>
                  </View>
                  <View style={[styles.badge, styles.badgeInfo]}>
                    <Text style={styles.badgeText}>
                      {summary.vehicle.fuelType ?? "GAS"}
                    </Text>
                  </View>
                  {summary.vehicle.mileage ? (
                    <View style={[styles.badge, styles.badgeSuccess]}>
                      <Text style={styles.badgeText}>
                        {summary.vehicle.mileage.toLocaleString()} mi
                      </Text>
                    </View>
                  ) : null}
                </View>
                {remindersByVehicle[summary.vehicle.id]?.length ? (
                  <View style={styles.reminderList}>
                    {remindersByVehicle[summary.vehicle.id].map((reminder) => (
                      <View key={reminder.id} style={styles.reminderRow}>
                        <Text style={styles.reminderType}>
                          {reminder.type === "SERVICE"
                            ? "Service"
                            : reminder.type.toLowerCase()}
                        </Text>
                        <Text style={styles.reminderDetails}>
                          {format(reminder.dueDate, "MMM d, yyyy")} via{" "}
                          {reminder.channels.join(", ")}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No vehicles yet</Text>
              <Text style={styles.emptyBody}>
                Add a vehicle from the web dashboard to start tracking
                reminders here.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming reminders</Text>
          {reminders.length ? (
            reminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderCard}>
                <Text style={styles.reminderTitle}>
                  {reminder.type === "SERVICE"
                    ? "Service"
                    : reminder.type.toLowerCase()}{" "}
                  due
                </Text>
                <Text style={styles.reminderDetails}>
                  {format(reminder.dueDate, "MMM d, yyyy")} via{" "}
                  {reminder.channels.join(", ")}
                </Text>
                {reminder.notes ? (
                  <Text style={styles.reminderNotes}>{reminder.notes}</Text>
                ) : null}
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyBody}>No reminders scheduled.</Text>
            </View>
          )}
        </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const describeWindow = (days: number) => {
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  brand: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#334155",
  },
  title: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flexBasis: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#64748b",
  },
  statValue: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
  },
  statHelper: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748b",
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  loadingCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
    gap: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  loadingText: {
    fontSize: 14,
    color: "#475569",
  },
  vehicleCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#0f172a",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  vehicleVin: {
    marginTop: 2,
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#94a3b8",
  },
  vehicleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 12,
  },
  metaColumn: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metaValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  metaHelper: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748b",
  },
  vehicleBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeInfo: {
    backgroundColor: "#e0f2fe",
  },
  badgeDanger: {
    backgroundColor: "#fee4e2",
  },
  badgeSuccess: {
    backgroundColor: "#dcfce7",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
  },
  reminderList: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 12,
    gap: 8,
  },
  reminderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reminderType: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
    textTransform: "capitalize",
  },
  reminderDetails: {
    fontSize: 13,
    color: "#475569",
  },
  reminderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 6,
  },
  reminderNotes: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748b",
  },
  emptyCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  emptyBody: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    lineHeight: 18,
  },
});
