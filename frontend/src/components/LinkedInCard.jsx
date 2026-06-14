import { motion } from "framer-motion";
import StatCard from "./StatCard";

function LinkedInCard({ data }) {
  if (!data) return null;

  const skillCount = data.skills?.length || 0;
  const availableFields = data.availableFields || [];

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
        <StatCard label="Public fields" value={availableFields.length || 1} detail="visible profile details" tone="blue" />
        <StatCard label="Listed skills" value={skillCount || "N/A"} detail="only if public/API provided" tone="violet" />
        <StatCard label="Location" value={data.location || "N/A"} detail="public location" tone="green" />
        <StatCard label="Profile status" value={data.statusCode || "N/A"} detail="fetch response" tone="cyan" />
      </div>

      <div className="profileMeta">
        {data.publicUrl && <span>{data.publicUrl}</span>}
        {data.description && <span>{data.description}</span>}
      </div>

      {!!skillCount && (
        <div className="skillTags">
          {data.skills.slice(0, 8).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      )}

      {data.visibilityNote && (
        <p className="visibilityNote">{data.visibilityNote}</p>
      )}
    </motion.section>
  );
}

export default LinkedInCard;
