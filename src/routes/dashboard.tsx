import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, MapPin, Wallet, BookOpen, UserRound, LogOut, Check } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · CampusConnect" },
      { name: "description", content: "Your classes, calendar, finances, facilities and advising in one place." },
      { property: "og:title", content: "Dashboard · CampusConnect" },
      { property: "og:description", content: "Your classes, calendar, finances, facilities and advising in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

type Event = { day: number; time: string; title: string };
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [19, 20, 21, 22, 23, 24, 25];
const START_EVENTS: Event[] = [
  { day: 0, time: "9:00 AM", title: "BIO 210 Lecture" },
  { day: 1, time: "11:00 AM", title: "MATH 152 Recitation" },
  { day: 2, time: "9:00 AM", title: "BIO 210 Lecture" },
  { day: 3, time: "2:00 PM", title: "ENG 101 Essay due" },
  { day: 3, time: "4:30 PM", title: "Study group – Library" },
  { day: 4, time: "1:00 PM", title: "PSY 100 Midterm" },
];
const FACILITIES = [
  { name: "Recreation Center", busy: "Moderate" },
  { name: "Main Library", busy: "Busy" },
  { name: "Student Union", busy: "Quiet" },
  { name: "Science Lab B", busy: "Quiet" },
];
const COURSES = [
  { code: "BIO 210", name: "Cell Biology", grade: "A-", pct: 91 },
  { code: "MATH 152", name: "Calculus II", grade: "B+", pct: 88 },
  { code: "ENG 101", name: "Composition", grade: "A", pct: 95 },
  { code: "PSY 100", name: "Intro Psychology", grade: "B", pct: 84 },
];
const ADVISORS = [
  { name: "Dr. Maya Patel", role: "Academic Advisor" },
  { name: "Jordan Lee", role: "Math Tutor" },
  { name: "Sam Rivera", role: "Writing Tutor" },
];
const SLOTS = ["10:00 AM", "12:30 PM", "3:00 PM"];

function Dashboard() {
  const [day, setDay] = useState(3);
  const [events, setEvents] = useState(START_EVENTS);
  const [checkedIn, setCheckedIn] = useState<string | null>(null);
  const [advisor, setAdvisor] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState("");

  const book = () => {
    if (!slot) return;
    const a = ADVISORS[advisor];
    setEvents([...events, { day: 4, time: slot, title: `Session with ${a.name}` }]);
    setBooked(`Booked with ${a.name} on Fri at ${slot}`);
    setSlot(null);
  };

  const dayEvents = events.filter((e) => e.day === day);

  return (
    <main className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md px-5 pt-10 pb-12 flex flex-col gap-5">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Thursday, Oct 22</p>
            <h1 className="font-display text-3xl font-bold text-foreground">Hi, Alex 👋</h1>
          </div>
          <Link to="/" aria-label="Sign out" className="grid h-11 w-11 place-items-center rounded-2xl bg-card text-muted-foreground">
            <LogOut className="h-5 w-5" />
          </Link>
        </header>

        <section className="card">
          <CardTitle icon={<CalendarDays />} title="Calendar" />
          <div className="mt-4 grid grid-cols-7 gap-1">
            {DAYS.map((d, i) => (
              <button key={d} onClick={() => setDay(i)} className={i === day ? "day day-active" : "day"}>
                <span className="text-xs">{d}</span>
                <span className="font-bold">{DATES[i]}</span>
              </button>
            ))}
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {dayEvents.length === 0 && <li className="text-sm text-muted-foreground">Nothing scheduled.</li>}
            {dayEvents.map((e, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-muted p-3 text-sm">
                <span className="w-16 shrink-0 font-semibold text-primary">{e.time}</span>
                <span className="text-foreground">{e.title}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <CardTitle icon={<MapPin />} title="Check into facilities" />
          <ul className="mt-4 flex flex-col gap-2">
            {FACILITIES.map((f) => {
              const on = checkedIn === f.name;
              return (
                <li key={f.name} className="flex items-center justify-between rounded-xl bg-muted p-3">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.busy}</p>
                  </div>
                  <button onClick={() => setCheckedIn(on ? null : f.name)} className={on ? "chip chip-active" : "chip"}>
                    {on ? <><Check className="h-4 w-4" /> Checked in</> : "Check in"}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="card">
          <CardTitle icon={<Wallet />} title="Finances" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat label="Tuition due Nov 15" value="$2,450.00" />
            <Stat label="Meal plan balance" value="$318.40" />
            <Stat label="Financial aid" value="$4,000.00" />
            <Stat label="Campus cash" value="$56.75" />
          </div>
          <button className="btn-primary mt-4 w-full">Make a payment</button>
        </section>

        <section className="card">
          <CardTitle icon={<BookOpen />} title="Academics" />
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Current GPA</p>
              <p className="font-display text-4xl font-bold text-foreground">3.62</p>
            </div>
            <p className="text-sm text-muted-foreground">Fall 2026 · 14 credits</p>
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {COURSES.map((c) => (
              <li key={c.code}>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground"><b>{c.code}</b> · {c.name}</span>
                  <span className="font-bold text-primary">{c.grade}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${c.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <CardTitle icon={<UserRound />} title="Book a session" />
          <div className="mt-4 flex flex-col gap-2">
            {ADVISORS.map((a, i) => (
              <button key={a.name} onClick={() => setAdvisor(i)} className={i === advisor ? "option option-active" : "option"}>
                <span className="font-semibold">{a.name}</span>
                <span className="text-xs opacity-80">{a.role}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-foreground">Friday, Oct 23</p>
          <div className="mt-2 flex gap-2">
            {SLOTS.map((s) => (
              <button key={s} onClick={() => setSlot(s)} className={s === slot ? "chip chip-active" : "chip"}>{s}</button>
            ))}
          </div>
          <button onClick={book} disabled={!slot} className="btn-primary mt-4 w-full disabled:opacity-50">Book session</button>
          {booked && <p className="mt-3 text-sm text-primary font-semibold">{booked}. Added to your calendar.</p>}
        </section>
      </div>
    </main>
  );
}

function CardTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {title}
    </h2>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-bold text-foreground">{value}</p>
    </div>
  );
}
