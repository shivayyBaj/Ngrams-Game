from collections import defaultdict, Counter

class NGramModel:
    def __init__(self, words):
        self.words = words
        self.unigrams = Counter()
        self.bigrams = defaultdict(Counter)
        self.trigrams = defaultdict(Counter)
        self.alphabet = set("abcdefghijklmnopqrstuvwxyz")
        self._train()

    def _train(self):
        for word in self.words:
            for i, char in enumerate(word):
                if char not in self.alphabet:
                    continue
                
                # Unigrams
                self.unigrams[char] += 1
                
                # Bigrams
                if i > 0:
                    prev1 = word[i-1]
                    self.bigrams[prev1][char] += 1
                    
                # Trigrams
                if i > 1:
                    prev2 = word[i-2]
                    prev1 = word[i-1]
                    self.trigrams[(prev2, prev1)][char] += 1
                    
        self.total_unigrams = sum(self.unigrams.values())
        self.vocab_size = len(self.alphabet)

    def predict_next_letter(self, context: str, guessed_letters: set) -> dict:
        """
        Returns a probability distribution for the next letter given a left context string.
        Uses Laplace smoothing. Context can be 0, 1, or 2 characters.
        """
        probs = {}
        for char in self.alphabet:
            if char in guessed_letters:
                continue
                
            prob = 0
            if len(context) >= 2:
                # Try trigram
                ctx = (context[-2], context[-1])
                count_tri = self.trigrams[ctx][char]
                total_bi = sum(self.trigrams[ctx].values())
                prob = (count_tri + 1) / (total_bi + self.vocab_size)
            elif len(context) == 1:
                # Try bigram
                ctx = context[-1]
                count_bi = self.bigrams[ctx][char]
                total_uni = sum(self.bigrams[ctx].values())
                prob = (count_bi + 1) / (total_uni + self.vocab_size)
            else:
                # Unigram fallback
                count_uni = self.unigrams[char]
                prob = (count_uni + 1) / (self.total_unigrams + self.vocab_size)
                
            probs[char] = prob
            
        return probs
