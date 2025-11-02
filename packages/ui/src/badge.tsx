import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "success" | "warning" | "danger" | "info";
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  success: "bg-success/10 text-success ring-success/30",
  warning: "bg-warning/10 text-warning ring-warning/30",
  danger: "bg-danger/10 text-danger ring-danger/30",
  info: "bg-brand-50 text-brand-700 ring-brand-400/40",
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
