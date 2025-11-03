import { clsx } from "clsx";
import { JSX } from "react";
import { FaCar } from "react-icons/fa";
import { JSX } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

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

const iconMap: Record<NonNullable<StatCardProps["tone"]>, JSX.Element> = {
  default: <FaCar className="h-5 w-5 text-brand-500" />,
  warning: <FiClock className="h-5 w-5 text-warning" />,
  danger: <FiAlertTriangle className="h-5 w-5 text-danger" />,
  success: <FiCheckCircle className="h-5 w-5 text-success" />,
};

export const StatCard = ({ title, value, helper, tone = "default" }: StatCardProps) => (
  <div
    className={clsx(
      "flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface-raised p-4 shadow-sm ring-1",
      toneRing[tone],
    )}
  >
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">{title}</p>
      <p className="mt-2 font-heading text-2xl font-semibold text-ink">{value}</p>
      {helper ? <p className="mt-1 text-xs text-ink-subtle">{helper}</p> : null}
    </div>
    <div className="rounded-full bg-surface-subtle p-3">
      {iconMap[tone]}
    </div>
  </div>
);
