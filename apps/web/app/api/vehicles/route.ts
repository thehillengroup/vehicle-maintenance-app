import { NextResponse } from "next/server";
import { getDemoUser } from "../../../lib/demo-user";
import { listVehicles, upsertVehicle } from "@repo/db";
import { vehicleUpsertSchema } from "@repo/core";

export async function GET() {
  const user = await getDemoUser();
  const vehicles = await listVehicles(user.id);
  return NextResponse.json({ data: vehicles });
}

export async function POST(request: Request) {
  const user = await getDemoUser();
  const json = await request.json();

  const parsed = vehicleUpsertSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const vehicle = await upsertVehicle({ userId: user.id, payload: parsed.data });

  return NextResponse.json({ data: vehicle }, { status: 201 });
}
