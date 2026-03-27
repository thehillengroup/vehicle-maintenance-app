import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";
import { DuplicateVehicleVinError, ensureUserByEmail, listVehicles, upsertVehicle } from "@repo/db";
import { vehicleUpsertSchema } from "@repo/core";

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return unauthorized();
  const user = await ensureUserByEmail(session.user.email);
  const vehicles = await listVehicles(user.id);
  return NextResponse.json({ data: vehicles });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return unauthorized();
  const user = await ensureUserByEmail(session.user.email);

  const json = await request.json();
  const parsed = vehicleUpsertSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const vehicle = await upsertVehicle({ userId: user.id, payload: parsed.data });
    revalidatePath("/");
    return NextResponse.json({ data: vehicle }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateVehicleVinError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Vehicle create failed", error);
    return NextResponse.json({ error: "Unable to save vehicle right now." }, { status: 500 });
  }
}
