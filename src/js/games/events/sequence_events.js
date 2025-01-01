// src/js/games/events/sequence_events.js
import gameModes from '../modes.js';

export class GameEvents {
    constructor(game) {
        this.game = game;
        this.state = {
            sequence: [],
            playerSequence: [],
            gameActive: false,
            currentMode: null,
            selectionTimer: null,
            usedBoxesThisTurn: new Set(),
            tempMode: {}
        };
    }

    bindEvents() {
        this.bindBoxEvents();
        this.bindModeEvents();
        this.bindSettingsEvents();
        this.bindGameControlEvents();
        this.bindClickOutside();
        return this.state;
    }

    bindBoxEvents() {
        this.game.boxes.forEach((box, index) => {
            box.addEventListener('click', () => this.handleBoxClick(index));
        });
    }

    handleBoxClick(index) {
        if (!this.state.gameActive) return;

        this.game.highlightBoxForPlayer(index, 200);
        this.state.playerSequence.push(index);

        const currentIndex = this.state.playerSequence.length - 1;
        if (this.state.playerSequence[currentIndex] !== this.state.sequence[currentIndex]) {
            this.game.statusText.textContent = "game over! score: " + (this.state.sequence.length - 1);
            this.state.gameActive = false;
            this.state.sequence = [];
            this.game.startButton.textContent = 'start game';
            this.game.startButton.disabled = false;
            return;
        }

        this.game.startSelectionTimer();

        if (this.state.playerSequence.length === this.state.sequence.length) {
            this.state.gameActive = false;
            this.game.statusText.textContent = "correct!";
            clearTimeout(this.state.selectionTimer);
            setTimeout(() => this.game.computerTurn(), 1000);
        }
    }

    bindModeEvents() {
        this.game.modeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.state.gameActive) {
                this.game.modeButton.classList.add('disabled');
                this.game.modeButton.disabled = true
                return;
            }
            this.game.toggleDropdown();
        });

        document.querySelectorAll('.mode-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.state.gameActive) {
                    return;
                }
                const modeName = option.dataset.mode;
                this.game.loadMode(modeName);
                this.game.resetGame();
            });
        });
    }

    bindSettingsEvents() {
        const settingsButton = document.getElementById('settingsButton');
        const settingsPanel = document.querySelector('.settings-panel');

        settingsButton.addEventListener('click', () => {
            if (this.state.gameActive) {
                settingsButton.classList.add('disabled');
                this.game.modeButton.disabled = true
                return;
            }
            settingsPanel.classList.remove('hidden');
            this.game.updateSettingsUI();
        });

        document.querySelector('.settings-close').addEventListener('click', () => {
            settingsPanel.classList.add('hidden');
        });

        document.querySelectorAll('.setting-group input').forEach(input => {
            input.addEventListener('input', (e) => {
                if (this.state.gameActive) {
                    input.disabled = true;
                    return;
                }
                this.handleSettingInput(e);
            });
        });

        document.querySelector('.settings-save').addEventListener('click', () => {
            if (this.state.gameActive) {
                return;
            }
            Object.assign(this.state.currentMode, this.state.tempMode);
            settingsPanel.classList.add('hidden');
            this.game.updateVisibleBoxes();
        });

        document.querySelector('.settings-reset').addEventListener('click', () => {
            if (this.state.gameActive) {
                return;
            }
            const currentModeName = this.game.modeButton.textContent.split(': ')[1];
            this.state.tempMode = { ...gameModes.sequence[currentModeName] };
            this.game.updateSettingsUI(this.state.tempMode);

            setTimeout(() => {
                document.querySelectorAll('.setting-group input[type="range"]').forEach(input => {
                    const min = parseFloat(input.min) || 0;
                    const max = parseFloat(input.max) || 100;
                    const value = parseFloat(input.value);
                    const percentage = ((value - min) * 100) / (max - min);
                    input.style.background = `linear-gradient(to right, 
                    rgba(154, 150, 150, 0.3) 0%, 
                    rgba(175, 171, 171, 0.3) ${percentage}%, 
                    rgba(255, 255, 255, 0.05) ${percentage}%)`;
                });
            }, 50);
        });
    }

    handleSettingInput(e) {
        const settingId = e.target.id;
        if (e.target.type === 'checkbox') {
            this.state.tempMode[settingId] = e.target.checked;
            return;
        }

        let newValue = parseInt(e.target.value);
        const labelSpan = e.target.previousElementSibling?.querySelector('.setting-value');
        if (labelSpan) {
            const displayValue = this.formatSettingValue(newValue, settingId);
            labelSpan.textContent = displayValue;
        }
        this.state.tempMode[settingId] = newValue;
    }

    formatSettingValue(value, settingId) {
        if (settingId.includes('Timer') || settingId.includes('Selection') || settingId.includes('Delay')) {
            if (value >= 1000) {
                const seconds = value / 1000;
                return seconds === Math.floor(seconds) ?
                    `${seconds.toFixed(0)} s` :
                    `${seconds.toFixed(1)} s`;
            }
            return `${value} ms`;
        }
        return settingId.includes('Size') ? `${value} px` : value;
    }

    bindGameControlEvents() {
        this.game.startButton.addEventListener('click', () => {
            if (this.state.gameActive) {
                this.game.resetGame();
            } else {
                this.game.startGame();
            }
        });
    }

    bindClickOutside() {
        document.addEventListener('click', (e) => {
            if (
                !this.game.modeButton.contains(e.target) &&
                !this.game.modeDropdown.contains(e.target) &&
                this.game.isDropdownVisible
            ) {
                this.game.toggleDropdown();
            }
        });
    }
}