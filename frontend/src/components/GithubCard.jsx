import { motion } from "framer-motion";
import StatCard from "./StatCard";

function GithubCard({ data }) {
  if (!data) return null;

  const displayName = data.name || data.username || "GitHub";
  const languages = Object.entries(data.languageBytes || data.languages || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const topRepos = data.topRepositories?.slice(0, 3) || [];
  const recentActivity = data.recentActivity?.slice(0, 3) || [];

  return (
    <motion.section
      className="card profileCard"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="profileHeader">
        {data.avatar && <img src={data.avatar} alt={`${data.username} GitHub avatar`} />}
        <div>
          <span className="eyebrow">GitHub profile</span>
          <h2>{displayName}</h2>
          <p>{data.bio || "Portfolio depth, public credibility, and technical breadth."}</p>
        </div>
      </div>

      <div className="statGrid">
        <StatCard label="Project depth" value={data.repos} detail="public repositories" tone="cyan" />
        <StatCard label="Open-source trust" value={data.stars} detail="total stars earned" tone="amber" />
        <StatCard label="Developer reach" value={data.followers} detail="followers" tone="violet" />
        <StatCard label="Fork signal" value={data.forks || 0} detail="repo forks" tone="green" />
      </div>

      <div className="profileMeta">
        {data.location && <span>{data.location}</span>}
        {data.company && <span>{data.company}</span>}
        {data.blog && <span>{data.blog}</span>}
        {data.createdAt && <span>Joined {new Date(data.createdAt).getFullYear()}</span>}
      </div>

      {!!languages.length && (
        <div className="miniBlock">
          <h3>Top languages</h3>
          <div className="skillTags compactTags">
            {languages.map(([language]) => (
              <span key={language}>{language}</span>
            ))}
          </div>
        </div>
      )}

      {!!topRepos.length && (
        <div className="miniBlock">
          <h3>Best repositories</h3>
          <div className="repoList">
            {topRepos.map((repo) => (
              <a key={repo.fullName || repo.name} href={repo.url} target="_blank" rel="noreferrer">
                <strong>{repo.name}</strong>
                <span>{repo.language || "Mixed"} · {repo.stars} stars · {repo.forks} forks</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {!!recentActivity.length && (
        <div className="miniBlock">
          <h3>Recent activity</h3>
          <div className="activityPills">
            {recentActivity.map((event, index) => (
              <span key={`${event.repo}-${event.createdAt}-${index}`}>
                {event.type?.replace("Event", "") || "Activity"} · {event.repo}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}

export default GithubCard;
