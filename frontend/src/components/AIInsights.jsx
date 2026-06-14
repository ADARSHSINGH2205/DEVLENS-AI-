import { motion } from "framer-motion";

function AIInsights({ insights }) {
  if (!insights) return null;

  let normalized = insights;

  if (typeof insights === "string") {
    try {
      normalized = JSON.parse(insights);
    } catch {
      normalized = {
        summary: insights,
        strengths: [],
        weakAreas: [],
        questionAbility: "",
        platformRead: [],
        nextActions: [],
      };
    }
  }

  const strengths = normalized.strengths || [];
  const weakAreas = normalized.weakAreas || [];
  const platformRead = normalized.platformRead || [];
  const nextActions = normalized.nextActions || [];

  return (
    <motion.section
      className="card aiInsights"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
    >
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">Gemini analysis</span>
          <h2>AI insight</h2>
        </div>
        <p>Short, evidence-based read of strengths, gaps, question ability, and next moves.</p>
      </div>

      <div className="insightSummary">{normalized.summary}</div>

      {normalized.questionAbility && (
        <div className="questionAbility">
          <h3>Question ability</h3>
          <p>{normalized.questionAbility}</p>
        </div>
      )}

      <div className="insightGrid">
        <InsightGroup title="Strong areas" items={strengths} />
        <InsightGroup title="Weak areas" items={weakAreas} />
        <InsightGroup
          title="Platform read"
          items={platformRead.map((item) => `${item.platform}: ${item.insight}`)}
        />
        <InsightGroup title="Next actions" items={nextActions} />
      </div>
    </motion.section>
  );
}

function InsightGroup({ title, items }) {
  if (!items?.length) return null;

  return (
    <motion.div
      className="insightGroup"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </motion.div>
  );
}

export default AIInsights;
