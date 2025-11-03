import Link from "next/link";
import { clsx } from "clsx";

interface AppShellProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const AppShell = ({ title, subtitle, actions, children }: AppShellProps) => {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">
            FleetCare
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold text-ink sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm text-ink-subtle">{subtitle}</p>
          ) : null}
        </div>
        <div className={clsx("flex items-center gap-3", actions ? "" : "justify-end")}>{actions}</div>
      </header>
      <main className="space-y-8">{children}</main>
      <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-ink-subtle">
        <p>&copy; {new Date().getFullYear()} FleetCare. All rights reserved.</p>
        <nav className="flex gap-4">
          <Link className="transition hover:text-brand-600" href="#">
            Privacy
          </Link>
          <Link className="transition hover:text-brand-600" href="#">
            Terms
          </Link>
          <Link className="transition hover:text-brand-600" href="#">
            Support
          </Link>
        </nav>
      </footer>
    </div>
  );
};
