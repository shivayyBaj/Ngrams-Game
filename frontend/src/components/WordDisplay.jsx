import { motion, AnimatePresence } from "framer-motion";
import "./WordDisplay.css";

export default function WordDisplay({ maskedWord, status, actualWord }) {
  const displayWord = status !== "playing" && actualWord ? actualWord : maskedWord;
  const letters = displayWord ? displayWord.split("") : [];

  return (
    <div className="word-display">
      <AnimatePresence mode="popLayout">
        {letters.map((char, idx) => (
          <motion.div
            key={`${idx}-${char}`}
            className={`letter-cell ${char !== "_" ? "revealed" : "blank"} ${
              status === "won" ? "won" : ""
            } ${status === "lost" && char !== "_" ? "lost-reveal" : ""}`}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
              delay: idx * 0.03,
            }}
            layout
          >
            <span className="letter-char">
              {char !== "_" ? char : ""}
            </span>
            <div className="letter-underline" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
