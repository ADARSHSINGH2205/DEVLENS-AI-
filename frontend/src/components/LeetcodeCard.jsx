import { motion } from "framer-motion";
import StatCard from "./StatCard";

function LeetcodeCard({ data }) {
  if (!data) return null;

  const total = data.totalSolved || 0;
  const easyPercent = total ? Math.round(((data.easySolved || 0) / total) * 100) : 0;
  const mediumPercent = total ? Math.round(((data.mediumSolved || 0) / total) * 100) : 0;
  const hardPercent = total ? Math.round(((data.hardSolved || 0) / total) * 100) : 0;
  const displayName = data.realName || data.username || "LeetCode";
  const badges = data.badges?.slice(0, 4) || [];
  const skills = data.skillTags?.slice(0, 8) || [];
  const recentSubmissions = data.recentSubmissions?.slice(0, 4) || [];

  return (
    <motion.section
      className="card profileCard"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 }}
    >
      <div className="profileHeader">
        {data.avatar ? (
          <img src={data.avatar} alt={`${data.username} LeetCode avatar`} />
        ) : (
          <div className="avatarFallback">LC</div>
        )}
        <div>
          <span className="eyebrow">LeetCode profile</span>
          <h2>{displayName}</h2>
          <p>{data.aboutMe || "Interview preparation strength and algorithmic depth."}</p>
        </div>
      </div>

      <div className="statGrid">
        <StatCard label="DSA consistency" value={total} detail="accepted solutions" tone="cyan" />
        <StatCard label="Core fundamentals" value={data.easySolved} detail={`${easyPercent}% of solved`} tone="green" />
        <StatCard label="Interview level" value={data.mediumSolved} detail={`${mediumPercent}% of solved`} tone="amber" />
        <StatCard label="Advanced depth" value={data.hardSolved} detail={`${hardPercent}% of solved`} tone="rose" />
        <StatCard label="Contest rating" value={data.contestRating || 0} detail={`${data.contestsAttended || 0} contests`} tone="violet" />
        <StatCard label="Global rank" value={data.ranking || "N/A"} detail="LeetCode ranking" tone="blue" />
      </div>

      <div className="difficultyBars">
        <span style={{ width: `${easyPercent}%` }} className="easyBar" />
        <span style={{ width: `${mediumPercent}%` }} className="mediumBar" />
        <span style={{ width: `${hardPercent}%` }} className="hardBar" />
      </div>

      <div className="profileMeta">
        {data.school && <span>{data.school}</span>}
        {data.company && <span>{data.company}</span>}
        {data.country && <span>{data.country}</span>}
        {data.reputation !== undefined && <span>{data.reputation} reputation</span>}
      </div>

      {!!skills.length && (
        <div className="miniBlock">
          <h3>Tagged strengths</h3>
          <div className="skillTags compactTags">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {!!badges.length && (
        <div className="miniBlock">
          <h3>Badges</h3>
          <div className="activityPills">
            {badges.map((badge) => (
              <span key={badge.id || badge.displayName}>{badge.displayName}</span>
            ))}
          </div>
        </div>
      )}

      {!!recentSubmissions.length && (
        <div className="miniBlock">
          <h3>Recent submissions</h3>
          <div className="repoList">
            {recentSubmissions.map((submission) => (
              <span key={`${submission.titleSlug}-${submission.timestamp}`}>
                <strong>{submission.title}</strong>
                <span>{submission.lang} · {submission.statusDisplay}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}

export default LeetcodeCard;
