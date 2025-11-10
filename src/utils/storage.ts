export type Category =
  | "Gym"
  | "Supplements"
  | "Skincare"
  | "Food"
  | "Commute"
  | "Fun"
  | "Savings"
  | "Misc";

export type Payment = "Cash" | "UPI" | "Card";

export interface Expense {
  id: string;
  date: string;       // ISO
  category: Category;
  amount: number;
  notes?: string;
  payment: Payment;
}

const KEY = "zenith-expenses-v1";

export function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Expense[]) : [];
  } catch {
    return [];
  }
}

export function saveExpenses(list: Expense[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
