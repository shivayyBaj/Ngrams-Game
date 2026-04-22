import { motion } from "framer-motion";
import "./Keyboard.css";

const ROWS = [
  "qwertyuiop".split(""),
  "asdfghjkl".split(""),
  "zxcvbnm".split(""),
];

export default function Keyboard({
  guessedLetters,
  correctLetters,
  hintedLetter,
  disabled,
  onGuess,
}) {
  const getKeyClass = (char) => {
    if (correctLetters.has(char)) return "key correct";
    if (guessedLetters.has(char)) return "key wrong";
    if (hintedLetter === char) return "key hinted";
    return "key";
  };

  return (
    <div className="keyboard">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="keyboard-row">
          {row.map((char) => {
            const isUsed = guessedLetters.has(char);
            return (
              <motion.button
                key={char}
                className={getKeyClass(char)}
                disabled={isUsed || disabled}
                onClick={() => onGuess(char)}
                whileHover={!isUsed && !disabled ? { scale: 1.12, y: -3 } : {}}
                whileTap={!isUsed && !disabled ? { scale: 0.92 } : {}}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: rowIdx * 0.05 + ROWS[rowIdx].indexOf(char) * 0.02,
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                }}
              >
                {char}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
