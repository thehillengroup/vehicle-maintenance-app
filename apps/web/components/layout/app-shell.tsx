import Link from "next/link";
import { FiLogIn } from "react-icons/fi";
import { Button } from "@repo/ui/button";

export const AppShell = ({ children, actions }: { children: React.ReactNode; actions?: React.ReactNode }) => {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-10 flex items-center justify-between border-b border-white/60 py-4">
        <Link href="#" className="font-heading text-xl font-semibold text-ink">
          FleetCare
        </Link>
        <div className="flex items-center gap-3">
          {actions}
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-white/20"
          >
            <FiLogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Log in</span>
          </Button>
        </div>
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
