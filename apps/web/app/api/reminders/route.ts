import { NextResponse } from "next/server";
import { getDemoUser } from "../../../lib/demo-user";
import { getDueReminders, scheduleReminder } from "@repo/db";
import { createReminderPayloadSchema } from "@repo/core";

export async function GET(request: Request) {
  const user = await getDemoUser();
  const { searchParams } = new URL(request.url);
  const withinDays = Number(searchParams.get("withinDays") ?? "90");

  const reminders = await getDueReminders({ userId: user.id, withinDays });

  return NextResponse.json({ data: reminders });
}

export async function POST(request: Request) {
  const user = await getDemoUser();
  const json = await request.json();
  const parsed = createReminderPayloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const reminder = await scheduleReminder(user.id, parsed.data);

  return NextResponse.json({ data: reminder }, { status: 201 });
}
