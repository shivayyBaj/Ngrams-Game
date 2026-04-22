# NexGen Hangman

An advanced, full-stack Hangman game featuring an immersive glassmorphism UI and powered by a statistical N-gram Language Model that predicts the best moves.

## Features

- **N-Gram AI Agent**: Analyzes English letter frequencies, Bigrams, and Trigrams to strategically hint the optimal next guess based on your current revealed word. 
- **Modern UI/UX**: Centered responsive layout, dynamic gradient orbs, and glassmorphism styling.
- **Micro-interactions**: Web Audio sounds, smooth animations, and interactive keyboard mapping.

## Setup Instructions

### Prerequisites
- Python 3.8+
- Modern Web Browser (Audio API requires user interaction to enable sounds)

### 1. Backend Setup

Open a terminal and navigate to the project directory:

```bash
# From the root directory:
pip install -r requirements.txt
```

Run the FastAPI server:
```bash
uvicorn backend.app:app --reload
```

The API will now be running at `http://127.0.0.1:8000`.

### 2. Frontend Setup

Since the frontend is built entirely with vanilla web technologies, you don't need a build step.
Simply open `frontend/index.html` in your favorite web browser:
- You can double click `index.html` on your filesystem.
- For the best experience (to avoid strict cross-origin policies on some browsers), use a local server:
  ```bash
  python -m http.server 3000 --directory frontend
  ```
  Then navigate to `http://localhost:3000`

## AI Mechanics

This project uses **Laplace Smoothed N-Gram statistical language model** to predict letters. 

1. **Unigrams**: Single character occurrence rate.
2. **Bigrams**: Probability of a character following the previous character.
3. **Trigrams**: Probability of a character following the two previous characters.

When you request an **AI Hint**, the backend filters the 50,000-word dataset for words matching the current state's length and character placements. It then determines the character with the maximum probability of occurrence in the remaining unknown slots.
