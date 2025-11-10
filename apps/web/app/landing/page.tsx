import Link from "next/link";

const checklist = [
  "Have your VIN handy",
  "Know the last registration/inspection date",
  "Estimate current mileage",
];

const quickActions = [
  {
    title: "Add Vehicle",
    description: "Track compliance dates and mileage automatically.",
    href: "/dashboard",
  },
  {
    title: "Log Maintenance",
    description: "Save receipts and build a full service history.",
    href: "/dashboard",
  },
  {
    title: "Import Records",
    description: "Bring in CSV exports or dealership reports.",
    href: "/dashboard",
  },
];

const sampleReminders = [
  { title: "Registration • Model 3", date: "Aug 12, 2025", tone: "danger" },
  { title: "Emissions • Jeep Cherokee", date: "Sep 4, 2025", tone: "warning" },
  { title: "Oil Change • Honda Civic", date: "Sep 20, 2025", tone: "info" },
];

const tips = [
  "Tip: Update mileage right after each service visit.",
  "Tip: VIN lives on the driver's dash and vehicle title.",
  "Tip: Compliance dates adjust automatically for each state.",
];

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col gap-10 bg-[#085078] bg-[linear-gradient(to_right,#85d8ce,#085078)] px-4 pb-16 pt-10 text-white lg:px-12">
      <section className="rounded-3xl border border-white/70 bg-white/5 p-8 text-white shadow-2xl backdrop-blur">
        <p className="text-sm uppercase tracking-widest text-white/70">Garage health</p>
        <h1 className="mt-2 text-3xl font-semibold">Keep every vehicle compliant & documented</h1>
        <p className="mt-3 max-w-2xl text-base text-white/80">
          FleetCare tracks registration renewals, emissions schedules, and maintenance history in one view.
          Jump in with your first vehicle or import existing records—your future self will thank you.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-600 shadow-lg shadow-brand-900/10 transition hover:shadow-xl"
          >
            Add your first vehicle
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/80 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Explore the dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr,2fr]">
        <div className="rounded-2xl border border-border bg-white p-6 text-ink shadow-card">
          <p className="text-sm font-semibold">New here?</p>
          <p className="mt-1 text-sm text-ink-muted">Tick through this quick checklist before opening the modal.</p>
          <ul className="mt-4 space-y-3 text-sm text-ink">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-[10px] font-semibold text-brand-600">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="rounded-2xl border border-border bg-white p-5 text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <p className="text-sm font-semibold">{action.title}</p>
              <p className="mt-2 text-sm text-ink-muted">{action.description}</p>
              <span className="mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-wide text-brand-600">
                Get started →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 text-ink shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Upcoming reminders</p>
            <p className="text-xs text-ink-muted">Here’s how the timeline looks once your garage is populated.</p>
          </div>
          <Link href="/dashboard" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View full schedule →
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {sampleReminders.map((reminder) => (
            <div
              key={reminder.title}
              className={`rounded-xl border p-4 text-sm ${
                reminder.tone === "danger"
                  ? "border-rose-200 bg-rose-50 text-rose-900"
                  : reminder.tone === "warning"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-indigo-200 bg-indigo-50 text-indigo-900"
              }`}
            >
              <p className="font-semibold">{reminder.title}</p>
              <p className="mt-1 text-xs opacity-80">{reminder.date}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-white/60 bg-white/10 p-5 text-white backdrop-blur">
        <p className="text-sm font-semibold">Helpful reminders</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {tips.map((tip) => (
            <div key={tip} className="rounded-xl bg-white/70 p-4 text-sm text-ink shadow-card">
              {tip}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

