import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

const clamp = (value, max) => Math.max(0, Math.min(Math.round((value / max) * 100), 100));

function SkillRadar({ github = {}, leetcode = {}, linkedin = null, score = 0 }) {
  const languageCount = Object.keys(github.languages || {}).length;
  const linkedinSkillCount = linkedin?.skills?.length || 0;
  const data = [
    { skill: "Portfolio depth", value: clamp(github.repos || 0, 60) },
    { skill: "Public credibility", value: clamp((github.followers || 0) + (github.stars || 0), 250) },
    { skill: "DSA consistency", value: clamp(leetcode.totalSolved || 0, 600) },
    { skill: "Advanced DSA", value: clamp(leetcode.hardSolved || 0, 120) },
    { skill: "Tech breadth", value: clamp(languageCount, 8) },
    {
      skill: linkedin ? "Career branding" : "Overall readiness",
      value: linkedin ? clamp(linkedinSkillCount, 10) : Math.round(score || 0),
    },
  ];

  return (
    <motion.section
      className="card analyticsCard radarSection"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
    >
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">Capability map</span>
          <h2>Developer strength radar</h2>
        </div>
        <p>Normalized view of portfolio depth, DSA strength, public credibility, and career branding.</p>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={data} outerRadius="74%">
          <PolarGrid stroke="rgba(255,255,255,0.12)" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: "#c8d3e1", fontSize: 12 }} />
          <Radar
            dataKey="value"
            stroke="#19d3c5"
            fill="#19d3c5"
            fillOpacity={0.34}
            strokeWidth={3}
          />
          <Tooltip contentStyle={{ background: "#101827", border: "1px solid rgba(255,255,255,0.12)" }} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.section>
  );
}

export default SkillRadar;
