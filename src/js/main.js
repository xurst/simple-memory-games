import gameModes from './modes.js';

let sequence = [];
let playerSequence = [];
let gameActive = false;
let currentMode = gameModes.sequence.normal;
let selectionTimer = null;

const boxes = document.querySelectorAll('.game-box');
const statusText = document.querySelector('.status-text');
const modeButton = document.getElementById('modeButton');
const modeDropdown = document.querySelector('.mode-dropdown');
const startButton = document.getElementById('startButton');

const savedMode = localStorage.getItem('sequenceGameMode') || 'normal';
currentMode = gameModes.sequence[savedMode];
modeButton.textContent = `mode: ${savedMode}`;

function startGame() {
    if (gameActive) return;

    gameActive = true;
    sequence = [];
    playerSequence = [];
    startButton.disabled = true;
    computerTurn();
}

function highlightBox(index, duration = currentMode.highlightTimer) {
    boxes[index].classList.add('highlighted');
    setTimeout(() => boxes[index].classList.remove('highlighted'), duration);
}

function startSelectionTimer() {
    clearTimeout(selectionTimer);
    selectionTimer = setTimeout(() => {
        if (gameActive) {
            statusText.textContent = "time's up! game over! score: " + (sequence.length - 1);
            gameActive = false;
            sequence = [];
            startButton.disabled = false;
        }
    }, currentMode.timerSelection);
}

function computerTurn() {
    gameActive = false;
    statusText.textContent = "computer's turn";
    const newBox = Math.floor(Math.random() * 9);
    sequence.push(newBox);

    let i = 0;
    const showSequence = () => {
        if (i < sequence.length) {
            highlightBox(sequence[i]);
            i++;
            setTimeout(showSequence, currentMode.speedOfSelection);
        } else {
            setTimeout(() => {
                statusText.textContent = "your turn";
                gameActive = true;
                playerSequence = [];
                startSelectionTimer();
            }, currentMode.turnDelay);
        }
    };
    setTimeout(showSequence, 1000);
}

boxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        if (!gameActive) return;

        highlightBox(index, 200);
        playerSequence.push(index);

        const currentIndex = playerSequence.length - 1;
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            statusText.textContent = "game over! score: " + (sequence.length - 1);
            gameActive = false;
            sequence = [];
            startButton.disabled = false;
            return;
        }

        startSelectionTimer(); // Reset timer on correct selection

        if (playerSequence.length === sequence.length) {
            gameActive = false;
            statusText.textContent = "correct!";
            clearTimeout(selectionTimer);
            setTimeout(computerTurn, 1000);
        }
    });
});

startButton.addEventListener('click', startGame);

modeButton.addEventListener('click', () => {
    modeDropdown.classList.toggle('hidden');
});

document.querySelectorAll('.mode-option').forEach(option => {
    option.addEventListener('click', () => {
        const modeName = option.dataset.mode;
        localStorage.setItem('sequenceGameMode', modeName);
        currentMode = gameModes.sequence[modeName];
        modeButton.textContent = `mode: ${modeName}`;
        modeDropdown.classList.add('hidden');

        sequence = [];
        playerSequence = [];
        clearTimeout(selectionTimer);
        gameActive = false;
        startButton.disabled = false;
        statusText.textContent = "click start to begin";
    });
});

document.addEventListener('click', (e) => {
    if (!modeButton.contains(e.target) && !modeDropdown.contains(e.target)) {
        modeDropdown.classList.add('hidden');
    }
});