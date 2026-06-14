import { motion } from "framer-motion";

function HeroSection() {
  return (
    <section className="hero">
      <motion.div
        className="heroVisual"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      />

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        DevLens AI
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.12 }}
      >
        Analyze GitHub traction, LeetCode depth, language breadth, and AI
        career signals in one focused dashboard.
      </motion.p>
    </section>
  );
}

export default HeroSection;
