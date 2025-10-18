# 🎯 Telugu Wordle

A React Native mobile game inspired by the NYT Wordle — it's all in **Telugu** 🇮🇳


---

## ✨ Features

- 6 tries to guess a common **Telugu word**
- **Transliteration-based** guessing — type in English, guess in Telugu
- Letters turn green/yellow/gray based on correctness
- Click the speaker to **hear** the word pronounced in Telugu (phone must be off silent mode to hear to speech) 
- 📱 Responsive design — works on iOS and Android via Expo, working on deployment via github pages 

---

## 🛠️ Built With

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [`expo-speech`](https://docs.expo.dev/versions/latest/sdk/speech/) for Text-to-Speech
- Telugu word list from curated sources (100+ common words)

---

## 🕹️ How to Play

1. Type your guess using **transliteration** (e.g., `dosthulu`)
2. Hit return / enter to submit
3. Colors will flip:
   - 🟩 Green = correct letter & position  
   - 🟨 Yellow = correct letter, wrong position  
   - ⬜️ Gray = not in the word  
4. Repeat up to 6 times
5. If you win or lose, the **correct word, Telugu script, and definition** appear
6. Tap 🔊 to hear the Telugu pronunciation!


---

## 🚀 Getting Started

Clone the repo and run locally with Expo:

```bash
git clone https://github.com/yourusername/telugu-wordle.git
cd TeluguWorlde
cd my-app
npm start
