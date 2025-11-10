import type { Expense } from "../utils/storage";

export default function ExpenseTable({ items, onDelete }: { items: Expense[]; onDelete: (id: string)=>void; }) {
  return (
    <div className="rounded-2xl bg-card/70 border border-white/5 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-muted">
          <tr>
            <th className="text-left p-3">Date</th>
            <th className="text-left p-3">Category</th>
            <th className="text-right p-3">Amount</th>
            <th className="text-left p-3">Payment</th>
            <th className="text-left p-3">Notes</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {items.map(e=>(
            <tr key={e.id} className="border-t border-white/5 hover:bg-white/[.03]">
              <td className="p-3">{new Date(e.date).toLocaleDateString()}</td>
              <td className="p-3">{e.category}</td>
              <td className="p-3 text-right">₹{e.amount.toLocaleString("en-IN")}</td>
              <td className="p-3">{e.payment}</td>
              <td className="p-3">{e.notes || "-"}</td>
              <td className="p-3 text-right">
                <button onClick={()=>onDelete(e.id)} className="text-muted hover:text-accent">Delete</button>
              </td>
            </tr>
          ))}
          {!items.length && (
            <tr><td colSpan={6} className="p-6 text-center text-muted">No expenses yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
