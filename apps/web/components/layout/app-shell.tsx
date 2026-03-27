import Link from "next/link";
import { ThemeToggle } from "../ui/theme-toggle";
import { WordmarkLogo } from "../ui/wordmark-logo";
import { signOut } from "../../auth";

export const AppShell = ({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="CarFolio home">
            <WordmarkLogo />
          </Link>

          <div className="flex items-center gap-2">
            {actions}
            <ThemeToggle />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-md px-3 py-1.5 text-xs font-medium text-ink-subtle transition hover:text-ink"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 space-y-8">
        {children}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <p className="text-xs text-ink-subtle">
            &copy; {new Date().getFullYear()} CarFolio. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link className="text-xs text-ink-subtle transition hover:text-ink" href="#">
              Privacy
            </Link>
            <Link className="text-xs text-ink-subtle transition hover:text-ink" href="#">
              Terms
            </Link>
            <Link className="text-xs text-ink-subtle transition hover:text-ink" href="#">
              Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};
