import { NextResponse } from "next/server";
import { getDemoUser } from "../../../lib/demo-user";
import { getDueReminders, scheduleReminder } from "@repo/db";
import { createReminderPayloadSchema } from "@repo/core";

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

export async function GET(request: Request) {
  const user = await getDemoUser();
  const { searchParams } = new URL(request.url);
  const withinDays = Number(searchParams.get("withinDays") ?? "90");

  const reminders = await getDueReminders({ userId: user.id, withinDays });

  return withCors(NextResponse.json({ data: reminders }));
}

export async function POST(request: Request) {
  const user = await getDemoUser();
  const json = await request.json();
  const parsed = createReminderPayloadSchema.safeParse(json);

  if (!parsed.success) {
    return withCors(
      NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      ),
    );
  }

  const reminder = await scheduleReminder(user.id, parsed.data);

  return withCors(NextResponse.json({ data: reminder }, { status: 201 }));
}
