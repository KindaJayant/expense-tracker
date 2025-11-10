import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/", { replace: true });
    });
  }, [nav]);

async function signInGoogle() {
  setBusy(true);
  try {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // http://localhost:5173 during dev
      },
    });
  } finally {
    setBusy(false);
  }
}


  return (
    <main className="min-h-screen grid place-items-center text-white bg-bg">
      <div className="w-full max-w-md card neon p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent/15 grid place-items-center">
            <span className="text-accent font-bold">₹</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold leading-tight">Expense Tracker</h1>
            <p className="text-textMuted text-sm">Sign in to sync across devices.</p>
          </div>
        </div>

        <button
          onClick={signInGoogle}
          disabled={busy}
          className="btn-accent w-full disabled:opacity-60"
        >
          {busy ? "Opening Google…" : "Continue with Google"}
        </button>

        <div className="text-[11px] text-textMuted">
          Your data is private to your account and stored securely in Supabase.
        </div>
      </div>
    </main>
  );
}
