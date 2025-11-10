// src/services/expRepo.ts
import { supabase } from "../lib/supabase";
import type { Expense } from "../utils/storage";

/** Fetch YYYY-MM expenses for a user, newest first */
export async function listByMonth(userId: string, ym: string): Promise<Expense[]> {
  // If your DB `date` column is timestamptz, filter by the prefix on ISO in JS or use SQL range.
  const from = new Date(`${ym}-01T00:00:00.000Z`);
  const to = new Date(new Date(from).setMonth(from.getMonth() + 1)); // next month

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .gte("date", from.toISOString())
    .lt("date", to.toISOString())
    .order("date", { ascending: false });

  if (error) throw error;

  // Cast DB row → client Expense shape (ensure ISO string)
  return (data ?? []).map((r: any) => ({
    id: r.id,
    date: typeof r.date === "string" ? r.date : new Date(r.date).toISOString(),
    category: r.category,
    amount: Number(r.amount),
    notes: r.notes ?? "",
    payment: r.payment as Expense["payment"],
  }));
}

/** Insert a single expense for a user */
export async function insertExpense(userId: string, e: Expense): Promise<void> {
  const row = {
    id: e.id,
    user_id: userId,
    date: new Date(e.date).toISOString(),
    category: e.category,
    amount: e.amount,
    notes: e.notes ?? "",
    payment: e.payment,
  };

  const { error } = await supabase.from("expenses").insert(row);
  if (error) throw error;
}

/** Delete by id scoped to user */
export async function deleteExpense(userId: string, id: string): Promise<void> {
  const { error } = await supabase.from("expenses").delete().eq("user_id", userId).eq("id", id);
  if (error) throw error;
}
