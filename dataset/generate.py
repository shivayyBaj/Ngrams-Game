import urllib.request
import os

os.makedirs("d:/hangman/dataset", exist_ok=True)
url = "https://raw.githubusercontent.com/david47k/top-english-wordlists/master/top_english_words_lower_50000.txt"
print("Downloading 50,000-word list...")
response = urllib.request.urlopen(url)
words = response.read().decode('utf-8', errors='ignore').splitlines()
valid_words = [w.strip().lower() for w in words if len(w.strip()) >= 3 and w.isalpha()]
with open("d:/hangman/dataset/words.txt", "w") as f:
    for w in valid_words:
        f.write(w + "\n")
print(f"Dataset generated with {len(valid_words)} words.")
