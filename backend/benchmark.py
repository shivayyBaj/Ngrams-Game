"""
==========================================================
  N-Gram Hangman AI — Accuracy Benchmark
==========================================================
Simulates N games of Hangman using the AI agent and
reports win rate, average mistakes, and letter efficiency.

Usage:
    python -m backend.benchmark              # 500 games (default)
    python -m backend.benchmark --games 1000 # custom count
==========================================================
"""

import argparse
import random
import time
import sys
from collections import Counter

from .utils import load_words
from .ngram_model import NGramModel
from .hangman_ai import HangmanAI

# ── Simulation Engine ──────────────────────────────────────

def simulate_game(word: str, ai: HangmanAI, max_mistakes: int = 6) -> dict:
    """Simulates a single Hangman game. Returns stats dict."""
    guessed = set()
    mistakes = 0
    masked = "".join(["_"] * len(word))
    total_guesses = 0

    while mistakes < max_mistakes and "_" in masked:
        letter = ai.predict_best_letter(masked, guessed)
        guessed.add(letter)
        total_guesses += 1

        if letter in word:
            # Reveal the letter
            masked = "".join(
                [c if c in guessed else "_" for c in word]
            )
        else:
            mistakes += 1

    won = "_" not in masked
    return {
        "word": word,
        "won": won,
        "mistakes": mistakes,
        "total_guesses": total_guesses,
        "word_length": len(word),
    }


# ── Main Benchmark ─────────────────────────────────────────

def run_benchmark(num_games: int = 500, seed: int = 42):
    print("=" * 60)
    print("  N-Gram Hangman AI — Accuracy Benchmark")
    print("=" * 60)

    # Load data
    import os
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'words.txt')
    print(f"\n[Dataset] Loading dataset from: {dataset_path}")
    words = load_words(dataset_path)
    print(f"   Loaded {len(words):,} words.")

    # Build model
    print("Training N-gram model (Unigram + Bigram + Trigram)...")
    t0 = time.time()
    model = NGramModel(words)
    ai = HangmanAI(model)
    train_time = time.time() - t0
    print(f"   Model trained in {train_time:.2f}s.\n")

    # Sample words
    rng = random.Random(seed)
    sample = rng.sample(words, min(num_games, len(words)))

    # Simulate
    print(f"Simulating {len(sample):,} games...\n")
    results = []
    wins = 0
    progress_step = max(1, len(sample) // 20)

    for i, word in enumerate(sample):
        result = simulate_game(word, ai)
        results.append(result)
        if result["won"]:
            wins += 1
        if (i + 1) % progress_step == 0 or i == len(sample) - 1:
            pct = (i + 1) / len(sample) * 100
            bar = "#" * int(pct // 5) + "-" * (20 - int(pct // 5))
            sys.stdout.write(f"\r   [{bar}] {pct:5.1f}%  ({i+1}/{len(sample)})")
            sys.stdout.flush()

    print("\n")

    # -- Compute Metrics ------------------------------------

    total = len(results)
    win_rate = wins / total * 100
    avg_mistakes = sum(r["mistakes"] for r in results) / total
    avg_guesses = sum(r["total_guesses"] for r in results) / total

    # By word length bucket
    len_buckets = {}
    for r in results:
        wl = r["word_length"]
        bucket = f"{wl}" if wl <= 10 else "11+"
        if bucket not in len_buckets:
            len_buckets[bucket] = {"wins": 0, "total": 0}
        len_buckets[bucket]["total"] += 1
        if r["won"]:
            len_buckets[bucket]["wins"] += 1

    # Hardest words (lost)
    lost_words = [r["word"] for r in results if not r["won"]]
    lost_sample = lost_words[:15]

    # -- Print Report ---------------------------------------

    print("=" * 60)
    print("  RESULTS")
    print("=" * 60)
    print(f"  Games Played      : {total:,}")
    print(f"  Games Won         : {wins:,}")
    print(f"  Games Lost        : {total - wins:,}")
    print(f"  ---------------------------------")
    print(f"  WIN RATE       : {win_rate:.1f}%")
    print(f"  Avg Mistakes   : {avg_mistakes:.2f} / 6")
    print(f"  Avg Guesses    : {avg_guesses:.1f}")
    print()

    print("  Win Rate by Word Length:")
    print("  ---------------------------------")
    for bucket in sorted(len_buckets.keys(), key=lambda x: (len(x), x)):
        b = len_buckets[bucket]
        br = b["wins"] / b["total"] * 100 if b["total"] > 0 else 0
        bar = "#" * int(br // 5) + "-" * (20 - int(br // 5))
        print(f"    Len {bucket:>3s}: [{bar}] {br:5.1f}%  ({b['wins']}/{b['total']})")
    print()

    if lost_sample:
        print(f"  Sample of {len(lost_sample)} hardest words (AI lost):")
        print(f"    {', '.join(lost_sample)}")
    print()
    print("=" * 60)

    return win_rate


# ── CLI Entry Point ────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Benchmark the N-Gram Hangman AI")
    parser.add_argument("--games", type=int, default=500, help="Number of games to simulate (default: 500)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")
    args = parser.parse_args()
    run_benchmark(args.games, args.seed)
