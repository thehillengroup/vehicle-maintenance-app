import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@repo/ui/button";

interface AppShellProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const AppShell = ({ title, subtitle, actions, children }: AppShellProps) => {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-10 overflow-hidden rounded-3xl bg-navy text-navy-contrast shadow-2xl">
        <div className="flex flex-col gap-6 p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-300">
                FleetCare
              </p>
              <h1 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-3 max-w-2xl text-sm text-navy-contrast/75">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <Button
              variant="ghost"
              className="border border-white/20 bg-white/10 text-navy-contrast hover:bg-white/20"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden text-sm font-medium sm:inline">Log in</span>
            </Button>
          </div>
          {actions ? (
            <div className="flex flex-wrap justify-end gap-3 sm:gap-4">
              {actions}
            </div>
          ) : null}
        </div>
      </header>
      <main className="space-y-8">{children}</main>
      <footer className="mt-16 rounded-3xl border border-border bg-surface-subtle px-8 py-10 text-sm text-ink-subtle shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md space-y-3">
            <h2 className="font-heading text-lg text-ink">
              FleetCare Vehicle Intelligence
            </h2>
            <p>
              Precision reminders and compliance insights that keep every vehicle ready for the road.
              Connect with the team anytime—support@fleetcare.app
            </p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link className="transition hover:text-brand-600" href="#">
              Privacy
            </Link>
            <Link className="transition hover:text-brand-600" href="#">
              Terms
            </Link>
            <Link className="transition hover:text-brand-600" href="#">
              Support
            </Link>
            <Link className="transition hover:text-brand-600" href="#">
              Status
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-xs">
          &copy; {new Date().getFullYear()} FleetCare Automotive Systems. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

