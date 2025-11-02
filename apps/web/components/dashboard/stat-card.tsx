import { clsx } from "clsx";

interface StatCardProps {
  title: string;
  value: string;
  helper?: string;
  tone?: "default" | "warning" | "danger" | "success";
}

const toneRing: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "ring-brand-200/60",
  warning: "ring-warning/40",
  danger: "ring-danger/40",
  success: "ring-success/40",
};

export const StatCard = ({ title, value, helper, tone = "default" }: StatCardProps) => (
  <div
    className={clsx(
      "rounded-2xl border border-border bg-surface-raised p-4 shadow-sm ring-1",
      toneRing[tone],
    )}
  >
    <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">{title}</p>
    <p className="mt-2 font-heading text-2xl font-semibold text-ink">{value}</p>
    {helper ? <p className="mt-1 text-xs text-ink-subtle">{helper}</p> : null}
  </div>
);
