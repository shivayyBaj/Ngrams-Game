import { useEffect, useState } from "react";
import "./Confetti.css";

function randomBetween(a, b) {
  return Math.random() * (b - a) + a;
}

export default function Confetti({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }
    const colors = ["#6366f1", "#8b5cf6", "#22d3ee", "#10b981", "#f59e0b", "#f43f5e", "#fff"];
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: randomBetween(5, 95),
      delay: randomBetween(0, 1.5),
      duration: randomBetween(2, 4),
      size: randomBetween(6, 12),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: randomBetween(0, 360),
    }));
    setParticles(newParticles);
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="confetti-overlay">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
