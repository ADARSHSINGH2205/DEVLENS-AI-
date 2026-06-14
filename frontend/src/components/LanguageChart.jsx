import {
  Cell,
  Legend,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#19d3c5", "#f59e0b", "#ef476f", "#8b5cf6", "#46a0ff", "#6ee7b7", "#f97316"];

function LanguageChart({ languages }) {
  const data = Object.entries(languages).map(([name, value]) => ({
    name,
    value,
  }));

  if (!data.length) {
    return (
      <section className="card analyticsCard emptyState">
        <span className="eyebrow">Repository languages</span>
        <h2>Languages used</h2>
        <p>No language data came back from GitHub for this profile yet.</p>
      </section>
    );
  }

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
          <span className="eyebrow">Repository languages</span>
          <h2>Languages used</h2>
        </div>
        <p>Counted from public repositories returned by the backend.</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={72}
            outerRadius={116}
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "#101827", border: "1px solid rgba(255,255,255,0.12)" }} />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </motion.section>
  );
}

export default LanguageChart;
