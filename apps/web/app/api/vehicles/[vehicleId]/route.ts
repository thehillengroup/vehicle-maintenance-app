import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "../../../../auth";
import { deleteVehicleById, ensureUserByEmail } from "@repo/db";

interface RouteContext {
  params: Promise<{ vehicleId: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await ensureUserByEmail(session.user.email);

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
