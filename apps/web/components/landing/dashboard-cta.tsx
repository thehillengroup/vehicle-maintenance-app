"use client";

import { ButtonHTMLAttributes } from "react";
import { useRouter } from "next/navigation";

interface DashboardCtaProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  modal?: "add-vehicle" | "log-maintenance";
}

export function DashboardCta({ modal, className = "", children, onClick, ...rest }: DashboardCtaProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (modal) {
          sessionStorage.setItem("dashboard:modal", modal);
        } else {
          sessionStorage.removeItem("dashboard:modal");
        }
        router.push("/dashboard");
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
