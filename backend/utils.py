import os

def load_words(filepath: str) -> list:
    """Loads and preprocesses words from the dataset."""
    if not os.path.exists(filepath):
        # Fallback tiny dataset
        return ["algorithm", "developer", "backend", "frontend", "javascript", "python", "hangman", "artificial", "intelligence", "interface"]
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        words = [
            line.strip().lower()
            for line in f
            if len(line.strip()) >= 3
            and line.strip().isalpha()
            and line.strip().isascii()
        ]
    
    return words
