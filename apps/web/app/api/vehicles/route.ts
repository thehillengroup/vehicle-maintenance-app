import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDemoUser } from "../../../lib/demo-user";
import { DuplicateVehicleVinError, listVehicles, upsertVehicle } from "@repo/db";
import { vehicleUpsertSchema } from "@repo/core";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
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

export async function GET() {
  const user = await getDemoUser();
  const vehicles = await listVehicles(user.id);
  return withCors(NextResponse.json({ data: vehicles }));
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

  try {
    const vehicle = await upsertVehicle({
      userId: user.id,
      payload: parsed.data,
    });

    revalidatePath("/");

    return withCors(NextResponse.json({ data: vehicle }, { status: 201 }));
  } catch (error) {
    if (error instanceof DuplicateVehicleVinError) {
      return withCors(
        NextResponse.json(
          { error: error.message },
          { status: 409 },
        ),
      );
    }
    console.error("Vehicle create failed", error);
    return withCors(
      NextResponse.json(
        { error: "Unable to save vehicle right now." },
        { status: 500 },
      ),
    );
  }
}
