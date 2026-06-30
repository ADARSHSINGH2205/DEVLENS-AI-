import { motion } from "framer-motion";
import StatCard from "./StatCard";

function LinkedInCard({ data }) {
  if (!data) return null;

  const availableFields = data.availableFields || [];
  const publicFieldCount = availableFields.length;
  const visibilityScore = Math.min(Math.round((publicFieldCount / 10) * 100), 100);
  const statusLabel =
    Number(data.statusCode) >= 200 && Number(data.statusCode) < 300
      ? "Profile check passed"
      : "Profile check limited";

  return (
    <motion.section
      className="card profileCard linkedInCard"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.14 }}
    >
      <div className="profileHeader">
        {data.profilePicture ? (
          <img src={data.profilePicture} alt={`${data.name || "LinkedIn"} profile`} />
        ) : (
          <div className="avatarFallback linkedInAvatar">IN</div>
        )}
        <div>
          <span className="eyebrow">LinkedIn profile</span>
          <h2>{data.name || "Career profile"}</h2>
          <p>{data.headline || data.description || "Professional positioning and public profile signal."}</p>
        </div>
      </div>

      <div className="statGrid">
        <StatCard label="Checkup" value={statusLabel} detail="lookup response" tone="cyan" />
        <StatCard label="Public signals" value={publicFieldCount || 0} detail="visible fields found" tone="blue" />
        <StatCard label="Visibility" value={`${visibilityScore}%`} detail="public profile coverage" tone="violet" />
        <StatCard label="Location" value={data.location || "N/A"} detail="public location" tone="green" />
      </div>

      <div className="profileMeta">
        {data.publicUrl && <span>{data.publicUrl}</span>}
        {data.siteName && <span>{data.siteName}</span>}
        {data.title && <span>{data.title}</span>}
        {data.summary && <span>{data.summary}</span>}
      </div>

      <div className="miniBlock">
        <h3>Public profile fields</h3>
        <div className="skillTags compactTags">
          {availableFields.length ? (
            availableFields.map((field) => <span key={field}>{field}</span>)
          ) : (
            <span>No public fields captured</span>
          )}
        </div>
      </div>

      {data.visibilityNote && (
        <p className="visibilityNote">{data.visibilityNote}</p>
      )}
    </motion.section>
  );
}

export default LinkedInCard;
