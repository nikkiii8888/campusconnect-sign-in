import { useEffect, useRef, useState } from "react";
import { MapPin, Search, QrCode, X, Check, AlertTriangle, Ban, DoorOpen } from "lucide-react";

type Facility = { id: string; name: string; hours: string; count: number; capacity: number; rooms: string[]; closed?: boolean; note?: string };

const FACILITIES: Facility[] = [
  { id: "REC", name: "Recreation Center", hours: "6 AM – 11 PM", count: 142, capacity: 200, rooms: ["Court 1", "Court 2", "Yoga Studio"] },
  { id: "LIB", name: "Main Library", hours: "7 AM – 2 AM", count: 296, capacity: 300, rooms: ["Study Room 2A", "Study Room 2B", "Group Room 3C"] },
  { id: "SU", name: "Student Union", hours: "8 AM – 10 PM", count: 48, capacity: 250, rooms: ["Meeting Room 101", "Lounge Booth"] },
  { id: "LAB", name: "Science Lab B", hours: "9 AM – 6 PM", count: 12, capacity: 40, rooms: ["Bench 4", "Bench 7"] },
  { id: "POOL", name: "Aquatic Center", hours: "6 AM – 9 PM", count: 60, capacity: 60, rooms: ["Lane 1", "Lane 2", "Lane 3"] },
  { id: "ART", name: "Arts Building", hours: "8 AM – 8 PM", count: 35, capacity: 120, rooms: ["Music Practice 1", "Studio A"] },
  { id: "TUT", name: "Tutoring Center", hours: "9 AM – 5 PM", count: 0, capacity: 30, rooms: ["Desk 1", "Desk 2"], closed: true, note: "closed until 9 AM tomorrow" },
];
const ROOM_TIMES = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"];

type Msg = { kind: "success" | "warn" | "error"; title: string; text: string } | null;

const level = (f: Facility) => {
  if (f.closed) return { label: "Closed", cls: "crowd-full" };
  const r = f.count / f.capacity;
  if (r >= 1) return { label: "Full", cls: "crowd-full" };
  if (r >= 0.7) return { label: "Busy", cls: "crowd-busy" };
  return { label: "Quiet", cls: "crowd-quiet" };
};

export function Facilities() {
  const [list, setList] = useState(FACILITIES);
  const [q, setQ] = useState("");
  const [checkedIn, setCheckedIn] = useState<string | null>(null);
  const [msg, setMsg] = useState<Msg>(null);
  const [scanning, setScanning] = useState(false);
  const [bookFor, setBookFor] = useState<Facility | null>(null);

  const filtered = list.filter((f) => f.name.toLowerCase().includes(q.trim().toLowerCase()));

  const checkIn = (id: string) => {
    const f = list.find((x) => x.id === id);
    if (!f) return setMsg({ kind: "error", title: "Check-in denied", text: "That QR code doesn't match a campus facility. Use the code printed by the entrance." });
    if (checkedIn === id) {
      setCheckedIn(null);
      setList(list.map((x) => (x.id === id ? { ...x, count: x.count - 1 } : x)));
      return setMsg({ kind: "success", title: "Checked out", text: `You've checked out of ${f.name}. Your visit was recorded.` });
    }
    if (f.closed) return setMsg({ kind: "error", title: "Check-in denied", text: `${f.name} is ${f.note ?? "closed right now"}. Check the posted hours before you scan.` });
    if (checkedIn) {
      const here = list.find((x) => x.id === checkedIn);
      return setMsg({ kind: "error", title: "Check-in denied", text: `You're already checked in at ${here?.name ?? "another facility"}. Check out there first, then scan again.` });
    }
    const pct = f.count / f.capacity;
    if (pct >= 1) return setMsg({ kind: "error", title: "Check-in denied", text: `${f.name} is at full capacity (${f.count}/${f.capacity}). Try again later or prebook a room.` });
    setList(list.map((x) => (x.id === id ? { ...x, count: x.count + 1 } : x)));
    setCheckedIn(id);
    if (pct >= 0.7) setMsg({ kind: "warn", title: "Check-in accepted", text: `You're in at ${f.name}, but it's busy right now (${f.count + 1}/${f.capacity}). Expect a wait for a spot.` });
    else setMsg({ kind: "success", title: "Check-in accepted", text: `You're in at ${f.name}. It's quiet right now (${f.count + 1}/${f.capacity}).` });
  };

  return (
    <section className="card">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground"><MapPin className="h-4 w-4" /></span>
        Facilities
      </h2>

      <div className="relative mt-4">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} maxLength={60} onChange={(e) => setQ(e.target.value)} placeholder="Search facilities" className="field pl-11" />
      </div>

      <button onClick={() => { setMsg(null); setScanning(true); }} className="btn-primary mt-3 flex w-full items-center justify-center gap-2">
        <QrCode className="h-5 w-5" /> Scan QR to check in
      </button>

      {msg && (
        <div className={`alert alert-${msg.kind} mt-3`} role={msg.kind === "error" ? "alert" : "status"}>
          {msg.kind === "success" ? <Check className="h-5 w-5 shrink-0" /> : msg.kind === "warn" ? <AlertTriangle className="h-5 w-5 shrink-0" /> : <Ban className="h-5 w-5 shrink-0" />}
          <span className="flex-1">
            <span className="block font-display text-sm font-bold uppercase tracking-wide">{msg.title}</span>
            <span className="mt-1 block text-[0.82rem] font-normal leading-snug opacity-90">{msg.text}</span>
          </span>
          <button onClick={() => setMsg(null)} aria-label="Dismiss"><X className="h-4 w-4" /></button>
        </div>
      )}

      <ul className="mt-4 flex flex-col gap-3">
        {filtered.length === 0 && <li className="text-sm text-muted-foreground">No facilities match "{q}".</li>}
        {filtered.map((f) => {
          const lv = level(f);
          const on = checkedIn === f.id;
          return (
            <li key={f.id} className="rounded-2xl bg-muted p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{f.name}</p>
                  <p className="text-xs text-muted-foreground">Open {f.hours}</p>
                </div>
                <span className={`crowd ${lv.cls}`}>{lv.label}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-card">
                <div className={`h-2 rounded-full bar-${lv.cls}`} style={{ width: `${Math.min(100, (f.count / f.capacity) * 100)}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{f.closed ? f.note : `${f.count} / ${f.capacity} people`}</p>
              <div className="mt-3 flex gap-2">
                {f.closed ? (
                  <span className="chip opacity-60"><Ban className="h-4 w-4" /> Closed</span>
                ) : (
                  <button onClick={() => checkIn(f.id)} className={on ? "chip chip-active" : "chip"}>
                    {on ? <><Check className="h-4 w-4" /> Checked in · tap to leave</> : "Check in"}
                  </button>
                )}
                <button onClick={() => setBookFor(f)} className="chip"><DoorOpen className="h-4 w-4" /> Prebook room</button>
              </div>
            </li>
          );
        })}
      </ul>

      {scanning && (
        <Scanner
          onClose={() => setScanning(false)}
          onResult={(code) => { setScanning(false); checkIn(code.replace(/^CAMPUS:/, "").trim().toUpperCase()); }}
        />
      )}
      {bookFor && (
        <BookRoom f={bookFor} onClose={() => setBookFor(null)} onBooked={(text) => { setBookFor(null); setMsg({ kind: "success", title: "Room reserved", text }); }} />
      )}
    </section>
  );
}

function Scanner({ onClose, onResult }: { onClose: () => void; onResult: (code: string) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: number | undefined;
    let stopped = false;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (stopped) return;
        if (video.current) { video.current.srcObject = stream; await video.current.play(); }
        const BD = (window as unknown as { BarcodeDetector?: new (o: object) => { detect: (v: HTMLVideoElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector;
        if (!BD) { setErr("This browser can't read QR codes automatically. Use a demo code below."); return; }
        const det = new BD({ formats: ["qr_code"] });
        const tick = async () => {
          if (stopped || !video.current) return;
          try {
            const r = await det.detect(video.current);
            if (r[0]) return onResult(r[0].rawValue);
          } catch { /* keep trying */ }
          timer = window.setTimeout(tick, 400);
        };
        tick();
      } catch {
        setErr("Camera access was blocked or isn't available. Use a demo code below.");
      }
    })();
    return () => { stopped = true; clearTimeout(timer); stream?.getTracks().forEach((t) => t.stop()); };
  }, [onResult]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="font-display text-xl font-bold text-foreground">Scan facility QR</p>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="scanner mt-4">
          <video ref={video} playsInline muted className="h-full w-full object-cover" />
          <div className="scan-frame" />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{err || "Point your camera at the QR code by the facility entrance."}</p>
        <p className="label mt-4">Demo codes</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {FACILITIES.map((f) => (
            <button key={f.id} onClick={() => onResult(`CAMPUS:${f.id}`)} className="chip">{f.name}</button>
          ))}
          <button onClick={() => onResult("UNKNOWN")} className="chip">Invalid code</button>
        </div>
      </div>
    </div>
  );
}

function BookRoom({ f, onClose, onBooked }: { f: Facility; onClose: () => void; onBooked: (t: string) => void }) {
  const [room, setRoom] = useState(f.rooms[0]!);
  const [time, setTime] = useState<string | null>(null);
  const [day, setDay] = useState("Today");
  const full = (t: string, i: number) => (room.length + i + day.length) % 3 === 0 || (f.count >= f.capacity && i < 2);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="font-display text-xl font-bold text-foreground">Prebook at {f.name}</p>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <p className="label mt-4">Room</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {f.rooms.map((r) => <button key={r} onClick={() => { setRoom(r); setTime(null); }} className={r === room ? "chip chip-active" : "chip"}>{r}</button>)}
        </div>
        <p className="label mt-4">Day</p>
        <div className="mt-2 flex gap-2">
          {["Today", "Tomorrow", "Sat, Oct 24"].map((d) => <button key={d} onClick={() => { setDay(d); setTime(null); }} className={d === day ? "chip chip-active" : "chip"}>{d}</button>)}
        </div>
        <p className="label mt-4">Time (1 hour)</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {ROOM_TIMES.map((t, i) => (
            <button key={t} disabled={full(t, i)} onClick={() => setTime(t)}
              className={t === time ? "chip chip-active justify-center" : "chip justify-center disabled:opacity-30 disabled:line-through"}>{t}</button>
          ))}
        </div>
        <button disabled={!time} onClick={() => onBooked(`${room} at ${f.name} is reserved for ${day} at ${time}. Scan in within 15 minutes of your start time.`)}
          className="btn-primary mt-5 w-full disabled:opacity-50">
          {time ? `Reserve ${room} · ${time}` : "Select a time"}
        </button>
      </div>
    </div>
  );
}
