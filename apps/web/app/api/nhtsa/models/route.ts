import { NextRequest, NextResponse } from "next/server";
import { getModelsForMake } from "../../../../lib/nhtsa";

export const revalidate = 0; // always fetch fresh data

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get("make");

  if (!make) {
    return NextResponse.json(
      { error: "Query parameter `make` is required." },
      { status: 400 },
    );
  }

  try {
    const models = await getModelsForMake(make);
    return NextResponse.json(
      { models },
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
        : "Unable to load vehicle models from NHTSA.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
