// src/pages/Dashboard.tsx
import { useEffect, useMemo, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";
import SummaryCards from "../components/SummaryCards";
import CategoryPieChart from "../components/CategoryPieChart";
import TrendLineChart from "../components/TrendLineChart";
import type { Expense } from "../utils/storage";
import { listByMonth, insertExpense, deleteExpense } from "../services/expRepo";
import { supabase } from "../lib/supabase";

function inMonth(iso: string, ym: string) {
  return iso.startsWith(ym);
}

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const [filterMonth, setFilterMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  // --- auth → userId
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // --- fetch current month from cloud (source of truth)
  async function reloadMonth() {
    if (!userId) return;
    setLoading(true);
    try {
      const rows = await listByMonth(userId, filterMonth);
      setExpenses(rows);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userId) return;
    reloadMonth();
  }, [userId, filterMonth]);

  // --- realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`exp-realtime-${userId}-${filterMonth}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expenses", filter: `user_id=eq.${userId}` },
        (payload) => {
          const evt = payload.eventType;
          const row: any = payload.new ?? payload.old;

          if (evt === "INSERT") {
            if (inMonth(row.date, filterMonth)) {
              setExpenses((p) => {
                // de-dupe if optimistic insert already present
                if (p.some((x) => x.id === row.id)) return p;
                return [{ ...row } as Expense, ...p];
              });
            }
          } else if (evt === "UPDATE") {
            // simplest + safest: refetch (handles month boundary moves)
            reloadMonth();
          } else if (evt === "DELETE") {
            setExpenses((p) => p.filter((x) => x.id !== row.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, filterMonth]);

  // --- mutations (optimistic)
  async function add(e: Expense) {
    if (!userId) return;
    setExpenses((p) => [e, ...p]); // optimistic
    try {
      await insertExpense(userId, e);
    } catch {
      setExpenses((p) => p.filter((x) => x.id !== e.id)); // rollback
      alert("Failed to save to cloud.");
    }
  }

  async function del(id: string) {
    if (!userId) return;
    const prev = expenses;
    setExpenses((p) => p.filter((x) => x.id !== id));
    try {
      await deleteExpense(userId, id);
    } catch {
      setExpenses(prev);
      alert("Failed to delete from cloud.");
    }
  }

  const monthItems = useMemo(
    () => expenses.filter((e) => inMonth(e.date, filterMonth)),
    [expenses, filterMonth]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-2xl font-bold">Expense Dashboard</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-textMuted">Month</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="input px-3 py-2"
          />
        </div>
      </div>

      <SummaryCards expenses={monthItems} />

      {monthItems.length === 0 && !loading && (
        <div className="card p-4 neon">
          <p className="text-sm text-textMuted">No entries yet for this month.</p>
        </div>
      )}

      <ExpenseForm onAdd={add} />

      <div className="grid lg:grid-cols-2 gap-4">
        <CategoryPieChart expenses={monthItems} />
        <TrendLineChart expenses={monthItems} />
      </div>

      <ExpenseTable items={monthItems} onDelete={del} />
    </main>
  );
}
