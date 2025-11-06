import { NextResponse } from "next/server";
import { deleteVehicleById } from "@repo/db";
import { getDemoUser } from "../../../lib/demo-user";

interface RouteParams {
  params: {
    vehicleId: string;
  };
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const user = await getDemoUser();
  const { vehicleId } = params;

  if (!vehicleId) {
    return NextResponse.json(
      { error: "Vehicle ID is required" },
      { status: 400 },
    );
  }

  try {
    await deleteVehicleById(user.id, vehicleId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (typeof error === "object" && error && "status" in error) {
      const status = Number((error as Record<string, unknown>).status);
      if (!Number.isNaN(status) && status >= 400) {
        return NextResponse.json(
          { error: (error as Error).message },
          { status },
        );
      }
    }

    console.error(error);
    return NextResponse.json(
      { error: "Unable to delete vehicle" },
      { status: 500 },
    );
  }
}
