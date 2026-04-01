const board = document.getElementById("board");
const rows = 6;
const cols = 5;
const restartBtn = document.getElementById("restart-btn");
let stats = {
    total_wins: 0,
    total_losses: 0,
    current_streak: 0
};


function getStatsBox(stats) {
    // This fxn is made using AI..
    const innerWidth = 17;

    // Helper function to keep the right border aligned
    const formatLine = (label, value) => {
        const text = `${label} ${value}`;
        // padEnd adds empty spaces until the string hits the innerWidth limit
        return `| ${text.padEnd(innerWidth, ' ')} |`;
    };

    // Return the multi-line ASCII string
    return `
+-------------------+
|   PLAYER STATS    |
+-------------------+
${formatLine("Wins:  ", stats.total_wins)}
${formatLine("Losses:", stats.total_losses)}
${formatLine("Streak:", stats.current_streak)}
+-------------------+`;
}


// const userObj = {
//   username = "Maria",
//   email: "maria@mail.com"
// }

// localStorage.setItem('user', JSON.stringify(userObj))

function save_data() {
    localStorage.setItem('userdata', JSON.stringify(stats));
}

// const storedUserData = localStorage.getItem('user')

// if (storedUserData) {
//   const userData = JSON.parse(storedUserData)
//   // You can use userData here...
// } else {
//   console.log('User data not found in local storage')
// }


function get_data() {
    const storedUserData = localStorage.getItem('userdata')
    if (storedUserData) {
        stats = JSON.parse(storedUserData);
    }
    else {
        console.log("looks like playing game for first time");
    }
}

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

function logToTerminalWithout(message) {
    const newLog = document.createElement("pre");


    if (message === " ") {
        newLog.innerHTML = "&nbsp;";
    } else {
        newLog.innerText = message;
    }

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
    save_data();
    terminalContent.innerHTML = "";
    currentRow = 0;
    currentCol = 0;
    isGameOver = false;
    isProcessing = false;

    const randomIndex = Math.floor(Math.random() * words.length);
    Random_word = words[randomIndex];
    console.log("Target Word choosen: " + Random_word);
    let stats_stri = getStatsBox(stats);

    logToTerminalWithout(stats_stri);
    logToTerminalWithout(" ");


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


            if (!CORRECT && (currentRow < rows - 1)) {

                setTimeout(() => {
                    logToTerminal(`Input succesfully submitted: ${user_string}`)
                }, 6 * 250);

                setTimeout(() => {
                    logToTerminal(`Checker code: ${code}`)
                }, (6 * 250 + 125));
            }


            setTimeout(() => {
                if (CORRECT) {
                    logToTerminalWithout(" ");
                    logToTerminalWithout(" ");
                    stats.total_wins += 1;
                    stats.current_streak += 1;
                    save_data();
                    alert("You guessed the word! It was: " + Random_word);
                    const winArt = `
+-------------------+
|     YOU WIN!      |
|   WORD GUESSED    |
+-------------------+`;
                    logToTerminalWithout(winArt)
                    logToTerminalWithout(" ");
                    logToTerminalWithout(" ");

                    isGameOver = true;
                    isProcessing = false;
                    return;
                }

                currentRow++;
                currentCol = 0;
                isProcessing = false;

                if (currentRow >= rows && !CORRECT) {
                    alert("Game Over! The word was: " + Random_word);
                    stats.current_streak = 0;
                    stats.total_losses += 1;
                    save_data();
                    const loseArt = `
+-------------------+
|     GAME OVER     |
|   STREAK BROKEN   |
+-------------------+`;
                    logToTerminalWithout(" ")

                    logToTerminalWithout(loseArt);
                    logToTerminalWithout(" ")

                    logToTerminal("The word was: " + Random_word);


                    isGameOver = true;
                }
            }, cols * 250);
        }
    }
});


get_data();

start_game();

function make_background() {
    const bg_Element = document.getElementById('main-bg');
    if (!bg_Element) return;

    const chars = "01/*-+$%#@!<>~ ";
    let bgText = "";
    
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 150; j++) {
            bgText += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        bgText += "\n";
    }
    bg_Element.innerText = bgText;
}

make_background();


if (restartBtn) {
    restartBtn.addEventListener("click", start_game);

}
