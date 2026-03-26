import { clsx } from "clsx";
import { JSX } from "react";
import { Car, Clock, AlertTriangle, Gauge } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  helper?: string;
  tone?: "default" | "warning" | "danger" | "success";
}

const toneStyles: Record<
  NonNullable<StatCardProps["tone"]>,
  { border: string; icon: string; iconBg: string }
> = {
  default: {
    border: "border-border",
    icon:   "text-brand-600 dark:text-brand-400",
    iconBg: "bg-brand-50 dark:bg-brand-950",
  },
  warning: {
    border: "border-amber-200 dark:border-amber-800",
    icon:   "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950",
  },
  danger: {
    border: "border-red-200 dark:border-red-800",
    icon:   "text-red-600 dark:text-red-400",
    iconBg: "bg-red-50 dark:bg-red-950",
  },
  success: {
    border: "border-emerald-200 dark:border-emerald-800",
    icon:   "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-950",
  },
};

const iconMap: Record<NonNullable<StatCardProps["tone"]>, JSX.Element> = {
  default: <Car className="h-4 w-4" />,
  warning: <Clock className="h-4 w-4" />,
  danger:  <AlertTriangle className="h-4 w-4" />,
  success: <Gauge className="h-4 w-4" />,
};

export const StatCard = ({ title, value, helper, tone = "default" }: StatCardProps) => {
  const styles = toneStyles[tone];
  return (
    <div
      className={clsx(
        "flex items-start justify-between gap-4 rounded-xl border bg-surface-raised p-5 shadow-card",
        styles.border,
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">{title}</p>
        <p className="mt-1.5 font-heading text-2xl font-bold text-ink">{value}</p>
        {helper ? <p className="mt-1 text-xs text-ink-subtle">{helper}</p> : null}
      </div>
      <div className={clsx("flex-shrink-0 rounded-lg p-2.5", styles.iconBg, styles.icon)}>
        {iconMap[tone]}
      </div>
    </div>
  );
};
