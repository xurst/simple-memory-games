// src/js/games/core/sequence.js
import gameModes from '../modes.js';
import { GameEvents } from '../events/sequence_events.js';
import { SettingsManager } from '../../ui/utilities/settings_manager.js';


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
        this.settings = new SettingsManager(this);
        this.isDropdownVisible = false;
        this.loadMode('normal');
    }

    loadMode(modeName) {
        if (this.state.gameActive) return;

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
        this.modeButton.classList.add('disabled');
        this.settingsButton.classList.add('disabled');
        this.modeButton.disabled = true
        this.settingsButton.disabled = true
        this.computerTurn();
    }

    highlightBoxForPlayer(index, duration = this.state.currentMode.highlightTimer) {
        const boxes = document.querySelectorAll('.game-box');
        const box = boxes[index];

        box.classList.add('highlighted');
        setTimeout(() => {
            box.classList.remove('highlighted');
        }, duration);
    }

    highlightBoxInSequence(index, duration = this.state.currentMode.highlightTimer) {
        const boxes = document.querySelectorAll('.game-box');
        const box = boxes[index];

        const isRepeated = this.lastShownBox === index;

        if (isRepeated) {
            box.classList.add('repeated');
        }

        this.lastShownBox = index;

        box.classList.add('highlighted');
        setTimeout(() => {
            box.classList.remove('highlighted');
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
                this.modeButton.disabled = false;
                this.settingsButton.disabled = false;
                this.modeButton.classList.remove('disabled');
                this.settingsButton.classList.remove('disabled');
                document.querySelectorAll('.setting-group input').forEach(input => {
                    input.disabled = false;
                });
            }
        }, this.state.currentMode.timerSelection);
    }

    getRandomBox() {
        if (this.state.currentMode.repetitionEnabled) {
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
        if (this.isShowingSequence) return;
        this.isShowingSequence = true;

        this.state.gameActive = false;
        this.statusText.textContent = "computer's turn";
        this.startButton.disabled = true;
        this.modeButton.disabled = true;
        this.startButton.disabled = true;

        this.lastShownBox = null;

        if (!this.state.currentMode.repetitionEnabled) {
            if (!this.state.usedBoxesThisTurn) {
                this.state.usedBoxesThisTurn = new Set();
            }
            if (this.state.usedBoxesThisTurn.size >= this.state.currentMode.numberOfBoxes) {
                this.state.usedBoxesThisTurn.clear();
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
        this.isShowingSequence = false;
        if (this.state.usedBoxesThisTurn) {
            this.state.usedBoxesThisTurn.clear();
        }
        clearTimeout(this.state.selectionTimer);
        this.state.gameActive = false;
        this.startButton.disabled = false;
        this.startButton.textContent = 'start game';
        this.statusText.textContent = "click start game to begin";
        this.modeButton.classList.remove('disabled');
        this.settingsButton.classList.remove('disabled');
        this.modeButton.disabled = false
        this.settingsButton.disabled = false
        document.querySelectorAll('.setting-group input').forEach(input => {
            input.disabled = false;
        });
    }
}