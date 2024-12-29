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
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('sidebar-collapsed'));
    }, 100);

    toggleButton.addEventListener('click', handleToggle);

    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('sidebar-collapsed');
        mainContent.classList.add('full-width');
    }
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
    document.getElementById('repetitionDelay').value = currentMode.repetitionDelay;

    // Update displayed values with 'ms' suffix
    document.getElementById('highlightValue').textContent = `${currentMode.highlightTimer} ms`;
    document.getElementById('timerValue').textContent = `${currentMode.timerSelection} ms`;
    document.getElementById('speedValue').textContent = `${currentMode.speedOfSelection} ms`;
    document.getElementById('delayValue').textContent = `${currentMode.turnDelay} ms`;
    document.getElementById('repetitionDelayValue').textContent = currentMode.repetitionDelay;
}

function loadMode(modeName) {
    currentMode = gameModes.sequence[modeName];
    if (!currentMode.repetitionEnabled) currentMode.repetitionEnabled = false;
    if (!currentMode.repetitionDelay) currentMode.repetitionDelay = 0;
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
    if (!currentMode.repetitionEnabled || usedBoxesThisTurn.size >= 9) {
        return Math.floor(Math.random() * 9);
    }

    let availableBoxes = [];
    for (let i = 0; i < 9; i++) {
        if (!usedBoxesThisTurn.has(i)) {
            availableBoxes.push(i);
        }
    }

    return availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
}

function computerTurn() {
    gameActive = false;
    statusText.textContent = "computer's turn";
    usedBoxesThisTurn.clear(); // Clear used boxes at start of turn
    const newBox = getRandomBox();
    usedBoxesThisTurn.add(newBox);
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
        const settingName = e.target.id.replace('Timer', '');
        const newValue = e.target.value;

        // Find and update the label text
        const label = e.target.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            const labelPrefix = label.textContent.split(':')[0];
            label.innerHTML = `${labelPrefix}: <span class="setting-value" id="${e.target.id}Value">${newValue} ms</span>`;
        }

        currentMode[e.target.id] = parseInt(newValue);
    });
});

document.querySelector('.settings-save').addEventListener('click', () => {
    document.querySelector('.settings-panel').classList.add('hidden');
});

document.querySelector('.settings-reset').addEventListener('click', () => {
    const currentModeName = modeButton.textContent.split(': ')[1];
    localStorage.removeItem(`sequenceSettings_${currentModeName}`);
    loadMode(currentModeName);
});

startButton.addEventListener('click', startGame);

modeButton.addEventListener('click', () => {
    modeDropdown.classList.toggle('hidden');
});

document.querySelectorAll('.mode-option').forEach(option => {
    option.addEventListener('click', () => {
        const modeName = option.dataset.mode;
        localStorage.setItem('sequenceGameMode', modeName);
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
loadMode(localStorage.getItem('sequenceGameMode') || 'normal');