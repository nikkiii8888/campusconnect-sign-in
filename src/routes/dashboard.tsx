import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Facilities } from "@/components/Facilities";
import { CalendarDays, Wallet, BookOpen, UserRound, LogOut, Check } from "lucide-react";

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
const COURSES = [
  { code: "BIO 210", name: "Cell Biology", grade: "A-", pct: 91 },
  { code: "MATH 152", name: "Calculus II", grade: "B+", pct: 88 },
  { code: "ENG 101", name: "Composition", grade: "A", pct: 95 },
  { code: "PSY 100", name: "Intro Psychology", grade: "B", pct: 84 },
];
const ADVISORS = [
  { name: "Dr. Maya Patel", role: "Academic Advisor", place: "Advising Center, Rm 204", initials: "MP" },
  { name: "Jordan Lee", role: "Math Tutor", place: "Tutoring Hub, Library 2F", initials: "JL" },
  { name: "Sam Rivera", role: "Writing Tutor", place: "Writing Center, Hall B", initials: "SR" },
];
const TOPICS = ["Course planning", "Homework help", "Exam prep", "Essay review", "Other"];
const DURATIONS = [30, 60];
const SLOTS = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM"];
const TODAY = 22;
const MONTH_OFFSET = 3; // Oct 1, 2026 is a Thursday (Mon-first grid)
const isWeekend = (d: number) => [5, 6].includes((d - 1 + MONTH_OFFSET) % 7);
const slotTaken = (adv: number, d: number, i: number) => (adv * 7 + d * 3 + i * 5) % 4 === 0;
type Booking = { advisor: number; date: number; time: string; topic: string; duration: number; notes: string };

function Dashboard() {
  const [day, setDay] = useState(3);
  const [events, setEvents] = useState(START_EVENTS);
  const [advisor, setAdvisor] = useState(0);
  const [bDate, setBDate] = useState(23);
  const [slot, setSlot] = useState<string | null>(null);
  const [topic, setTopic] = useState(TOPICS[0]!);
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");
  const [review, setReview] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const book = () => {
    if (!slot) return;
    const bk: Booking = { advisor, date: bDate, time: slot, topic, duration, notes: notes.trim().slice(0, 300) };
    if (bDate >= 19 && bDate <= 25)
      setEvents([...events, { day: bDate - 19, time: slot, title: `${topic} · ${ADVISORS[advisor]!.name}` }]);
    setConfirmed(bk);
    setReview(false);
    setSlot(null);
    setNotes("");
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

        <Facilities />

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

          {confirmed ? (
            <div className="mt-4 rounded-2xl bg-muted p-5 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-7 w-7" />
              </span>
              <p className="mt-3 font-display text-xl font-bold text-foreground">You're booked!</p>
              <p className="mt-1 text-sm text-muted-foreground">Confirmation #CC-{1000 + confirmed.date * 7 + confirmed.advisor}</p>
              <dl className="mt-4 flex flex-col gap-2 text-left text-sm">
                <Row k="With" v={`${ADVISORS[confirmed.advisor]!.name} (${ADVISORS[confirmed.advisor]!.role})`} />
                <Row k="When" v={`Oct ${confirmed.date}, 2026 · ${confirmed.time}`} />
                <Row k="Length" v={`${confirmed.duration} minutes`} />
                <Row k="Topic" v={confirmed.topic} />
                <Row k="Where" v={ADVISORS[confirmed.advisor]!.place} />
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">A reminder will be sent 1 hour before. Added to your calendar.</p>
              <button onClick={() => setConfirmed(null)} className="btn-primary mt-4 w-full">Book another session</button>
            </div>
          ) : (
            <>
              <p className="label mt-4">1. Choose who to meet</p>
              <div className="mt-2 flex flex-col gap-2">
                {ADVISORS.map((a, i) => (
                  <button key={a.name} onClick={() => { setAdvisor(i); setSlot(null); }} className={i === advisor ? "option option-active" : "option"}>
                    <span className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{a.initials}</span>
                      <span className="flex flex-col">
                        <span className="font-semibold">{a.name}</span>
                        <span className="text-xs opacity-80">{a.role} · {a.place}</span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <p className="label mt-5">2. Pick a date</p>
              <div className="mt-2 rounded-2xl bg-muted p-3">
                <p className="text-center font-semibold text-foreground">October 2026</p>
                <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                  {["M","T","W","T","F","S","S"].map((d, i) => <span key={i}>{d}</span>)}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {Array.from({ length: MONTH_OFFSET }).map((_, i) => <span key={"e" + i} />)}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                    const off = d < TODAY || isWeekend(d);
                    return (
                      <button key={d} disabled={off} onClick={() => { setBDate(d); setSlot(null); }}
                        className={d === bDate ? "cal-day day-active" : "cal-day"}>
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="label mt-5">3. Pick a time · Oct {bDate}</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {SLOTS.map((t, i) => {
                  const taken = slotTaken(advisor, bDate, i);
                  return (
                    <button key={t} disabled={taken} onClick={() => setSlot(t)}
                      className={t === slot ? "chip chip-active justify-center" : "chip justify-center disabled:opacity-30 disabled:line-through"}>
                      {t}
                    </button>
                  );
                })}
              </div>

              <p className="label mt-5">4. Session details</p>
              <div className="mt-2 flex gap-2">
                {DURATIONS.map((m) => (
                  <button key={m} onClick={() => setDuration(m)} className={m === duration ? "chip chip-active" : "chip"}>{m} min</button>
                ))}
              </div>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="field mt-3">
                {TOPICS.map((t) => <option key={t}>{t}</option>)}
              </select>
              <textarea value={notes} maxLength={300} onChange={(e) => setNotes(e.target.value)} rows={3}
                placeholder="Anything they should know? (optional)" className="field mt-3" />

              <button onClick={() => setReview(true)} disabled={!slot} className="btn-primary mt-4 w-full disabled:opacity-50">
                {slot ? `Review booking · Oct ${bDate}, ${slot}` : "Select a time"}
              </button>
            </>
          )}
        </section>

        {review && slot && (
          <div className="overlay" onClick={() => setReview(false)}>
            <div className="sheet" onClick={(e) => e.stopPropagation()}>
              <p className="font-display text-xl font-bold text-foreground">Confirm your session</p>
              <dl className="mt-4 flex flex-col gap-2 text-sm">
                <Row k="With" v={ADVISORS[advisor]!.name} />
                <Row k="When" v={`Oct ${bDate}, 2026 · ${slot}`} />
                <Row k="Length" v={`${duration} minutes`} />
                <Row k="Topic" v={topic} />
                <Row k="Where" v={ADVISORS[advisor]!.place} />
                {notes.trim() && <Row k="Notes" v={notes.trim()} />}
              </dl>
              <button onClick={book} className="btn-primary mt-5 w-full">Confirm booking</button>
              <button onClick={() => setReview(false)} className="mt-2 w-full p-3 font-semibold text-muted-foreground">Go back</button>
            </div>
          </div>
        )}
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

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-semibold text-foreground">{v}</dd>
    </div>
  );
}
