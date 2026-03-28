import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "../../../../auth";
import { ensureUserByEmail, deleteMaintenanceEvent, updateMaintenanceEvent } from "@repo/db";

interface RouteContext {
  params: Promise<{ eventId: string }>;
}

const updateSchema = z.object({
  serviceDate: z.coerce.date().optional(),
  headline: z.string().min(1).optional(),
  odometer: z.number().int().nonnegative().nullable().optional(),
  costCents: z.number().int().nonnegative().nullable().optional(),
  location: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await ensureUserByEmail(session.user.email);

  const { eventId } = await context.params;
  const json = await request.json();
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const event = await updateMaintenanceEvent(user.id, eventId, parsed.data);
    return NextResponse.json(event);
  } catch (error: unknown) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Unable to update event";
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await ensureUserByEmail(session.user.email);

  const { eventId } = await context.params;

  try {
    await deleteMaintenanceEvent(user.id, eventId);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Unable to delete event";
    return NextResponse.json({ error: message }, { status });
  }
}
