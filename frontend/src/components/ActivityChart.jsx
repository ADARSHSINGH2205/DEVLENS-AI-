import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

const clampPercent = (value, max) => Math.max(0, Math.min(Math.round((value / max) * 100), 100));

function ActivityChart({ github = {}, leetcode = {}, linkedin = null }) {
  const linkedinSignal = linkedin ? Math.min(Math.round(((linkedin.availableFields?.length || 0) / 5) * 100), 100) : null;
  const data = [
    { name: "GitHub depth", current: clampPercent(github.repos || 0, 30), target: 70 },
    { name: "Open-source trust", current: clampPercent(github.stars || 0, 120), target: 70 },
    { name: "DSA basics", current: clampPercent(leetcode.easySolved || 0, 200), target: 70 },
    { name: "Interview depth", current: clampPercent(leetcode.mediumSolved || 0, 180), target: 70 },
    { name: "Advanced DSA", current: clampPercent(leetcode.hardSolved || 0, 60), target: 70 },
    ...(linkedinSignal !== null ? [{ name: "LinkedIn visibility", current: linkedinSignal, target: 70 }] : []),
  ];

  return (
    <motion.section
      className="card analyticsCard"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
    >
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">Signal comparison</span>
          <h2>Easy benchmark view</h2>
        </div>
        <p>Your current signals are shown next to a simple 70% target so the chart is easier to read at a glance.</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#9fb0c2", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-16}
            textAnchor="end"
            height={74}
          />
          <YAxis
            tick={{ fill: "#9fb0c2", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(value, name) => [
              `${value}%`,
              name === "current" ? "Your profile" : "Target",
            ]}
            contentStyle={{ background: "#101827", border: "1px solid rgba(255,255,255,0.12)" }}
          />
          <Legend wrapperStyle={{ color: "#c8d3e1" }} />
          <Bar dataKey="current" name="Your profile" fill="#19d3c5" radius={[8, 8, 0, 0]} />
          <Bar dataKey="target" name="Target" fill="#f59e0b" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.section>
  );
}

export default ActivityChart;
