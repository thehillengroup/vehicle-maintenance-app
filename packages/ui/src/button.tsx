import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-sm shadow-brand-900/10 hover:bg-brand-700 focus-visible:outline-brand-500",
  secondary:
    "bg-surface-raised text-ink shadow-sm hover:bg-surface-subtle focus-visible:outline-brand-500",
  ghost:
    "bg-transparent text-brand-600 hover:bg-brand-50/70 focus-visible:outline-brand-300",
  destructive:
    "bg-danger text-white shadow-sm hover:bg-danger/90 focus-visible:outline-danger",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", className, type = "button", asChild = false, ...rest },
    ref,
  ) => {
    const Component = asChild ? Slot : "button";
    return (
      <Component
        ref={ref as never}
        type={asChild ? undefined : type}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          variantStyles[variant],
          className,
        )}
        {...rest}
      />
    );
  },
);

Button.displayName = "Button";
