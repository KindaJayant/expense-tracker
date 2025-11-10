import { useMemo } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import type { Expense } from "../utils/storage";

const PALETTE = ["#22C55E","#14B8A6","#84CC16","#10B981","#06B6D4","#36D399","#65A30D","#2CC295"];
const CATEGORY_COLOR: Record<string, string> = {
  Food: PALETTE[0], Commute: PALETTE[1], Supplements: PALETTE[2], Gym: PALETTE[3],
  Skincare: PALETTE[4], Fun: PALETTE[5], Savings: PALETTE[6], Misc: PALETTE[7],
};
const SLICE_STROKE = "#0b1113";

export default function CategoryPieChart({ expenses }: { expenses: Expense[] }) {
  const data = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of expenses) m.set(e.category, (m.get(e.category) || 0) + e.amount);
    return Array.from(m, ([name, value]) => ({ name, value }));
  }, [expenses]);
  const total = data.reduce((s,d)=>s+d.value,0);

  return (
    <motion.div
      className="card neon p-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35 }}
    >
      <div className="text-sm text-textMuted mb-2">Spending by Category</div>

      <div className="h-64">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name"
                   innerRadius={62} outerRadius={92} paddingAngle={2} isAnimationActive>
                {data.map((d,i)=>(
                  <Cell key={d.name}
                        fill={CATEGORY_COLOR[d.name] ?? PALETTE[i % PALETTE.length]}
                        stroke={SLICE_STROKE} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip formatter={(v:number)=>[`₹${v.toLocaleString("en-IN")}`,"Amount"]} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full grid place-items-center text-textMuted text-sm">No data yet — add an expense.</div>
        )}
      </div>

      {data.length>0 && (
        <div className="mt-3 grid sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {data.map((d,i)=>{
            const color = CATEGORY_COLOR[d.name] ?? PALETTE[i%PALETTE.length];
            const pct = total ? Math.round((d.value/total)*100) : 0;
            return (
              <div key={d.name} className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm" style={{background:color}}/>
                <span className="text-textMuted">{d.name}</span>
                <span className="ml-auto">₹{d.value.toLocaleString("en-IN")} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
