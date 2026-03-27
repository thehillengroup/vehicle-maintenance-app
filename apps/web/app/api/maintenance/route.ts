import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "../../../auth";
import { ensureUserByEmail, logMaintenanceEvent } from "@repo/db";

const maintenanceSchema = z.object({
  vehicleId: z.string().uuid(),
  serviceDate: z.coerce.date(),
  headline: z.string().min(1),
  odometer: z.number().int().nonnegative().nullable().optional(),
  costCents: z.number().int().nonnegative().nullable().optional(),
  location: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await ensureUserByEmail(session.user.email);

  const json = await request.json();
  const parsed = maintenanceSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  await logMaintenanceEvent(user.id, {
    vehicleId: payload.vehicleId,
    serviceDate: payload.serviceDate,
    headline: payload.headline,
    odometer: payload.odometer ?? null,
    costCents: payload.costCents ?? null,
    location: payload.location ?? null,
    notes: payload.notes ?? null,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
