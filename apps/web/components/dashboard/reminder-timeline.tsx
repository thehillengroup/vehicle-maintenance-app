import { differenceInCalendarDays, format } from "date-fns";
import type { Reminder } from "@repo/core";
import { Badge } from "@repo/ui/badge";

interface ReminderTimelineProps {
  reminders: Reminder[];
}

const toneForType: Record<Reminder["type"], "danger" | "info" | "warning"> = {
  REGISTRATION: "danger",
  EMISSIONS: "warning",
  SERVICE: "info",
};

const dotColor: Record<Reminder["type"], string> = {
  REGISTRATION: "bg-red-500",
  EMISSIONS: "bg-amber-500",
  SERVICE: "bg-brand-500",
};

export const ReminderTimeline = ({ reminders }: ReminderTimelineProps) => {
  if (!reminders.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-ink-subtle">
        No upcoming reminders. Add a vehicle to start tracking.
      </div>
    );
  }

  return (
    <ul className="space-y-px">
      {reminders.map((reminder, idx) => {
        const daysUntil = differenceInCalendarDays(reminder.dueDate, new Date());
        return (
          <li key={reminder.id} className="relative flex gap-3 py-3">
            {/* Timeline line */}
            {idx < reminders.length - 1 ? (
              <div className="absolute left-[7px] top-[26px] h-full w-px bg-border" />
            ) : null}

            <div className={`relative mt-1.5 h-3.5 w-3.5 flex-none rounded-full ring-2 ring-surface-raised ${dotColor[reminder.type]}`} />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-ink">
                  {reminder.type === "SERVICE"
                    ? "Service"
                    : reminder.type === "REGISTRATION"
                    ? "Registration"
                    : "Emissions"}
                </span>
                <Badge tone={toneForType[reminder.type]}>
                  {daysUntil < 0
                    ? `${Math.abs(daysUntil)}d overdue`
                    : daysUntil === 0
                    ? "Today"
                    : `${daysUntil}d`}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-ink-subtle">
                {format(reminder.dueDate, "MMM d, yyyy")}
              </p>
              {reminder.notes ? (
                <p className="mt-0.5 text-xs text-ink-subtle">{reminder.notes}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
