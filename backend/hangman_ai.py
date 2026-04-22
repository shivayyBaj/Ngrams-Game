import re
from collections import Counter
from .ngram_model import NGramModel

class HangmanAI:
    def __init__(self, ngram_model: NGramModel):
        self.model = ngram_model
        
    def filter_words(self, current_word: str, guessed_letters: set) -> list:
        """Filter vocabulary by length and known letter positions."""
        pattern = "^"
        for char in current_word:
            if char == "_":
                if guessed_letters:
                    pattern += f"[^{''.join(guessed_letters)}]"
                else:
                    pattern += "[a-z]"
            else:
                pattern += char
        pattern += "$"
        
        regex = re.compile(pattern)
        return [w for w in self.model.words if regex.match(w)]

    def predict_best_letter(self, current_word: str, guessed_letters: set) -> str:
        """Predicts the best next letter based on the current word state and N-gram model."""
        # 1. Pattern filtering (Find words that match the current template)
        possible_words = self.filter_words(current_word, guessed_letters)
        
        # 2. If we have a small set of matching words, count letter frequencies in those exact words
        if 0 < len(possible_words) < 1000:
            letter_counts = Counter()
            for word in possible_words:
                for char in set(word): # Count each unique letter once per word
                    if char not in guessed_letters:
                        letter_counts[char] += 1
            if letter_counts:
                return letter_counts.most_common(1)[0][0]
                
        # 3. Fallback to N-gram model prediction
        combined_probs = {c: 0 for c in "abcdefghijklmnopqrstuvwxyz" if c not in guessed_letters}
        
        # Look at each blank and its preceding context
        blanks = [i for i, char in enumerate(current_word) if char == "_"]
        
        for idx in blanks:
            # Determine context from previous chars
            context = ""
            if idx > 0 and current_word[idx-1] != "_":
                context = current_word[idx-1]
                if idx > 1 and current_word[idx-2] != "_":
                    context = current_word[idx-2] + context
                    
            probs = self.model.predict_next_letter(context, guessed_letters)
            # Sum up probabilities across all blanks
            for char, prob in probs.items():
                if char in combined_probs:
                    combined_probs[char] += prob
                    
        if combined_probs:
            best_char = max(combined_probs, key=combined_probs.get)
            return best_char
            
        # Absolute fallback: Most common English letter not guessed
        for char in "etaoinshrdlcumwfgypbvkjxqz":
            if char not in guessed_letters:
                return char
        return "a"
