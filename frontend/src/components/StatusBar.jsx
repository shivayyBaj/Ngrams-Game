import { motion } from "framer-motion";
import "./StatusBar.css";

export default function StatusBar({ mistakes, maxMistakes, score, status }) {
  const livesLeft = maxMistakes - mistakes;
  const pct = (livesLeft / maxMistakes) * 100;
  const barColor =
    pct <= 33
      ? "var(--accent-rose)"
      : pct <= 66
      ? "var(--accent-amber)"
      : "var(--accent-emerald)";

  return (
    <div className="status-bar">
      <div className="stat-group">
        <div className="stat-label">LIVES</div>
        <div className="stat-value lives-value">
          {Array.from({ length: maxMistakes }).map((_, i) => (
            <motion.span
              key={i}
              className={`heart ${i < livesLeft ? "alive" : "dead"}`}
              animate={i < livesLeft ? { scale: [1, 1.2, 1] } : { scale: 0.8, opacity: 0.25 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              {i < livesLeft ? "❤️" : "🖤"}
            </motion.span>
          ))}
        </div>
        <div className="lives-track">
          <motion.div
            className="lives-fill"
            animate={{ width: `${pct}%`, background: barColor }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        </div>
      </div>

      <div className="stat-group center">
        <div className="stat-label">STATUS</div>
        <motion.div
          className={`stat-badge ${status}`}
          key={status}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {status === "playing"
            ? "🎯 In Progress"
            : status === "won"
            ? "🏆 Victory!"
            : "💀 Defeated"}
        </motion.div>
      </div>

      <div className="stat-group right">
        <div className="stat-label">SCORE</div>
        <motion.div
          className="stat-value score"
          key={score}
          initial={{ scale: 1.4, color: "var(--accent-cyan)" }}
          animate={{ scale: 1, color: "var(--text-primary)" }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {score}
        </motion.div>
      </div>
    </div>
  );
}
