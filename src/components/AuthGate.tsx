import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  const loc = useLocation();
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (checking) return;
    if (!userId) {
      // go to /auth and remember where we came from
      const qp = new URLSearchParams({ next: loc.pathname });
      nav(`/auth?${qp.toString()}`, { replace: true });
    }
  }, [checking, userId, nav, loc.pathname]);

  async function signOut() {
    await supabase.auth.signOut();
    nav("/auth", { replace: true });
  }

  if (checking || !userId) {
    return (
      <div className="min-h-[40vh] grid place-items-center text-textMuted">
        Checking session…
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-4 flex justify-end">
        <button onClick={signOut} className="btn-ghost text-sm">Sign out</button>
      </div>
      {children}
    </>
  );
}
