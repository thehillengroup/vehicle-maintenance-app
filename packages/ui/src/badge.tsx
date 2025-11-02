import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "success" | "warning" | "danger" | "info";
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  success: "bg-emerald-100 text-emerald-700 ring-emerald-500/40",
  warning: "bg-amber-100 text-amber-700 ring-amber-500/40",
  danger: "bg-red-100 text-red-700 ring-red-500/40",
  info: "bg-brand-100 text-brand-700 ring-brand-500/40",
};

export const Badge = ({ tone = "info", className, ...props }: BadgeProps) => (
  <span
    className={clsx(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
      toneStyles[tone],
      className,
    )}
    {...props}
  />
);
