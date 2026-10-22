import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in · CampusConnect" },
      { name: "description", content: "Sign in to CampusConnect with your username and password." },
      { property: "og:title", content: "Sign in · CampusConnect" },
      { property: "og:description", content: "Sign in to CampusConnect with your username and password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setError("");
  };

  return (
    <main className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md flex flex-col px-6 pt-16 pb-10">
        <div className="hero-blob" aria-hidden />
        <div className="relative flex items-center gap-2">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="font-display text-xl font-bold text-foreground">campusconnect</span>
        </div>

        <h1 className="relative mt-14 font-display text-4xl font-bold leading-tight text-foreground">
          Welcome back to campus.
        </h1>
        <p className="relative mt-3 text-muted-foreground">Sign in to see what's happening today.</p>

        <form onSubmit={onSubmit} className="relative mt-10 flex flex-col gap-5" noValidate>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">Username</span>
            <input
              className="field"
              autoComplete="username"
              maxLength={50}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your.username"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">Password</span>
            <div className="relative">
              <input
                className="field pr-12"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
              >
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </label>
          <button type="button" className="self-end text-sm font-semibold text-primary">
            Forgot password?
          </button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" className="btn-primary mt-2">Sign in</button>
        </form>

        <p className="relative mt-auto pt-10 text-center text-sm text-muted-foreground">
          New here? <button className="font-semibold text-primary">Create an account</button>
        </p>
      </div>
    </main>
  );
}
