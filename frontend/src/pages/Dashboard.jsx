import { useState } from "react";
import { motion } from "framer-motion";

import api from "../api/api";
import ActivityChart from "../components/ActivityChart";
import AIInsights from "../components/AIInsights";
import Footer from "../components/Footer";
import GithubCard from "../components/GithubCard";
import HeroSection from "../components/HeroSection";
import LanguageChart from "../components/LanguageChart";
import LeetcodeCard from "../components/LeetcodeCard";
import LinkedInCard from "../components/LinkedInCard";
import LoadingScreen from "../components/LoadingScreen";
import NavBar from "../components/NavBar";
import ScoreCard from "../components/ScoreCard";
import SearchForm from "../components/SearchForm";
import SkillRadar from "../components/SkillRadar";

import "./Dashboard.css";

function Dashboard() {
  const [github, setGithub] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [savedUsersRefreshKey, setSavedUsersRefreshKey] = useState(0);

  const analyzeProfile = async () => {
    const githubUsername = github.trim();
    const leetcodeUsername = leetcode.trim();
    const linkedinInput = linkedin.trim();
    const linkedinUrl =
      linkedinInput && !/^https?:\/\//i.test(linkedinInput)
        ? `https://${linkedinInput}`
        : linkedinInput;

    if (!githubUsername || !leetcodeUsername) {
      setError("Enter both GitHub and LeetCode usernames to run the analysis.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/analyze", {
        params: {
          github_username: githubUsername,
          leetcode_username: leetcodeUsername,
          ...(linkedinUrl ? { linkedin_url: linkedinUrl } : {}),
        },
      });

      if (data?.error) {
        setResult(null);
        setError(data.error);
        return;
      }

      setResult(data);
      setSavedUsersRefreshKey((key) => key + 1);
    } catch (error) {
      console.error(error);
      setResult(null);
      setError("Analysis failed. The backend returned an error or the request was rejected. Please try again with valid GitHub/LeetCode usernames.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <NavBar refreshKey={savedUsersRefreshKey} />
      <HeroSection />

      <SearchForm
        github={github}
        setGithub={setGithub}
        leetcode={leetcode}
        setLeetcode={setLeetcode}
        linkedin={linkedin}
        setLinkedin={setLinkedin}
        analyze={analyzeProfile}
        loading={loading}
      />

      {error && <div className="inlineError">{error}</div>}
      {loading && <LoadingScreen />}

      {result && !loading && (
        <motion.div
          className="resultsSection"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <ScoreCard
            github={result.github}
            leetcode={result.leetcode}
            score={result.developer_score}
          />

          <div className="cardsGrid">
            <GithubCard data={result.github} />
            <LeetcodeCard data={result.leetcode} />
            {result.linkedin && <LinkedInCard data={result.linkedin} />}
          </div>

          <div className="analyticsGrid">
            <LanguageChart languages={result.github?.languages || {}} />
            <ActivityChart github={result.github} leetcode={result.leetcode} linkedin={result.linkedin} />
          </div>

          <SkillRadar
            github={result.github}
            leetcode={result.leetcode}
            linkedin={result.linkedin}
            score={result.developer_score}
          />
          <AIInsights insights={result.ai_analysis} />
        </motion.div>
      )}

      <Footer />
    </div>
  );
}

export default Dashboard;
