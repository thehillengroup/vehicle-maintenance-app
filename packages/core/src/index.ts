import { parseISO } from "date-fns";
import { z } from "zod";

export const fuelTypeSchema = z.enum(["GAS", "DIESEL", "HYBRID", "EV"] as const);
export type FuelType = z.infer<typeof fuelTypeSchema>;

export const vehicleTypeSchema = z.enum(
  [
    "SEDAN",
    "COUPE",
    "SPORTS_CAR",
    "SUV",
    "MOTORCYCLE",
    "CROSSOVER",
  ] as const,
);

export type VehicleType = z.infer<typeof vehicleTypeSchema>;

export const vehiclePurposeSchema = z.enum(
  ["DAILY_DRIVER", "COMMUTER", "WEEKENDER", "UTILITY_VEHICLE"] as const,
);

export type VehiclePurpose = z.infer<typeof vehiclePurposeSchema>;

export const reminderTypeSchema = z.enum([
  "REGISTRATION",
  "EMISSIONS",
  "SERVICE",
] as const);

export type ReminderType = z.infer<typeof reminderTypeSchema>;

export const reminderChannelSchema = z.enum(["PUSH", "EMAIL", "SMS"] as const);

export type ReminderChannel = z.infer<typeof reminderChannelSchema>;

export const reminderSchema = z.object({
  id: z.string().min(1),
  vehicleId: z.string().min(1),
  type: reminderTypeSchema,
  dueDate: z.coerce.date(),
  satisfiedAt: z.coerce.date().optional().nullable(),
  leadTimeDays: z.number().int().min(1).max(120).default(30),
  channels: z.array(reminderChannelSchema).default(["PUSH"]),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Reminder = z.infer<typeof reminderSchema>;

export const maintenanceEventSchema = z.object({
  id: z.string().min(1),
  vehicleId: z.string().min(1),
  serviceDate: z.coerce.date(),
  headline: z.string().min(1).max(120),
  odometer: z.number().int().nonnegative().nullable(),
  cost: z.number().nonnegative().nullable(),
  location: z.string().max(120).nullable(),
  notes: z.string().nullable(),
  attachments: z
    .array(
      z.object({
        id: z.string().min(1),
        url: z.string().url(),
        label: z.string().optional(),
      }),
    )
    .default([]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type MaintenanceEvent = z.infer<typeof maintenanceEventSchema>;

export const vehicleSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  vin: z.string().trim().length(17, "VIN must be 17 characters"),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().gte(1980).lte(new Date().getFullYear() + 1),
  trim: z.string().nullable(),
  licensePlate: z.string().nullable(),
  registrationState: z.string().length(2),
  fuelType: fuelTypeSchema.optional().default("GAS"),
  purpose: vehiclePurposeSchema,
  vehicleType: vehicleTypeSchema,
  registrationRenewedOn: z.coerce.date().nullable(),
  registrationDueOn: z.coerce.date().nullable(),
  emissionsTestedOn: z.coerce.date().nullable(),
  emissionsDueOn: z.coerce.date().nullable(),
  mileage: z.number().int().nonnegative().nullable(),
  color: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;

export const vehicleUpsertSchema = vehicleSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    registrationDueOn: true,
    emissionsDueOn: true,
  })
  .extend({
    id: z.string().min(1).optional(),
    registrationRenewedOn: z
      .union([z.string(), z.date(), z.null(), z.undefined()])
      .transform((value) => {
        if (value == null || (typeof value === "string" && value.trim() === "")) {
          return null;
        }
        return typeof value === "string" ? parseISO(value) : value;
      }),
    emissionsTestedOn: z
      .union([z.string(), z.date(), z.null(), z.undefined()])
      .transform((value) => {
        if (value == null || (typeof value === "string" && value.trim() === "")) {
          return null;
        }
        return typeof value === "string" ? parseISO(value) : value;
      }),
    fuelType: fuelTypeSchema.optional(),
    purpose: vehiclePurposeSchema,
    vehicleType: vehicleTypeSchema,
  });

export type VehicleUpsertInput = z.infer<typeof vehicleUpsertSchema>;

export const complianceRuleSchema = z.object({
  registrationIntervalMonths: z.number().int().positive(),
  emissionsIntervalMonths: z.number().int().positive().nullable(),
  emissionsStartAgeYears: z.number().int().min(0).nullable(),
  emissionsExemptFuelTypes: z.array(z.string()).default([]),
});

export type ComplianceRule = z.infer<typeof complianceRuleSchema>;

export const stateComplianceRules: Record<string, ComplianceRule> = {
  CA: {
    registrationIntervalMonths: 12,
    emissionsIntervalMonths: 24,
    emissionsStartAgeYears: 4,
    emissionsExemptFuelTypes: ["EV"],
  },
  NY: {
    registrationIntervalMonths: 12,
    emissionsIntervalMonths: 12,
    emissionsStartAgeYears: 2,
    emissionsExemptFuelTypes: ["EV"],
  },
  TX: {
    registrationIntervalMonths: 12,
    emissionsIntervalMonths: 12,
    emissionsStartAgeYears: 2,
    emissionsExemptFuelTypes: ["EV", "Diesel"],
  },
  WA: {
    registrationIntervalMonths: 12,
    emissionsIntervalMonths: null,
    emissionsStartAgeYears: null,
    emissionsExemptFuelTypes: [],
  },
};

const defaultComplianceRule: ComplianceRule = {
  registrationIntervalMonths: 12,
  emissionsIntervalMonths: 24,
  emissionsStartAgeYears: 4,
  emissionsExemptFuelTypes: [],
};

export interface ComplianceContext {
  state: string;
  modelYear: number;
  fuelType?: string | null;
  lastRegistrationOn: Date;
  lastEmissionsOn?: Date | null;
  currentDate?: Date;
}

export interface ComplianceProjection {
  registrationDueOn: Date;
  emissionsDueOn: Date | null;
  requiresEmissions: boolean;
}

export const computeComplianceProjection = (
  input: ComplianceContext,
): ComplianceProjection => {
  const now = input.currentDate ?? new Date();
  const rule = stateComplianceRules[input.state] ?? defaultComplianceRule;

  const registrationDue = addMonthsClamped(
    input.lastRegistrationOn,
    rule.registrationIntervalMonths,
  );

  let emissionsDue: Date | null = null;
  let requiresEmissions = false;

  if (
    rule.emissionsIntervalMonths &&
    rule.emissionsStartAgeYears != null &&
    input.modelYear <= now.getFullYear() - rule.emissionsStartAgeYears
  ) {
    const exempt =
      input.fuelType && rule.emissionsExemptFuelTypes.includes(input.fuelType);
    if (!exempt) {
      requiresEmissions = true;
      const baseline = input.lastEmissionsOn ?? input.lastRegistrationOn;
      emissionsDue = addMonthsClamped(
        baseline,
        rule.emissionsIntervalMonths,
      );
    }
  }

  return {
    registrationDueOn: registrationDue,
    emissionsDueOn: emissionsDue,
    requiresEmissions,
  };
};

const addMonthsClamped = (date: Date, months: number): Date => {
  const base = new Date(date.getTime());
  const targetDay = base.getDate();
  base.setDate(1);
  base.setMonth(base.getMonth() + months);
  const daysInTargetMonth = new Date(
    base.getFullYear(),
    base.getMonth() + 1,
    0,
  ).getDate();
  base.setDate(Math.min(targetDay, daysInTargetMonth));
  return base;
};

export interface CreateReminderPayload {
  vehicleId: string;
  type: ReminderType;
  dueDate: Date;
  channels: ReminderChannel[];
  notes?: string | null;
  leadTimeDays?: number;
}

export const createReminderPayloadSchema = z.object({
  vehicleId: z.string().min(1),
  type: reminderTypeSchema,
  dueDate: z.coerce.date(),
  channels: z.array(reminderChannelSchema),
  notes: z.string().optional().nullable(),
  leadTimeDays: z.number().int().min(1).max(120).default(30),
});
