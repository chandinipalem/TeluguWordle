from datasets import load_dataset
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate
import regex, json, re
import unicodedata

# Load dataset
dataset = load_dataset("bigscience-data/roots_indic-te_indic_nlp_corpus")

# Check if word is actually Telugu (avoid Hindi, digits, symbols, etc.)
def is_clean_telugu(word):
    # Reject anything with non-Telugu Unicode blocks, digits, Latin, weird stuff
    if re.search(r'[0-9a-zA-Z@#$%^&*()_+={}\[\]:;"\'<>,.?/\\|~`-]', word):
        return False
    if re.search(r'[^ఁ-౿ ]', word):  # Only allow Telugu range
        return False
    if len(word.strip()) == 0:
        return False
    return True

# Clean transliteration (e.g., remove weird diacritics)
def clean_translit(text):
    text = text.lower()
    text = unicodedata.normalize('NFD', text)
    text = ''.join([c for c in text if unicodedata.category(c) != 'Mn'])  # remove accents
    text = re.sub(r'[^a-z]', '', text)  # remove anything that’s not a-z
    return text

words = set()
for i, row in enumerate(dataset["train"]):
    if i > 100_000:  # only scan 100k lines to keep it fast
        break
    text = row.get("text") or row.get("line") or row.get("content")
    if not text:
        continue
    for token in text.split():
        if is_clean_telugu(token):
            translit = transliterate(token, sanscript.TELUGU, sanscript.IAST)
            cleaned = clean_translit(translit)
            if 5 <= len(cleaned) <= 9:
                words.add((token, cleaned))

# Limit to 50,000 max
final_words = [{
    "telugu": telugu,
    "translit": translit
} for telugu, translit in sorted(words)[:50000]]

with open("telugu_wordlist_5_9_cleaned.json", "w", encoding="utf-8") as f:
    json.dump(final_words, f, ensure_ascii=False, indent=2)

print(f"✅ Cleaned and saved {len(final_words)} Telugu words.")
