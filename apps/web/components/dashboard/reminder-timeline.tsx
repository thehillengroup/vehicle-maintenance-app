import { format } from "date-fns";
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

export const ReminderTimeline = ({ reminders }: ReminderTimelineProps) => {
  if (!reminders.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface-raised p-6 text-sm text-ink-subtle">
        No upcoming reminders. Add a vehicle or log maintenance to generate alerts.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {reminders.map((reminder) => (
        <li
          key={reminder.id}
          className="flex items-start gap-4 rounded-xl border border-border bg-surface-raised p-4 shadow-sm"
        >
          <div className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-brand-500" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-sm font-semibold text-ink">
                {reminder.type === "SERVICE" ? "Scheduled service" : `${reminder.type.toLowerCase()} check`}
              </h3>
              <Badge tone={toneForType[reminder.type]}>
                Due {format(reminder.dueDate, "MMM d, yyyy")}
              </Badge>
            </div>
            {reminder.notes ? (
              <p className="mt-1 text-sm text-ink-subtle">{reminder.notes}</p>
            ) : null}
            <p className="mt-2 text-xs text-ink-muted">
              Alert via {reminder.channels.join(", ")}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
