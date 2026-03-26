import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "success" | "warning" | "danger" | "info";
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800",
  warning: "bg-amber-50  text-amber-700  ring-amber-200  dark:bg-amber-950  dark:text-amber-300  dark:ring-amber-800",
  danger:  "bg-red-50    text-red-700    ring-red-200    dark:bg-red-950    dark:text-red-300    dark:ring-red-800",
  info:    "bg-sky-50    text-sky-700    ring-sky-200    dark:bg-sky-950    dark:text-sky-300    dark:ring-sky-800",
};

export const Badge = ({ tone = "info", className, ...props }: BadgeProps) => (
  <span
    className={clsx(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
      toneStyles[tone],
      className,
    )}
    {...props}
  />
);
