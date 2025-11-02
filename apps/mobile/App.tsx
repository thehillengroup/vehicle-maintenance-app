import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
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
import {
  useFonts as useDmSansFonts,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
  useFonts as useInterFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  useFonts as useJetBrainsFonts,
  JetBrainsMono_500Medium,
} from "@expo-google-fonts/jetbrains-mono";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

const palette = {
  surface: "#f8fafc",
  surfaceRaised: "#ffffff",
  surfaceSubtle: "#f1f5f9",
  border: "#e2e8f0",
  brand500: "#6366f1",
  brand600: "#4f46e5",
  accent500: "#f97316",
  accent100: "#ffe0d1",
  ink: "#0f172a",
  inkMuted: "#475569",
  inkSubtle: "#64748b",
  success: "#059669",
  warning: "#ca8a04",
  danger: "#dc2626",
};

const fonts = {
  heading: "DMSans_700Bold",
  headingMedium: "DMSans_500Medium",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemibold: "Inter_600SemiBold",
  mono: "JetBrainsMono_500Medium",
};

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
  const [vehicleSummaries, setVehicleSummaries] = useState<VehicleSummary[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const [dmSansLoaded] = useDmSansFonts({
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const [interLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const [jetBrainsLoaded] = useJetBrainsFonts({
    JetBrainsMono_500Medium,
  });

  const fontsLoaded = dmSansLoaded && interLoaded && jetBrainsLoaded;

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

        if (!cancelled) {
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
        }
      } catch (error) {
        console.warn("Falling back to offline data", error);
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
        if (!cancelled) {
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
        }
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

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.safeArea, styles.centered]}>
          <StatusBar style="dark" />
          <ActivityIndicator color={palette.brand600} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

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
            <Text style={styles.title}>Garage overview</Text>
            <Text style={styles.subtitle}>
              Monitor renewals, inspections, and service reminders while you are
              on the go.
            </Text>
          </View>

          <View style={styles.statRow}>
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
                <ActivityIndicator size="small" color={palette.brand600} />
                <Text style={styles.loadingText}>
                  Syncing your garage...
                </Text>
              </View>
            ) : vehicleSummaries.length ? (
              vehicleSummaries.map(
                ({ vehicle, registrationDueIn, emissionsDueIn }) => (
                  <View
                    key={vehicle.id}
                    style={styles.vehicleCard}
                  >
                    <View style={styles.vehicleHeader}>
                      <View>
                        <Text style={styles.vehicleName}>
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </Text>
                        <Text style={styles.vehicleVin}>
                          VIN {vehicle.vin}
                        </Text>
                      </View>
                      {vehicle.nickname ? (
                        <View style={[styles.badge, styles.badgeAccent]}>
                          <Text style={styles.badgeText}>
                            {vehicle.nickname}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <View style={styles.vehicleMeta}>
                      <View style={styles.metaColumn}>
                        <Text style={styles.metaLabel}>Registration</Text>
                        <Text style={styles.metaValue}>
                          Due {format(vehicle.registrationDueOn, "MMM d, yyyy")}
                        </Text>
                        <Text style={styles.metaHelper}>
                          {describeWindow(registrationDueIn)}
                        </Text>
                      </View>
                      <View style={styles.metaColumn}>
                        <Text style={styles.metaLabel}>Emissions</Text>
                        {vehicle.emissionsDueOn ? (
                          <>
                            <Text style={styles.metaValue}>
                              Due{" "}
                              {format(vehicle.emissionsDueOn, "MMM d, yyyy")}
                            </Text>
                            <Text style={styles.metaHelper}>
                              {describeWindow(emissionsDueIn ?? 0)}
                            </Text>
                          </>
                        ) : (
                          <Text style={styles.metaHelper}>Not required</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.badgeRow}>
                      <Badge tone={registrationDueIn < 0 ? "danger" : "info"}>
                        {vehicle.registrationState} • Plate{" "}
                        {vehicle.licensePlate ?? "—"}
                      </Badge>
                      <Badge tone="info">{vehicle.fuelType}</Badge>
                      {vehicle.mileage ? (
                        <Badge tone="success">
                          {vehicle.mileage.toLocaleString()} mi
                        </Badge>
                      ) : null}
                    </View>
                  </View>
                ),
              )
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No vehicles yet</Text>
                <Text style={styles.emptyBody}>
                  Add your first vehicle from the web dashboard to begin
                  tracking reminders in the app.
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
                    {format(reminder.dueDate, "MMM d, yyyy")} · via{" "}
                    {reminder.channels.join(", ")}
                  </Text>
                  {reminder.notes ? (
                    <Text style={styles.reminderNotes}>{reminder.notes}</Text>
                  ) : null}
                </View>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyBody}>
                  No reminders scheduled.
                </Text>
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
    backgroundColor: palette.surface,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 32,
  },
  header: {
    marginTop: 12,
  },
  brand: {
    fontFamily: fonts.headingMedium,
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: palette.accent500,
  },
  title: {
    marginTop: 8,
    fontFamily: fonts.heading,
    fontSize: 28,
    color: palette.ink,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: palette.inkSubtle,
  },
  statRow: {
    marginTop: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    minWidth: 140,
    flexGrow: 1,
    borderRadius: 16,
    backgroundColor: palette.surfaceRaised,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: palette.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: palette.inkSubtle,
  },
  statValue: {
    marginTop: 6,
    fontFamily: fonts.heading,
    fontSize: 22,
    color: palette.ink,
  },
  statHelper: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 12,
    color: palette.inkSubtle,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: palette.ink,
    marginBottom: 12,
  },
  loadingCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: palette.surfaceRaised,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: palette.inkSubtle,
  },
  vehicleCard: {
    borderRadius: 18,
    backgroundColor: palette.surfaceRaised,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 14,
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicleName: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: palette.ink,
  },
  vehicleVin: {
    marginTop: 4,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.6,
    color: palette.inkSubtle,
    textTransform: "uppercase",
  },
  vehicleMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaColumn: {
    flex: 1,
    gap: 4,
  },
  metaLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: palette.ink,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metaValue: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: palette.ink,
  },
  metaHelper: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: palette.inkSubtle,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeAccent: {
    backgroundColor: palette.accent100,
  },
  badgeText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: palette.accent500,
    textTransform: "uppercase",
  },
  emptyCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: palette.surfaceSubtle,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: palette.border,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: palette.ink,
  },
  emptyBody: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: palette.inkSubtle,
    textAlign: "center",
  },
  reminderCard: {
    borderRadius: 16,
    backgroundColor: palette.surfaceRaised,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    gap: 4,
  },
  reminderTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: palette.ink,
  },
  reminderDetails: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: palette.inkSubtle,
  },
  reminderNotes: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: palette.inkSubtle,
  },
});

type BadgeTone = "success" | "warning" | "danger" | "info";

const badgePalette: Record<BadgeTone, { backgroundColor: string; color: string }> = {
  success: { backgroundColor: "#ecfdf5", color: palette.success },
  warning: { backgroundColor: "#fef7d6", color: palette.warning },
  danger: { backgroundColor: "#fee2e2", color: palette.danger },
  info: { backgroundColor: "#eef2ff", color: palette.brand600 },
};

const Badge = ({
  tone = "info",
  children,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
}) => (
  <View
    style={[
      styles.badge,
      {
        backgroundColor: badgePalette[tone].backgroundColor,
      },
    ]}
  >
    <Text
      style={[
        styles.badgeText,
        {
          color: badgePalette[tone].color,
        },
      ]}
    >
      {children}
    </Text>
  </View>
);
