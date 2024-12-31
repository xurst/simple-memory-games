import gameModes from '../modes.js';
import { GameEvents } from './events/sequence_events.js';
import { SettingsManager } from '../settings_manager.js';


export class SequenceGame {
    constructor() {
        this.boxes = document.querySelectorAll('.game-box');
        this.statusText = document.querySelector('.status-text');
        this.modeButton = document.getElementById('modeButton');
        this.modeDropdown = document.querySelector('.mode-dropdown');
        this.startButton = document.getElementById('startButton');
        this.settingsPanel = document.querySelector('.settings-panel');
        this.settingsButton = document.getElementById('settingsButton');
        this.settingsCloseButton = document.querySelector('.settings-close');

        this.lastShownBox = null;
        this.events = new GameEvents(this);
        this.state = this.events.bindEvents();

        this.isShowingSequence = false;

        // Initialize settings manager
        this.settings = new SettingsManager(this);

        // Initialize dropdown state
        this.isDropdownVisible = false;
        this.loadMode('normal');
    }

    loadMode(modeName) {
        this.state.currentMode = JSON.parse(JSON.stringify(gameModes.sequence[modeName]));
        this.modeButton.textContent = `mode: ${modeName}`;
        this.settings.updateSettingsUI();

        this.isDropdownVisible = false;
        this.modeDropdown.style.opacity = '0';
        this.modeDropdown.style.transform = 'translateY(-10px) scaleY(0.7)';
        setTimeout(() => {
            this.modeDropdown.classList.add('hidden');
        }, 300);
    }

    startGame() {
        if (this.state.gameActive) return;
        this.state.gameActive = true;
        this.state.sequence = [];
        this.state.playerSequence = [];
        this.startButton.textContent = 'end game';
        this.startButton.disabled = true;
        this.computerTurn();
    }

    // Add a separate method for player clicks
    highlightBoxForPlayer(index, duration = this.state.currentMode.highlightTimer) {
        const boxes = document.querySelectorAll('.game-box');
        const box = boxes[index];

        box.classList.add('highlighted');
        setTimeout(() => {
            box.classList.remove('highlighted');
        }, duration);
    }

    // Renamed to make it clear this is for computer sequence
    highlightBoxInSequence(index, duration = this.state.currentMode.highlightTimer) {
        const boxes = document.querySelectorAll('.game-box');
        const box = boxes[index];

        // Check if this box is a repetition of the immediately previous box
        const isRepeated = this.lastShownBox === index;

        if (isRepeated) {
            box.classList.add('repeated');
        }

        // Update the last shown box
        this.lastShownBox = index;

        box.classList.add('highlighted');
        setTimeout(() => {
            box.classList.remove('highlighted');
            // Remove repeated class after highlight ends
            setTimeout(() => {
                box.classList.remove('repeated');
            }, 300);
        }, duration);
    }

    startSelectionTimer() {
        clearTimeout(this.state.selectionTimer);
        this.state.selectionTimer = setTimeout(() => {
            if (this.state.gameActive) {
                this.statusText.textContent = "time's up! game over! score: " + (this.state.sequence.length - 1);
                this.state.gameActive = false;
                this.state.sequence = [];
                this.startButton.disabled = false;
                this.startButton.textContent = 'start game';
            }
        }, this.state.currentMode.timerSelection);
    }

    getRandomBox() {
        if (this.state.currentMode.repetitionEnabled) {
            // For lower AI difficulties, favor choosing previous boxes
            if (Math.random() * 10 > this.state.currentMode.aiDifficulty && this.state.sequence.length > 0) {
                return this.state.sequence[Math.floor(Math.random() * this.state.sequence.length)];
            }
            return Math.floor(Math.random() * this.state.currentMode.numberOfBoxes);
        } else {
            let availableBoxes = [];
            for (let i = 0; i < this.state.currentMode.numberOfBoxes; i++) {
                if (!this.state.usedBoxesThisTurn.has(i)) {
                    availableBoxes.push(i);
                }
            }
            if (availableBoxes.length === 0) {
                this.state.usedBoxesThisTurn.clear();
                for (let i = 0; i < this.state.currentMode.numberOfBoxes; i++) {
                    availableBoxes.push(i);
                }
            }

            // For lower AI difficulties, try to maintain patterns
            if (Math.random() * 10 > this.state.currentMode.aiDifficulty && this.state.sequence.length >= 2) {
                const lastBox = this.state.sequence[this.state.sequence.length - 1];
                const pattern = lastBox - this.state.sequence[this.state.sequence.length - 2];
                const predictableNext = (lastBox + pattern) % this.state.currentMode.numberOfBoxes;

                if (predictableNext >= 0 && !this.state.usedBoxesThisTurn.has(predictableNext)) {
                    this.state.usedBoxesThisTurn.add(predictableNext);
                    return predictableNext;
                }
            }

            const newBox = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
            this.state.usedBoxesThisTurn.add(newBox);
            return newBox;
        }
    }

    computerTurn() {
        // Prevent multiple sequences from running
        if (this.isShowingSequence) return;
        this.isShowingSequence = true;

        this.state.gameActive = false;
        this.statusText.textContent = "computer's turn";
        this.startButton.disabled = true;

        // Reset last shown box at the start of computer's turn
        this.lastShownBox = null;

        // Initialize usedBoxesThisTurn if needed
        if (!this.state.currentMode.repetitionEnabled) {
            if (!this.state.usedBoxesThisTurn) {
                this.state.usedBoxesThisTurn = new Set();
            }
            // Only clear the Set if we've used ALL available boxes
            if (this.state.usedBoxesThisTurn.size >= this.state.currentMode.numberOfBoxes) {
                this.state.usedBoxesThisTurn.clear();
                // After clearing, add all sequence boxes back to prevent their reuse
                for (let box of this.state.sequence) {
                    this.state.usedBoxesThisTurn.add(box);
                }
            }
        }

        const newBox = this.getRandomBox();
        this.state.sequence.push(newBox);

        let i = 0;
        const showSequence = () => {
            if (i < this.state.sequence.length) {
                this.highlightBoxInSequence(this.state.sequence[i]);
                i++;
                setTimeout(showSequence, this.state.currentMode.speedOfSelection);
            } else {
                // Reset last shown box and sequence flag after sequence is complete
                this.lastShownBox = null;
                this.isShowingSequence = false;

                setTimeout(() => {
                    this.statusText.textContent = "your turn";
                    this.state.gameActive = true;
                    this.state.playerSequence = [];
                    this.startSelectionTimer();
                    this.startButton.disabled = false;
                }, this.state.currentMode.turnDelay);
            }
        };
        setTimeout(showSequence, 1000);
    }

    resetGame() {
        this.state.sequence = [];
        this.state.playerSequence = [];
        this.lastShownBox = null;
        this.isShowingSequence = false;  // Add this line
        if (this.state.usedBoxesThisTurn) {
            this.state.usedBoxesThisTurn.clear();
        }
        clearTimeout(this.state.selectionTimer);
        this.state.gameActive = false;
        this.startButton.disabled = false;
        this.startButton.textContent = 'start game';
        this.statusText.textContent = "click start to begin";
    }
}