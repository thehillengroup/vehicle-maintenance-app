import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteVehicleById } from "@repo/db";
import { getDemoUser } from "../../../../lib/demo-user";

interface RouteContext {
  params: Promise<{ vehicleId: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getDemoUser();
  const { vehicleId } = await context.params;

  if (!vehicleId) {
    return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 });
  }

  try {
    await deleteVehicleById(user.id, vehicleId);
    revalidatePath("/");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete vehicle" }, { status: 500 });
  }
}
