const board = document.getElementById("board");
const rows = 6;
const cols = 5;
const restartBtn = document.getElementById("restart-btn");

import { words } from './words.js';
import { allow_words } from './words.js';

function isValidWord(targetWord) {

    let left = 0;
    let right = allow_words.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        let midWord = allow_words[mid];

        if (midWord === targetWord) {
            return true;
        } else if (midWord < targetWord) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return false;
}

const terminalContent = document.getElementById("terminal-content");


function logToTerminal(message) {
    const newLog = document.createElement("div");
    newLog.innerText = `> ${message}`;
    terminalContent.appendChild(newLog);


    terminalContent.scrollTop = terminalContent.scrollHeight;
}

function contain(s, c) {
    let exist = false;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === c) {
            exist = true;
        }
    }
    return exist;
}

function should_not_contain(s, c) {
    let exist = true;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === c) {
            exist = false;
        }
    }
    return exist;
}

function contain_at_pos(s, c, pos) {

    return s[pos - 1] === c;
}

function contain_not_at_pos(s, c, pos) {
    let exist = false;
    for (let i = 0; i < s.length; i++) {

        if (s[i] === c && i !== (pos - 1)) {
            exist = true;
        }
    }

    if (s[pos - 1] === c) {
        exist = false;
    }
    return exist;
}

let currentRow = 0;
let currentCol = 0;
let Random_word = "";
let isGameOver = false;
let isProcessing = false;

function start_game() {
    terminalContent.innerHTML = "";
    currentRow = 0;
    currentCol = 0;
    isGameOver = false;
    isProcessing = false;

    const randomIndex = Math.floor(Math.random() * words.length);
    Random_word = words[randomIndex];
    console.log("Target Word choosen");
    logToTerminal("A random word choosen :)")


    board.innerHTML = "";

    for (let i = 0; i < rows * cols; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.setAttribute("id", `tile-${i}`);
        board.appendChild(tile);
    }
    if (restartBtn) {
        restartBtn.blur();
    }
}

document.addEventListener("keyup", (e) => {
    if (isGameOver || isProcessing || currentRow >= rows) return;
    const pressedKey = e.key.toLowerCase();


    if (pressedKey >= "a" && pressedKey <= "z" && pressedKey.length === 1) {
        if (currentCol < cols) {
            const tileIndex = currentRow * cols + currentCol;
            const tile = document.getElementById(`tile-${tileIndex}`);
            tile.classList.add("animate-pop");


            tile.innerText = pressedKey;

            currentCol++;
            setTimeout(() => {
                tile.classList.remove("animate-pop");
            }, 100);
        }
    }

    else if (e.key === "Backspace") {
        if (currentCol > 0) {
            currentCol--;
            const tileIndex = currentRow * cols + currentCol;
            const tile = document.getElementById(`tile-${tileIndex}`);
            tile.innerText = "";
        }
    }
    else if (e.key === "Enter") {
        if (currentCol === cols) {

            isProcessing = true;

            let user_string = "";

            for (let i = 0; i < cols; i++) {
                const tileIndex = (currentRow * cols) + i;
                const tile = document.getElementById(`tile-${tileIndex}`);
                user_string += tile.innerText.toLowerCase();
            }

            if (!isValidWord(user_string, words)) {

                alert(`ERROR: ${user_string.toUpperCase()} is not in word list.`);
                logToTerminal(`ERROR: ${user_string.toUpperCase()} is not in word list.`);
                while (currentCol > 0) {
                    currentCol--;
                    const tileIndex = currentRow * cols + currentCol;
                    const tile = document.getElementById(`tile-${tileIndex}`);
                    tile.innerText = "";
                }
                isProcessing = false;
                return;
            }
            let code = "";

            for (let j = 0; j < cols; j++) {
                let charac = user_string[j];
                const tileIndex = (currentRow * cols) + j;
                const tile = document.getElementById(`tile-${tileIndex}`);

                let tileColor = "";
                if (contain_at_pos(Random_word, charac, j + 1)) {
                    code += "g" + charac + (j + 1);
                    tileColor = "green";
                } else if (contain(Random_word, charac)) {
                    code += "y" + charac + (j + 1);
                    tileColor = "yellow";
                } else {
                    code += "b" + charac + (j + 1);
                    tileColor = "grey";
                }

                const flipDelay = j * 250;

                setTimeout(() => {
                    tile.classList.add("flip");
                    setTimeout(() => {
                        tile.classList.add(tileColor);
                    }, 250);
                }, flipDelay);
            }






            let CORRECT = true;
            for (let t = 0; t < code.length; t += 3) {
                if (code[t] !== 'g') {
                    CORRECT = false;
                    break;
                }
            }


            if (!CORRECT && (currentRow < rows)) {

                setTimeout(() => {
                    logToTerminal(`Input succesfully submitted: ${user_string}`)
                }, 6 * 250);

                setTimeout(() => {
                    logToTerminal(`Checker code: ${code}`)
                }, (6 * 250 + 125));
            }


            setTimeout(() => {
                if (CORRECT) {
                    logToTerminal("");
                    logToTerminal("");
                    alert("You guessed the word! It was: " + Random_word);
                    logToTerminal("You guessed the word! It was: " + Random_word);
                    logToTerminal("Win +=1 :)")
                    logToTerminal("");
                    logToTerminal("");

                    isGameOver = true;
                    isProcessing = false;
                    return;
                }

                currentRow++;
                currentCol = 0;
                isProcessing = false;

                if (currentRow >= rows && !CORRECT) {
                    alert("Game Over! The word was: " + Random_word);
                    setTimeout(() => {
                        logToTerminal("")
                        logToTerminal("")
                        logToTerminal("Game Over! The word was: " + Random_word);
                        logToTerminal("Streak broken :(")
                    }, (6 * 250 + 150));

                    isGameOver = true;
                }
            }, cols * 250);
        }
    }
});

start_game();

if (restartBtn) {
    restartBtn.addEventListener("click", start_game);
}
