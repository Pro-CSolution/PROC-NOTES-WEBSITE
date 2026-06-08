import { useState } from "react";
import { KeyRound, LogIn, Mail } from "lucide-react";
import { isAllowedEmail } from "../config/auth";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!isAllowedEmail(normalizedEmail)) {
      setError("This email is not authorized to access the tracker.");
      return;
    }

    setIsLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (signInError) {
      setError("The email or password is incorrect.");
    }

    setIsLoading(false);
  };

  return (
    <main className="relative z-10 mx-auto grid min-h-screen w-full max-w-md place-items-center px-4 py-10">
      <section className="modal-panel w-full rounded-[2rem] p-6 sm:p-8">
        <div className="brand-panel mb-6 flex min-h-28 items-center justify-center overflow-hidden rounded-2xl px-6 py-5">
          <img
            src="/proc-logo.png"
            alt="Pro-C Solution"
            className="h-20 w-auto max-w-full object-contain"
          />
        </div>

        <div className="mb-6 flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/8 text-cyan-200">
            <LogIn size={21} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Sign in to Tracker</h1>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Authorized Pro-C accounts only. Your work saves automatically.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-bold text-slate-200">
              Email Address
            </span>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                required
                autoFocus
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@procsolution.com"
                className="form-field pl-10"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-slate-200">
              Password
            </span>
            <div className="relative">
              <KeyRound
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                className="form-field pl-10"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="primary-button w-full rounded-xl px-5 py-3 text-sm font-bold disabled:cursor-wait disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-xl border border-rose-300/15 bg-rose-500/5 px-4 py-3 text-xs leading-5 text-rose-100">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
