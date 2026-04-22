const API_BASE = "http://127.0.0.1:8000";

export async function apiStartGame() {
  const res = await fetch(`${API_BASE}/start_game`);
  if (!res.ok) throw new Error("Failed to start game");
  return res.json();
}

export async function apiGuess(letter) {
  const res = await fetch(`${API_BASE}/guess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ letter }),
  });
  if (!res.ok) throw new Error("Failed to guess");
  return res.json();
}

export async function apiAiMove() {
  const res = await fetch(`${API_BASE}/ai_move`);
  if (!res.ok) throw new Error("Failed to get AI move");
  return res.json();
}

export async function apiStatus() {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error("Failed to get status");
  return res.json();
}
