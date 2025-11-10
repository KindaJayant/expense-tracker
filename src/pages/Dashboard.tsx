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
    // run async login fetch in inner function (React-safe)
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      if (sub?.subscription) sub.subscription.unsubscribe();
    };
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
        {
          event: "*",
          schema: "public",
          table: "expenses",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const evt = payload.eventType;
          const row: any = payload.new ?? payload.old;

          if (evt === "INSERT") {
            if (inMonth(row.date, filterMonth)) {
              setExpenses((p) => {
                if (p.some((x) => x.id === row.id)) return p;
                return [{ ...row } as Expense, ...p];
              });
            }
          } else if (evt === "UPDATE") {
            reloadMonth(); // simple safe refetch
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

  // --- optimistic mutations
  async function add(e: Expense) {
    if (!userId) return;
    setExpenses((p) => [e, ...p]);
    try {
      await insertExpense(userId, e);
    } catch {
      setExpenses((p) => p.filter((x) => x.id !== e.id));
      alert("❌ Failed to save to cloud.");
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
      alert("❌ Failed to delete from cloud.");
    }
  }

  const monthItems = useMemo(
    () => expenses.filter((e) => inMonth(e.date, filterMonth)),
    [expenses, filterMonth]
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-3 sm:px-4 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left w-full sm:w-auto">
          Expense Dashboard
        </h2>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <label className="text-sm text-textMuted hidden sm:block">Month</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="input w-full sm:w-auto px-3 py-2 text-sm rounded-lg border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <SummaryCards expenses={monthItems} />
      </div>

      {/* Add expense */}
      <div className="card p-4 sm:p-6 neon">
        <ExpenseForm onAdd={add} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="card p-4 sm:p-6 neon h-[280px] sm:h-[400px]">
          <CategoryPieChart expenses={monthItems} />
        </div>
        <div className="card p-4 sm:p-6 neon h-[280px] sm:h-[400px]">
          <TrendLineChart expenses={monthItems} />
        </div>
      </div>

      {/* Expense Table */}
      <div className="card p-3 sm:p-5 overflow-x-auto rounded-xl neon">
        <ExpenseTable items={monthItems} onDelete={del} />
      </div>

      {monthItems.length === 0 && !loading && (
        <div className="card p-4 neon text-center text-sm text-textMuted">
          No entries yet for this month.
        </div>
      )}
    </main>
  );
}
