import { motion } from "framer-motion";

function SearchForm({
  github,
  setGithub,
  leetcode,
  setLeetcode,
  linkedin,
  setLinkedin,
  analyze,
  loading,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    analyze();
  };

  return (
    <motion.form
      className="searchContainer"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
    >
      <label>
        <span>GitHub</span>
        <input
          type="text"
          placeholder="torvalds"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          autoComplete="off"
        />
      </label>

      <label>
        <span>LeetCode</span>
        <input
          type="text"
          placeholder="leetcode_user"
          value={leetcode}
          onChange={(e) => setLeetcode(e.target.value)}
          autoComplete="off"
        />
      </label>

      <label>
        <span>LinkedIn optional</span>
        <input
          type="text"
          placeholder="linkedin.com/in/username"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          autoComplete="off"
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Analyzing" : "Analyze profile"}
      </button>
    </motion.form>
  );
}

export default SearchForm;
