let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTone(freq, type = "sine", duration = 0.12, vol = 0.08) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playCorrect() {
  playTone(523.25, "sine", 0.08, 0.07);
  setTimeout(() => playTone(659.25, "sine", 0.1, 0.07), 80);
}

export function playWrong() {
  playTone(185, "sawtooth", 0.22, 0.06);
}

export function playWin() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((n, i) => setTimeout(() => playTone(n, "square", 0.15, 0.05), i * 120));
}

export function playLose() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(350, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.7);
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.7);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.7);
}

export function playClick() {
  playTone(800, "sine", 0.04, 0.03);
}

export function playHint() {
  playTone(880, "triangle", 0.1, 0.06);
  setTimeout(() => playTone(1108.73, "triangle", 0.15, 0.06), 100);
}
