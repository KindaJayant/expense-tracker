import { motion } from "framer-motion";

export default function ProgressRing({
  size = 96,
  stroke = 10,
  percent,
  label,
}: {
  size?: number;
  stroke?: number;
  percent: number; // 0..100
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = Math.PI * 2 * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const dash = (clamped / 100) * c;

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="drop-shadow">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#2CC295"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${dash} ${c - dash}` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          style={{ filter: "drop-shadow(0 0 10px rgba(44,194,149,.45))" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-lg font-semibold">{Math.round(clamped)}%</div>
          {label && <div className="text-[10px] text-textMuted">{label}</div>}
        </div>
      </div>
    </div>
  );
}
