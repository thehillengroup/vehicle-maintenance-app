import { NextResponse } from "next/server";
import { getAllMakes } from "../../../../lib/nhtsa";

export const revalidate = 0; // always fetch fresh data

export async function GET() {
  try {
    const makes = await getAllMakes();
    return NextResponse.json(
      { makes },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load vehicle makes from NHTSA.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
