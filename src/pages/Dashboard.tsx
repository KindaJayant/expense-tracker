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
    <main className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-8 page-gap">
  {/* ... */}
  <div className="grid grid-cols-1 sm:grid-cols-3 grid-gap">
    <SummaryCards expenses={monthItems} />
  </div>

  <div className="card neon">
    <ExpenseForm onAdd={add} />
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 grid-gap">
    <div className="card neon h-[280px] sm:h-[400px]">
      <CategoryPieChart expenses={monthItems} />
    </div>
    <div className="card neon h-[280px] sm:h-[400px]">
      <TrendLineChart expenses={monthItems} />
    </div>
  </div>

  <div className="card neon overflow-x-auto">
    <ExpenseTable items={monthItems} onDelete={del} />
  </div>
</main>
  );
}
