import { motion } from "framer-motion";
import "./HangmanDrawing.css";

const BODY_PARTS = [
  // Head
  <circle key="head" cx="140" cy="68" r="18" className="hm-part hm-head" />,
  // Body
  <line key="body" x1="140" y1="86" x2="140" y2="145" className="hm-part hm-body" />,
  // Left arm
  <line key="larm" x1="140" y1="100" x2="112" y2="128" className="hm-part hm-limb" />,
  // Right arm
  <line key="rarm" x1="140" y1="100" x2="168" y2="128" className="hm-part hm-limb" />,
  // Left leg
  <line key="lleg" x1="140" y1="145" x2="112" y2="185" className="hm-part hm-limb" />,
  // Right leg
  <line key="rleg" x1="140" y1="145" x2="168" y2="185" className="hm-part hm-limb" />,
];

export default function HangmanDrawing({ mistakes }) {
  return (
    <motion.div
      className="hangman-drawing"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg viewBox="0 0 220 230" className="hangman-svg">
        {/* Gallows */}
        <line x1="20" y1="220" x2="100" y2="220" className="hm-frame" />
        <line x1="60" y1="220" x2="60" y2="18" className="hm-frame" />
        <line x1="58" y1="20" x2="142" y2="20" className="hm-frame" />
        <line x1="140" y1="20" x2="140" y2="48" className="hm-rope" />

        {/* Body Parts */}
        {BODY_PARTS.slice(0, mistakes).map((part, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            {part}
          </motion.g>
        ))}

        {/* Dead face */}
        {mistakes >= 6 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <line x1="132" y1="63" x2="137" y2="68" className="hm-face" />
            <line x1="137" y1="63" x2="132" y2="68" className="hm-face" />
            <line x1="143" y1="63" x2="148" y2="68" className="hm-face" />
            <line x1="148" y1="63" x2="143" y2="68" className="hm-face" />
            <line x1="135" y1="77" x2="145" y2="77" className="hm-face" />
          </motion.g>
        )}
      </svg>

      {/* Danger glow overlay */}
      {mistakes >= 4 && (
        <motion.div
          className="danger-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: mistakes >= 5 ? 0.6 : 0.3 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
}
