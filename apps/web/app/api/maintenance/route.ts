import { NextResponse } from "next/server";
import { z } from "zod";
import { getDemoUser } from "../../../lib/demo-user";
import { logMaintenanceEvent } from "@repo/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const withCors = (response: NextResponse) => {
  Object.entries(corsHeaders).forEach(([key, value]) =>
    response.headers.set(key, value),
  );
  return response;
};

export function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

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
  const user = await getDemoUser();
  const json = await request.json();
  const parsed = maintenanceSchema.safeParse(json);

  if (!parsed.success) {
    return withCors(
      NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      ),
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

  return withCors(NextResponse.json({ success: true }, { status: 201 }));
}
