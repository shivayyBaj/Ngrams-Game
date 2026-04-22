from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
# Reload triggered for 50k dataset

from .utils import load_words
from .ngram_model import NGramModel
from .hangman_ai import HangmanAI
from .game_engine import GameEngine

app = FastAPI(title="Advanced Hangman API")

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global State Initialization
dataset_path = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'words.txt')
words = load_words(dataset_path)
ngram_model = NGramModel(words)
hangman_ai = HangmanAI(ngram_model)
game_engine = GameEngine(words)

class GuessRequest(BaseModel):
    letter: str

@app.get("/start_game")
def start_game():
    game_engine.reset()
    return game_engine.get_state()

@app.post("/guess")
def make_guess(request: GuessRequest):
    letter = request.letter
    if not letter or len(letter) != 1 or not letter.isalpha():
        raise HTTPException(status_code=400, detail="Invalid letter")
    return game_engine.guess(letter)

@app.get("/ai_move")
def suggest_move():
    if game_engine.status != "playing":
        return {"suggestion": None, "message": "Game over"}
        
    best_letter = hangman_ai.predict_best_letter(
        game_engine.get_masked_word(), 
        game_engine.guessed_letters
    )
    return {"suggestion": best_letter}

@app.get("/status")
def get_status():
    return game_engine.get_state()
