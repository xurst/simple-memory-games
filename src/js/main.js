import gameModes from './modes.js';

// Sidebar toggle functionality
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggle-button';
    toggleButton.innerHTML = '☰';
    document.body.appendChild(toggleButton);

    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    const handleToggle = debounce(() => {
        sidebar.classList.toggle('sidebar-collapsed');
        mainContent.classList.toggle('full-width');
    }, 100);

    toggleButton.addEventListener('click', handleToggle);
});

// Game variables
let sequence = [];
let playerSequence = [];
let gameActive = false;
let currentMode;
let selectionTimer = null;
let usedBoxesThisTurn = new Set();

// DOM elements
const boxes = document.querySelectorAll('.game-box');
const statusText = document.querySelector('.status-text');
const modeButton = document.getElementById('modeButton');
const modeDropdown = document.querySelector('.mode-dropdown');
const startButton = document.getElementById('startButton');

// Settings functions
function updateSettingsUI() {
    document.getElementById('highlightTimer').value = currentMode.highlightTimer;
    document.getElementById('timerSelection').value = currentMode.timerSelection;
    document.getElementById('speedOfSelection').value = currentMode.speedOfSelection;
    document.getElementById('turnDelay').value = currentMode.turnDelay;
    document.getElementById('repetitionEnabled').checked = currentMode.repetitionEnabled;

    // Update displayed values with 'ms' suffix
    document.getElementById('highlightValue').textContent = `${currentMode.highlightTimer} ms`;
    document.getElementById('timerValue').textContent = `${currentMode.timerSelection} ms`;
    document.getElementById('speedValue').textContent = `${currentMode.speedOfSelection} ms`;
    document.getElementById('delayValue').textContent = `${currentMode.turnDelay} ms`;
}

function loadMode(modeName) {
    currentMode = JSON.parse(JSON.stringify(gameModes.sequence[modeName]));
    modeButton.textContent = `mode: ${modeName}`;
    updateSettingsUI();
}

// Game functions
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

function getRandomBox() {
    if (currentMode.repetitionEnabled) {
        return Math.floor(Math.random() * 9);
    } else {
        if (usedBoxesThisTurn.size >= 9) {
            usedBoxesThisTurn.clear();
        }
        let availableBoxes = [];
        for (let i = 0; i < 9; i++) {
            if (!usedBoxesThisTurn.has(i)) {
                availableBoxes.push(i);
            }
        }
        const newBox = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
        usedBoxesThisTurn.add(newBox);
        return newBox;
    }
}

function computerTurn() {
    gameActive = false;
    statusText.textContent = "computer's turn";
    if (!currentMode.repetitionEnabled) {
        if (usedBoxesThisTurn.size >= 9) {
            usedBoxesThisTurn.clear();
        }
    } else {
        usedBoxesThisTurn.clear();
    }
    const newBox = getRandomBox();
    if (!currentMode.repetitionEnabled) {
        usedBoxesThisTurn.add(newBox);
    }
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

// Event listeners
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

        startSelectionTimer();

        if (playerSequence.length === sequence.length) {
            gameActive = false;
            statusText.textContent = "correct!";
            clearTimeout(selectionTimer);
            setTimeout(computerTurn, 1000);
        }
    });
});

// Settings panel event listeners
document.getElementById('settingsButton').addEventListener('click', () => {
    document.querySelector('.settings-panel').classList.remove('hidden');
    updateSettingsUI();
});

document.querySelector('.settings-close').addEventListener('click', () => {
    document.querySelector('.settings-panel').classList.add('hidden');
});

document.querySelectorAll('.setting-group input').forEach(input => {
    input.addEventListener('input', (e) => {
        const settingId = e.target.id;
        const newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        // Handle the value display differently for checkbox vs range inputs
        if (e.target.type === 'checkbox') {
            currentMode[settingId] = newValue;
        } else {
            const label = e.target.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                const labelSpan = label.querySelector('.setting-value');
                if (labelSpan) {
                    labelSpan.textContent = `${newValue} ms`;
                }
            }
            currentMode[settingId] = parseInt(newValue);
        }
    });
});

document.querySelector('.settings-save').addEventListener('click', () => {
    currentMode.repetitionEnabled = document.getElementById('repetitionEnabled').checked;
    document.querySelector('.settings-panel').classList.add('hidden');
});

document.querySelector('.settings-reset').addEventListener('click', () => {
    const currentModeName = modeButton.textContent.split(': ')[1];
    const defaultMode = gameModes.sequence[currentModeName];
    // Copy default values
    currentMode.highlightTimer = defaultMode.highlightTimer;
    currentMode.timerSelection = defaultMode.timerSelection;
    currentMode.speedOfSelection = defaultMode.speedOfSelection;
    currentMode.turnDelay = defaultMode.turnDelay;
    currentMode.repetitionEnabled = defaultMode.repetitionEnabled;
    updateSettingsUI();
});

startButton.addEventListener('click', startGame);

modeButton.addEventListener('click', () => {
    modeDropdown.classList.toggle('hidden');
});

document.querySelectorAll('.mode-option').forEach(option => {
    option.addEventListener('click', () => {
        const modeName = option.dataset.mode;
        loadMode(modeName);

        sequence = [];
        playerSequence = [];
        clearTimeout(selectionTimer);
        gameActive = false;
        startButton.disabled = false;
        statusText.textContent = "click start to begin";
        modeDropdown.classList.add('hidden');
    });
});

document.addEventListener('click', (e) => {
    if (!modeButton.contains(e.target) && !modeDropdown.contains(e.target)) {
        modeDropdown.classList.add('hidden');
    }
});

// Initialize game
loadMode('normal');