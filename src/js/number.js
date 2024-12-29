import gameModes from './modes.js';

let currentNumber = '';
let gameActive = false;
let currentMode = gameModes.normal;

const display = document.querySelector('.number-display');
const input = document.getElementById('numberInput');
const statusText = document.querySelector('.status-text');
const modeButton = document.getElementById('modeButton');
const modeDropdown = document.querySelector('.mode-dropdown');
const startButton = document.getElementById('startButton');

const savedMode = localStorage.getItem('numberGameMode') || 'normal';
currentMode = gameModes[savedMode];
modeButton.textContent = `mode: ${savedMode}`;

function generateNumber(length) {
    return Math.floor(Math.random() * (10 ** length));
}

function startGame() {
    if (gameActive) return;

    gameActive = true;
    input.classList.add('hidden');
    display.textContent = '0';
    statusText.textContent = 'get ready...';
    startButton.disabled = true;

    setTimeout(() => {
        const numberLength = Math.floor(currentMode.speedOfSelection / 100) + 1;
        currentNumber = generateNumber(numberLength).toString();
        display.textContent = currentNumber;

        setTimeout(() => {
            display.textContent = '?';
            input.value = '';
            input.classList.remove('hidden');
            input.focus();
            statusText.textContent = 'what was the number?';
            startSelectionTimer();
        }, currentMode.highlightTimer);
    }, 1000);
}

function startSelectionTimer() {
    setTimeout(() => {
        if (gameActive) {
            gameActive = false;
            statusText.textContent = "time's up! the number was " + currentNumber;
            input.classList.add('hidden');
            startButton.disabled = false;
        }
    }, currentMode.timerSelection);
}

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && gameActive) {
        const guess = input.value;
        gameActive = false;

        if (guess === currentNumber) {
            statusText.textContent = 'correct!';
            setTimeout(startGame, 1000);
        } else {
            statusText.textContent = `wrong! the number was ${currentNumber}`;
            startButton.disabled = false;
            input.classList.add('hidden');
        }
    }
});

startButton.addEventListener('click', startGame);

modeButton.addEventListener('click', () => {
    modeDropdown.classList.toggle('hidden');
});

document.querySelectorAll('.mode-option').forEach(option => {
    option.addEventListener('click', () => {
        const modeName = option.dataset.mode;
        localStorage.setItem('numberGameMode', modeName);
        currentMode = gameModes[modeName];
        modeButton.textContent = `mode: ${modeName}`;
        modeDropdown.classList.add('hidden');
    });
});

document.addEventListener('click', (e) => {
    if (!modeButton.contains(e.target) && !modeDropdown.contains(e.target)) {
        modeDropdown.classList.add('hidden');
    }
});