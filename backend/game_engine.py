import random

class GameEngine:
    def __init__(self, vocabulary: list):
        self.vocabulary = vocabulary
        self.reset()
        
    def reset(self):
        self.word = random.choice(self.vocabulary).lower()
        self.guessed_letters = set()
        self.max_mistakes = 6
        self.mistakes = 0
        self.status = "playing" # playing, won, lost
        
    def get_masked_word(self) -> str:
        return "".join([c if c in self.guessed_letters else "_" for c in self.word])
        
    def guess(self, letter: str) -> dict:
        letter = letter.lower()
        if self.status != "playing":
            return self.get_state()
            
        if letter in self.guessed_letters:
            return self.get_state()
            
        self.guessed_letters.add(letter)
        
        if letter not in self.word:
            self.mistakes += 1
            if self.mistakes >= self.max_mistakes:
                self.status = "lost"
        else:
            if "_" not in self.get_masked_word():
                self.status = "won"
                
        return self.get_state()
        
    def get_state(self) -> dict:
        return {
            "masked_word": self.get_masked_word(),
            "guessed_letters": list(self.guessed_letters),
            "mistakes": self.mistakes,
            "max_mistakes": self.max_mistakes,
            "status": self.status,
            "actual_word": self.word if self.status != "playing" else None
        }
