import {
  CreateReminderPayload,
  computeComplianceProjection,
  createReminderPayloadSchema,
  reminderSchema,
  vehicleSchema,
  vehicleUpsertSchema,
  type VehicleUpsertInput,
} from "@repo/core";
import type { Reminder, Vehicle } from "@repo/core";
import { addDays, isBefore } from "date-fns";
import { prisma } from "./client.ts";

const vehicleSelect = {
  id: true,
  userId: true,
  vin: true,
  make: true,
  model: true,
  year: true,
  trim: true,
  nickname: true,
  licensePlate: true,
  registrationState: true,
  fuelType: true,
  purpose: true,
  vehicleType: true,
  registrationRenewedOn: true,
  registrationDueOn: true,
  emissionsTestedOn: true,
  emissionsDueOn: true,
  mileage: true,
  color: true,
  createdAt: true,
  updatedAt: true,
} satisfies Record<keyof Vehicle, boolean>;

export const listVehicles = async (userId: string): Promise<Vehicle[]> => {
  const vehicles = await prisma.vehicle.findMany({
    where: { userId },
    orderBy: [
      { year: "desc" },
      { updatedAt: "desc" },
    ],
    select: vehicleSelect,
  });

  return vehicles.map((v) => vehicleSchema.parse(v));
};

export const ensureUserByEmail = async (email: string) => {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: email.split("@")[0],
    },
  });
};

export interface UpsertVehicleOptions {
  userId: string;
  payload: VehicleUpsertInput;
}

export const upsertVehicle = async ({
  userId,
  payload,
}: UpsertVehicleOptions): Promise<Vehicle> => {
  const data = vehicleUpsertSchema.parse(payload);

  const compliance = computeComplianceProjection({
    state: data.registrationState,
    modelYear: data.year,
    fuelType: data.fuelType ?? "GAS",
    lastRegistrationOn: data.registrationRenewedOn,
    lastEmissionsOn: data.emissionsTestedOn ?? null,
  });

  const baseData = {
    userId,
    vin: data.vin,
    make: data.make,
    model: data.model,
    year: data.year,
    trim: data.trim,
    nickname: data.nickname,
    licensePlate: data.licensePlate,
    registrationState: data.registrationState,
    fuelType: data.fuelType ?? "GAS",
    purpose: data.purpose,
    vehicleType: data.vehicleType,
    registrationRenewedOn: data.registrationRenewedOn,
    emissionsTestedOn: data.emissionsTestedOn,
    registrationDueOn: compliance.registrationDueOn,
    emissionsDueOn: compliance.emissionsDueOn,
    mileage: data.mileage,
    color: data.color,
  };

  const target =
    data.id != null
      ? await prisma.vehicle.findFirst({
          where: { id: data.id, userId },
        })
      : await prisma.vehicle.findFirst({
          where: { vin: data.vin, userId },
        });

  const result = target
    ? await prisma.vehicle.update({
        where: { id: target.id, userId },
        data: baseData,
        select: vehicleSelect,
      })
    : await prisma.vehicle.create({
        data: baseData,
        select: vehicleSelect,
      });

  return vehicleSchema.parse(result);
};

export const deleteVehicleById = async (userId: string, vehicleId: string) => {
  const result = await prisma.vehicle.deleteMany({
    where: {
      id: vehicleId,
      userId,
    },
  });

  if (result.count === 0) {
    const error = new Error("Vehicle not found");
    // @ts-expect-error augmenting for API response usage
    error.status = 404;
    throw error;
  }
};

export const getVehicleDetail = async (
  userId: string,
  vehicleId: string,
) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      userId,
    },
    include: {
      maintenanceEvents: {
        orderBy: { serviceDate: "desc" },
      },
      reminders: {
        orderBy: { dueOn: "asc" },
      },
    },
  });

  if (!vehicle) return null;

  return {
    vehicle: vehicleSchema.parse(vehicle),
    maintenanceEvents: vehicle.maintenanceEvents,
    reminders: vehicle.reminders.map((reminder) =>
      reminderSchema.parse({
        id: reminder.id,
        vehicleId: reminder.vehicleId,
        type: reminder.type,
        dueDate: reminder.dueOn,
        satisfiedAt: reminder.satisfiedAt,
        leadTimeDays: reminder.leadTimeDays,
        channels: parseChannels(reminder.channelsRaw),
        notes: reminder.notes,
        createdAt: reminder.createdAt,
        updatedAt: reminder.updatedAt,
      }),
    ),
  };
};

export interface MaintenanceEventInput {
  vehicleId: string;
  serviceDate: Date;
  headline: string;
  odometer?: number | null;
  costCents?: number | null;
  location?: string | null;
  notes?: string | null;
}

export const logMaintenanceEvent = async (
  userId: string,
  input: MaintenanceEventInput,
) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: input.vehicleId, userId },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found or access denied");
  }

  return prisma.maintenanceEvent.create({
    data: {
      vehicleId: input.vehicleId,
      serviceDate: input.serviceDate,
      headline: input.headline,
      odometer: input.odometer,
      costCents: input.costCents,
      location: input.location,
      notes: input.notes,
    },
  });
};

export const scheduleReminder = async (
  userId: string,
  payload: CreateReminderPayload,
): Promise<Reminder> => {
  const data = createReminderPayloadSchema.parse(payload);

  const vehicle = await prisma.vehicle.findFirst({
    where: { id: data.vehicleId, userId },
  });
  if (!vehicle) {
    throw new Error("Vehicle not found or access denied");
  }

  const reminder = await prisma.reminder.create({
    data: {
      userId,
      vehicleId: data.vehicleId,
      type: data.type,
      dueOn: data.dueDate,
      leadTimeDays: data.leadTimeDays ?? 30,
      channelsRaw: JSON.stringify(data.channels),
      notes: data.notes,
      nextNotifiedAt: addDays(data.dueDate, -1 * (data.leadTimeDays ?? 30)),
    },
  });

  return reminderSchema.parse({
    id: reminder.id,
    vehicleId: reminder.vehicleId,
    type: reminder.type,
    dueDate: reminder.dueOn,
    satisfiedAt: reminder.satisfiedAt,
    leadTimeDays: reminder.leadTimeDays,
    channels: parseChannels(reminder.channelsRaw),
    notes: reminder.notes,
    createdAt: reminder.createdAt,
    updatedAt: reminder.updatedAt,
  });
};

export interface DueReminderOptions {
  userId: string;
  withinDays?: number;
  includeSatisfied?: boolean;
}

export const getDueReminders = async ({
  userId,
  withinDays = 30,
  includeSatisfied = false,
}: DueReminderOptions): Promise<Reminder[]> => {
  const now = new Date();
  const windowEnd = addDays(now, withinDays);
  const reminders = await prisma.reminder.findMany({
    where: {
      userId,
      dueOn: {
        gte: now,
        lte: windowEnd,
      },
      ...(includeSatisfied
        ? {}
        : {
            OR: [
              { satisfiedAt: null },
              {
                satisfiedAt: {
                  gt: now,
                },
              },
            ],
          }),
    },
    orderBy: { dueOn: "asc" },
  });

  return reminders.map((reminder) =>
    reminderSchema.parse({
      id: reminder.id,
      vehicleId: reminder.vehicleId,
      type: reminder.type,
      dueDate: reminder.dueOn,
      satisfiedAt: reminder.satisfiedAt,
      leadTimeDays: reminder.leadTimeDays,
      channels: parseChannels(reminder.channelsRaw),
      notes: reminder.notes,
      createdAt: reminder.createdAt,
      updatedAt: reminder.updatedAt,
    }),
  );
};

export const markReminderSatisfied = async (reminderId: string) => {
  const reminder = await prisma.reminder.update({
    where: { id: reminderId },
    data: {
      satisfiedAt: new Date(),
      nextNotifiedAt: null,
    },
  });

  return reminderSchema.parse({
    id: reminder.id,
    vehicleId: reminder.vehicleId,
    type: reminder.type,
    dueDate: reminder.dueOn,
    satisfiedAt: reminder.satisfiedAt,
    leadTimeDays: reminder.leadTimeDays,
    channels: parseChannels(reminder.channelsRaw),
    notes: reminder.notes,
    createdAt: reminder.createdAt,
    updatedAt: reminder.updatedAt,
  });
};

const parseChannels = (raw: string | null | undefined): Reminder["channels"] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((value): value is Reminder["channels"][number] =>
        ["PUSH", "EMAIL", "SMS"].includes(value),
      );
    }
    return [];
  } catch {
    return [];
  }
};

export const autoScheduleComplianceReminders = async (userId: string) => {
  const vehicles = await prisma.vehicle.findMany({
    where: { userId },
  });

  const now = new Date();

  const batch: Promise<unknown>[] = [];

  for (const vehicle of vehicles) {
    if (isBefore(vehicle.registrationDueOn, now)) {
      batch.push(
        scheduleReminder(userId, {
          vehicleId: vehicle.id,
          type: "REGISTRATION",
          dueDate: vehicle.registrationDueOn,
          channels: ["PUSH", "EMAIL"],
          leadTimeDays: 30,
          notes: "Automatic registration renewal reminder",
        }),
      );
    }

    if (vehicle.emissionsDueOn) {
      batch.push(
        scheduleReminder(userId, {
          vehicleId: vehicle.id,
          type: "EMISSIONS",
          dueDate: vehicle.emissionsDueOn,
          channels: ["PUSH"],
          leadTimeDays: 45,
          notes: "Automatic emissions testing reminder",
        }),
      );
    }
  }

  await Promise.allSettled(batch);
};
