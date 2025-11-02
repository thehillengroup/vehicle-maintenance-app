import { clsx } from "clsx";

interface StatCardProps {
  title: string;
  value: string;
  helper?: string;
  tone?: "default" | "warning" | "danger" | "success";
}

const toneRing: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "ring-brand-200",
  warning: "ring-amber-200",
  danger: "ring-red-200",
  success: "ring-emerald-200",
};

export const StatCard = ({ title, value, helper, tone = "default" }: StatCardProps) => (
  <div
    className={clsx(
      "rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm ring-1",
      toneRing[tone],
    )}
  >
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
    <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
  </div>
);
