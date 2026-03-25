import { DashboardCta } from "../../components/landing/dashboard-cta";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { WordmarkLogo } from "../../components/ui/wordmark-logo";
import Link from "next/link";
import { Car, ClipboardList, FileUp, CheckCircle2, BellRing, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Car,
    title: "Vehicle tracking",
    description: "Store VIN, registration state, fuel type, and mileage for every vehicle you own.",
  },
  {
    icon: BellRing,
    title: "Smart reminders",
    description: "Get notified before registration, emissions, and service deadlines sneak up on you.",
  },
  {
    icon: ShieldCheck,
    title: "Stay compliant",
    description: "Compliance dates auto-adjust per state so you're never caught off guard.",
  },
];

const sampleReminders = [
  { title: "Registration renewal", vehicle: "Model 3", date: "Aug 12, 2025", tone: "danger" as const },
  { title: "Emissions test", vehicle: "Jeep Cherokee", date: "Sep 4, 2025", tone: "warning" as const },
  { title: "Oil change", vehicle: "Honda Civic", date: "Sep 20, 2025", tone: "info" as const },
];

const reminderTone: Record<"danger" | "warning" | "info", string> = {
  danger:  "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
  warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
  info:    "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200",
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="CarFolio home">
            <WordmarkLogo />
          </Link>
          <div className="flex items-center gap-3">
            <DashboardCta className="text-sm font-medium text-ink-subtle transition hover:text-ink">
              Dashboard
            </DashboardCta>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative border-b border-border overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80')",
            }}
          />
          {/* Gradient overlay — dark at top/bottom, slightly transparent in center */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

          <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-36">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
                Vehicle maintenance, simplified
              </span>
              <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl drop-shadow-lg">
                Keep every vehicle compliant &amp; documented
              </h1>
              <p className="mt-5 text-lg text-white/75">
                CarFolio tracks registration renewals, emissions schedules, and maintenance history
                in one clean view — so nothing slips through the cracks.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <DashboardCta
                  modal="add-vehicle"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700"
                >
                  <Car className="h-4 w-4" />
                  Add your first vehicle
                </DashboardCta>
                <DashboardCta className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20">
                  Explore the dashboard
                </DashboardCta>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="space-y-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-ink">{feature.title}</h3>
                  <p className="text-sm text-ink-subtle">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="border-b border-border bg-surface-subtle">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 className="font-heading text-xl font-bold text-ink">Get started in seconds</h2>
            <p className="mt-1 text-sm text-ink-subtle">Pick an action and you'll be on the dashboard in one click.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Car, title: "Add Vehicle", description: "Track compliance dates and mileage automatically.", modal: "add-vehicle" as const },
                { icon: ClipboardList, title: "Log Maintenance", description: "Save receipts and build a full service history.", modal: "log-maintenance" as const },
                { icon: FileUp, title: "Import Records", description: "Bring in CSV exports or dealership reports.", modal: undefined },
              ].map((action) => (
                <DashboardCta
                  key={action.title}
                  modal={action.modal}
                  className="group flex flex-col gap-3 rounded-xl border border-border bg-surface-raised p-5 text-left shadow-card transition hover:border-brand-300 hover:shadow-card-md dark:hover:border-brand-700"
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-subtle text-ink-subtle transition group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-brand-950 dark:group-hover:text-brand-400">
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{action.title}</p>
                    <p className="mt-0.5 text-xs text-ink-subtle">{action.description}</p>
                  </div>
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                    Get started →
                  </span>
                </DashboardCta>
              ))}
            </div>
          </div>
        </section>

        {/* Reminder preview */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-ink">Upcoming reminders</h2>
                <p className="mt-1 text-sm text-ink-subtle">Here's how your timeline looks once your garage is set up.</p>
              </div>
              <DashboardCta className="text-sm font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-400">
                View full schedule →
              </DashboardCta>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {sampleReminders.map((reminder) => (
                <div
                  key={reminder.title}
                  className={`rounded-xl border p-4 ${reminderTone[reminder.tone]}`}
                >
                  <p className="text-sm font-semibold">{reminder.title}</p>
                  <p className="mt-0.5 text-xs opacity-70">{reminder.vehicle}</p>
                  <p className="mt-2 text-xs font-medium opacity-80">{reminder.date}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Checklist tip */}
        <section>
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <div className="rounded-xl border border-border bg-surface-raised p-6 shadow-card sm:flex sm:items-center sm:gap-8">
              <div className="flex-1">
                <h3 className="font-heading text-base font-semibold text-ink">Before you add your first vehicle</h3>
                <ul className="mt-3 space-y-2">
                  {[
                    "Have your VIN handy (driver-side dash or vehicle title)",
                    "Know your last registration or inspection date",
                    "Estimate your current mileage",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink-subtle">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600 dark:text-brand-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 sm:mt-0 sm:flex-shrink-0">
                <DashboardCta
                  modal="add-vehicle"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                >
                  <Car className="h-4 w-4" />
                  Add vehicle
                </DashboardCta>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <p className="text-xs text-ink-subtle">&copy; {new Date().getFullYear()} CarFolio. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link className="text-xs text-ink-subtle transition hover:text-ink" href="#">Privacy</Link>
            <Link className="text-xs text-ink-subtle transition hover:text-ink" href="#">Terms</Link>
            <Link className="text-xs text-ink-subtle transition hover:text-ink" href="#">Support</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
