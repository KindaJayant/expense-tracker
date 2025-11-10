import type { Expense } from "../utils/storage";
import ProgressRing from "./ProgressRing";

export default function SummaryCards({
  expenses,
  income = 15000,
}: {
  expenses: Expense[];
  income?: number;
}) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const saved = Math.max(income - total, 0);
  const pct = Math.min((total / income) * 100, 100);

  const Card = ({
    title, value, sub, children
  }: {
    title: string; value: string; sub?: string; children?: React.ReactNode;
  }) => (
    <div className="card p-5 neon flex items-center gap-4">
      {children}
      <div>
        <div className="text-sm text-textMuted">{title}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
        {sub && <div className="text-xs text-textMuted mt-1">{sub}</div>}
      </div>
    </div>
  );

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <Card title="Income" value={`₹${income.toLocaleString("en-IN")}`} />
      <Card
        title="Spent"
        value={`₹${total.toLocaleString("en-IN")}`}
        sub={`${pct.toFixed(0)}% of income`}
      >
        <ProgressRing size={68} stroke={8} percent={pct} />
      </Card>
      <Card title="Saving (est.)" value={`₹${saved.toLocaleString("en-IN")}`} />
    </div>
  );
}
