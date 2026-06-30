import { motion } from "framer-motion";

function ScoreCard({ github, leetcode, score = 0 }) {
  const safeScore = Math.max(0, Math.min(Number(score) || 0, 100));
  const roundedScore = Math.round(safeScore);
  const circumference = 2 * Math.PI * 92;
  const offset = circumference - (safeScore / 100) * circumference;

  const signal = safeScore >= 75 ? "Interview-ready signal" : safeScore >= 45 ? "Developing candidate signal" : "Early-stage profile";
  const totalSolved = leetcode?.totalSolved || 0;
  const repos = github?.repos || 0;
  const stars = github?.stars || 0;

  return (
    <motion.div
      className="scorePanel"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="scoreCopy">
        <span className="eyebrow">Developer intelligence</span>
        <h2>Profile readiness score</h2>
        <p>
          A balanced indicator of GitHub depth, LeetCode strength, and overall
          interview readiness.
        </p>

        <div className="scoreMeta">
          <span>{signal}</span>
          <span>{repos} repos</span>
          <span>{totalSolved} solved</span>
          <span>{stars} stars</span>
        </div>
      </div>

      <div className="scoreGaugeWrap" aria-label={`Developer score ${roundedScore} out of 100`}>
        <svg className="scoreGauge" viewBox="0 0 220 220" role="img">
          <circle className="gaugeTrack" cx="110" cy="110" r="92" />
          <motion.circle
            className="gaugeValue"
            cx="110"
            cy="110"
            r="92"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>
        <div className="scoreValue">
          <strong>{roundedScore}</strong>
          <span>/100</span>
        </div>
      </div>
    </motion.div>
  );
}

export default ScoreCard;
