import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import type { Expense } from "../utils/storage";

export default function TrendLineChart({ expenses }: { expenses: Expense[] }) {
  const data = useMemo(()=>{
    const by: Record<string, number> = {};
    for (const e of expenses) {
      const d = new Date(e.date).toISOString().slice(0,10);
      by[d] = (by[d]||0)+e.amount;
    }
    return Object.entries(by).sort(([a],[b])=>a.localeCompare(b))
      .map(([date,value])=>({ date: new Date(date).toLocaleDateString(), value }));
  },[expenses]);

  return (
    <motion.div
      className="card neon p-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35, delay: .05 }}
    >
      <div className="text-sm text-textMuted mb-2">Daily Spend Trend</div>
      <div className="h-64">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeOpacity={0.12} />
              <XAxis dataKey="date" interval="preserveStartEnd" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" dot={false} stroke="#2CC295" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full grid place-items-center text-textMuted text-sm">No trend yet — add expenses.</div>
        )}
      </div>
    </motion.div>
  );
}
