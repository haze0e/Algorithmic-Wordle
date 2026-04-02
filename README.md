# Wordle Clone & Auto-Solver Bot 🟩🟨⬛

A fully functional, browser-based Wordle clone featuring a sleek hacker-aesthetic UI and a built-in, mathematically optimized Auto-Solver Bot. The bot uses expected value and information theory concepts to deduce the hidden word, narrating its "thought process" in real-time via a retro terminal interface.

## ✨ Features

* **Classic Wordle Gameplay:** Guess the 5-letter word in 6 tries with standard color-coded feedback (Green, Yellow, Grey).
* **Algorithmic Auto-Solver:** Watch the bot take over and solve the puzzle optimally using an expected value algorithm.
* **Live Terminal Feed:** A retro-styled side panel logs every event, including player inputs, constraint filtering, and the bot's statistical calculations.
* **Persistent Statistics:** Tracks your Total Wins, Losses, and Current Streak using browser `localStorage`.
* **Retro Hacker UI:** Features an animated, Matrix-style ASCII background and satisfying tile flip/pop animations.

## 🚀 How to Run Locally

Because this project uses JavaScript ES Modules (`type="module"`), you cannot simply double-click the `index.html` file. You need to serve it through a local web server.

**Option 1: VS Code (Recommended)**
1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and select **"Open with Live Server"**.

**Option 2: Python (via Terminal)**
1. Open your terminal/command prompt.
2. Navigate to the project directory.
3. Run the following command:
   ```bash
   python -m http.server 8000
   ```
4. Open your browser and go to `http://localhost:8000`.

## 🧠 How the Bot Works

The auto-solver is more than just a random guesser; it calculates the optimal move based on statistical probability:

1. **Expected Value Calculation:** The bot evaluates every possible valid guess against every remaining possible answer. It calculates the "expected remaining words" for each guess based on the 243 possible color patterns (3^5).
2. **Optimal Opener:** The bot is pre-loaded with top statistical opening words (like `ROATE`) to save computation time on turn one.
3. **Constraint Filtering:** After every guess, the bot reads the feedback (e.g., "g b y b b") and instantly filters out any words in the dictionary that no longer fit the criteria.
4. **Endgame Handling:** If only two candidates remain, the bot will intentionally search for a "splitter" word to guarantee a win on the subsequent turn rather than relying on a 50/50 coin toss.

## 📁 File Structure

* `index.html`: The main structure, UI layout, and CSS animations.
* `pika.js`: The core game logic, UI event listeners, and the auto-solver engine.
* `words.js`: Contains the word dictionaries (`words` for potential answers, `allow_words` for valid guesses).

## 🛠️ Built With

* **HTML5 / CSS3:** Flexbox/Grid layouts and custom keyframe animations.
* **Vanilla JavaScript:** ES6 Modules, DOM manipulation, and algorithm implementation without any external libraries.
