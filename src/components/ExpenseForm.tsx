import { useState } from "react";
import type { Category, Expense, Payment } from "../utils/storage";
import FancySelect from "./FancySelect";

const CATEGORIES: Category[] = [
  "Gym","Supplements","Skincare","Food","Commute","Fun","Savings","Misc",
];
const PAYMENTS: Payment[] = ["Cash", "UPI", "Card"];

export default function ExpenseForm({ onAdd }: { onAdd: (e: Expense) => void }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<Category>("Food");
  const [amount, setAmount] = useState<number | "">("");
  const [payment, setPayment] = useState<Payment>("UPI");
  const [notes, setNotes] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const amt = typeof amount === "string" ? Number(amount) : amount;
    if (!amt || amt <= 0) return;
    const id =
      (globalThis as any).crypto?.randomUUID?.() ??
      Math.random().toString(36).slice(2);

    onAdd({
      id,
      date: new Date(date).toISOString(),
      category,
      amount: amt,
      payment,
      notes: notes.trim() || undefined,
    });
    setAmount("");
    setNotes("");
  }

  const input = "input px-3 py-2";
  const bigInput = "input px-3 py-2 sm:col-span-2";

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-6 gap-3 card p-4 neon">
      <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className={input} />

      <FancySelect
        value={category}
        onChange={(v)=>setCategory(v as Category)}
        options={CATEGORIES}
        className=""
      />

      <input
        type="number"
        min={1}
        placeholder="Amount"
        value={amount}
        onChange={(e)=>setAmount(e.target.value === "" ? "" : Number(e.target.value))}
        className={input}
      />

      <input
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e)=>setNotes(e.target.value)}
        className={bigInput}
      />

      <div className="flex gap-2">
        <FancySelect
          value={payment}
          onChange={(v)=>setPayment(v as Payment)}
          options={PAYMENTS}
          className="w-full"
        />
        <button type="submit" className="btn-accent">Add</button>
      </div>
    </form>
  );
}
