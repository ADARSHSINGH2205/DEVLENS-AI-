import { motion } from "framer-motion";

function StatCard({ label, value, detail, tone = "cyan" }) {
  return (
    <motion.div
      className={`statCard ${tone}`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
      {detail && <small>{detail}</small>}
    </motion.div>
  );
}

export default StatCard;
