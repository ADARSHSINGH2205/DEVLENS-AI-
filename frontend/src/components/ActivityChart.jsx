import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

function ActivityChart({ github = {}, leetcode = {}, linkedin = null }) {
  const linkedinSkillCount = linkedin?.skills?.length || 0;
  const data = [
    { name: "Project depth", value: github.repos || 0, benchmark: 25 },
    { name: "Open-source trust", value: github.stars || 0, benchmark: 40 },
    { name: "Developer reach", value: github.followers || 0, benchmark: 50 },
    { name: "Core DSA base", value: leetcode.easySolved || 0, benchmark: 150 },
    { name: "Interview readiness", value: leetcode.mediumSolved || 0, benchmark: 180 },
    { name: "Advanced problem depth", value: leetcode.hardSolved || 0, benchmark: 55 },
    ...(linkedin ? [{ name: "Career keywords", value: linkedinSkillCount, benchmark: 8 }] : []),
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
          <h2>Readiness benchmark</h2>
        </div>
        <p>Important career signals compared with practical early-career targets.</p>
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
            angle={-18}
            textAnchor="end"
            height={72}
          />
          <YAxis tick={{ fill: "#9fb0c2", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#101827", border: "1px solid rgba(255,255,255,0.12)" }} />
          <Bar dataKey="value" fill="#19d3c5" radius={[8, 8, 0, 0]} />
          <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" strokeWidth={3} dot={false} />
        </BarChart>
      </ResponsiveContainer>
    </motion.section>
  );
}

export default ActivityChart;
