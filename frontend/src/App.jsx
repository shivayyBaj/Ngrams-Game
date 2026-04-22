import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HangmanDrawing from "./components/HangmanDrawing";
import WordDisplay from "./components/WordDisplay";
import Keyboard from "./components/Keyboard";
import StatusBar from "./components/StatusBar";
import Confetti from "./components/Confetti";
import { apiStartGame, apiGuess, apiAiMove } from "./api";
import { playCorrect, playWrong, playWin, playLose, playClick, playHint } from "./sounds";
import "./App.css";

const INITIAL_STATE = {
  masked_word: "",
  guessed_letters: [],
  mistakes: 0,
  max_mistakes: 6,
  status: "idle",
  actual_word: null,
};

export default function App() {
  const [game, setGame] = useState(INITIAL_STATE);
  const [correctLetters, setCorrectLetters] = useState(new Set());
  const [hintedLetter, setHintedLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Press Start to begin your quest.");
  const [showConfetti, setShowConfetti] = useState(false);

  // --- Start a new game ---
  const startGame = useCallback(async () => {
    try {
      setLoading(true);
      setHintedLetter(null);
      setCorrectLetters(new Set());
      setShowConfetti(false);
      playClick();
      const data = await apiStartGame();
      setGame({ ...data, status: "playing" });
      setMessage("Make your first guess!");
    } catch {
      setMessage("⚠ Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Handle a guess ---
  const handleGuess = useCallback(
    async (letter) => {
      if (game.status !== "playing" || game.guessed_letters.includes(letter)) return;
      setHintedLetter(null);
      try {
        const prevMistakes = game.mistakes;
        const prevMask = game.masked_word;
        const data = await apiGuess(letter);
        setGame(data);

        if (data.mistakes > prevMistakes) {
          playWrong();
          setMessage(`"${letter.toUpperCase()}" is not in the word.`);
        } else if (data.masked_word !== prevMask) {
          playCorrect();
          setCorrectLetters((prev) => new Set([...prev, letter]));
          setMessage(`Nice! "${letter.toUpperCase()}" is correct!`);
        }

        if (data.status === "won") {
          playWin();
          setScore((s) => s + 1);
          setMessage("🏆 Brilliant! You decoded the word!");
          setShowConfetti(true);
        } else if (data.status === "lost") {
          playLose();
          setMessage(`💀 The word was "${data.actual_word?.toUpperCase()}".`);
        }
      } catch {
        setMessage("⚠ Network error.");
      }
    },
    [game]
  );

  // --- AI Hint ---
  const getHint = useCallback(async () => {
    if (game.status !== "playing") return;
    setHintLoading(true);
    setMessage("🧠 AI is thinking...");
    try {
      const data = await apiAiMove();
      if (data.suggestion) {
        setHintedLetter(data.suggestion);
        playHint();
        setMessage(`AI suggests: "${data.suggestion.toUpperCase()}"`);
      }
    } catch {
      setMessage("⚠ Could not get AI suggestion.");
    } finally {
      setHintLoading(false);
    }
  }, [game.status]);

  // --- Physical keyboard support ---
  useEffect(() => {
    const handler = (e) => {
      if (game.status !== "playing") return;
      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key)) {
        handleGuess(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [game.status, handleGuess]);

  const guessedSet = new Set(game.guessed_letters);

  return (
    <>
      <Confetti active={showConfetti} />

      <div className="app-wrapper">
        {/* Header */}
        <motion.header
          className="app-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <h1>
              NexGen <span className="highlight">Hangman</span>
            </h1>
          </div>
          <p className="subtitle">Powered by N-Gram AI Language Model</p>
        </motion.header>

        {/* Main Game Card */}
        <motion.main
          className="game-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          {/* Status Bar */}
          <StatusBar
            mistakes={game.mistakes}
            maxMistakes={game.max_mistakes}
            score={score}
            status={game.status === "idle" ? "playing" : game.status}
          />

          {/* Game Area */}
          <div className="game-area">
            <HangmanDrawing mistakes={game.mistakes} />
            <div className="word-section">
              <WordDisplay
                maskedWord={game.masked_word}
                status={game.status}
                actualWord={game.actual_word}
              />
              <AnimatePresence mode="wait">
                <motion.p
                  key={message}
                  className={`game-message ${
                    game.status === "won"
                      ? "msg-win"
                      : game.status === "lost"
                      ? "msg-lose"
                      : ""
                  }`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {message}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="controls">
            <motion.button
              className="btn btn-primary"
              onClick={startGame}
              disabled={loading}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <span className="spinner" />
              ) : game.status === "idle" ? (
                <>▶ Start Game</>
              ) : (
                <>↻ New Game</>
              )}
            </motion.button>

            <motion.button
              className="btn btn-secondary"
              onClick={getHint}
              disabled={game.status !== "playing" || hintLoading}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {hintLoading ? (
                <>
                  <span className="spinner" /> Thinking...
                </>
              ) : (
                <>✨ AI Hint</>
              )}
            </motion.button>
          </div>

          {/* Keyboard */}
          <Keyboard
            guessedLetters={guessedSet}
            correctLetters={correctLetters}
            hintedLetter={hintedLetter}
            disabled={game.status !== "playing"}
            onGuess={handleGuess}
          />
        </motion.main>

        {/* Footer */}
        <footer className="app-footer">
          <span>Built with FastAPI + React + Framer Motion</span>
          <span className="separator">·</span>
          <span>N-Gram Statistical AI · 50K Word Corpus</span>
        </footer>
      </div>
    </>
  );
}
