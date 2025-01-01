// settings_manager.js
export class SettingsManager {
    constructor(game) {
        this.game = game;
        this.settingsPanel = game.settingsPanel;
        this.settingsButton = game.settingsButton;
        this.settingsCloseButton = game.settingsCloseButton;
        this.modeButton = game.modeButton;
        this.modeDropdown = game.modeDropdown;
        this.isSettingsVisible = false;
        this.isDropdownVisible = false;
        this.lastToggleTime = 0;

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.updateSettingsUI = this.updateSettingsUI.bind(this);
        this.updateVisibleBoxes = this.updateVisibleBoxes.bind(this);

        this.game.toggleDropdown = this.toggleDropdown;
        this.game.updateSettingsUI = this.updateSettingsUI;
        this.game.updateVisibleBoxes = this.updateVisibleBoxes;

        this.initializeSettingsEvents();
    }

    closeSettings() {
        if (!this.isSettingsVisible) return;
        this.settingsPanel.classList.add('hidden');
        setTimeout(() => {
            this.isSettingsVisible = false;
            this.settingsButton.classList.remove('active');
        }, 300);    
    }

    toggleSettings() {
        if (this.isSettingsVisible) {
            this.closeSettings();
        } else {
            this.settingsPanel.style.display = 'block';
            this.settingsPanel.classList.remove('hidden');
            this.isSettingsVisible = true;
            this.settingsButton.classList.add('active');
        }
    }

    toggleDropdown() {
        const now = Date.now();
        if (now - this.lastToggleTime < 300) return;
        this.lastToggleTime = now;

        if (this.isDropdownVisible) {
            this.modeDropdown.style.opacity = '0';
            this.modeDropdown.style.transform = 'translateY(-10px) scaleY(0.7)';
            setTimeout(() => {
                this.modeDropdown.classList.add('hidden');
            }, 300);
        } else {
            this.modeDropdown.classList.remove('hidden');
            void this.modeDropdown.offsetWidth;
            this.modeDropdown.style.opacity = '1';
            this.modeDropdown.style.transform = 'translateY(0) scaleY(1)';
        }

        this.isDropdownVisible = !this.isDropdownVisible;
    }

    updateSettingsUI(targetMode = this.game.state.currentMode) {
        const settingInputs = {
            'highlightTimer': ['value', 'highlightValue'],
            'timerSelection': ['value', 'timerValue'],
            'speedOfSelection': ['value', 'speedValue'],
            'turnDelay': ['value', 'delayValue'],
            'repetitionEnabled': ['checked', null],
            'aiDifficulty': ['value', 'aiDifficultyValue'],
            'numberOfBoxes': ['value', 'numberOfBoxesValue'],
            'boxesGrid': ['value', 'boxesGridValue'],
            'boxesSize': ['value', 'boxesSizeValue']
        };

        for (const [setting, [prop, labelId]] of Object.entries(settingInputs)) {
            const input = document.getElementById(setting);
            const textInput = document.getElementById(`${setting}Text`);

            if (input) {
                input[prop] = targetMode[setting];
                if (textInput) {
                    textInput.value = targetMode[setting];
                }
                if (labelId) {
                    const label = document.getElementById(labelId);
                    if (label) {
                        const value = targetMode[setting];
                        if (setting.includes('Timer') || setting.includes('Selection') || setting.includes('Delay')) {
                            if (value >= 1000) {
                                const seconds = value / 1000;
                                label.textContent = seconds === Math.floor(seconds) ?
                                    `${seconds.toFixed(0)} s` :
                                    `${seconds.toFixed(1)} s`;
                            } else {
                                label.textContent = `${value} ms`;
                            }
                        } else {
                            const suffix = setting.includes('Size') ? ' px' : '';
                            label.textContent = `${value}${suffix}`;
                        }
                    }
                }
            }
        }

        this.updateGridLayout(targetMode);
        this.game.state.tempMode = { ...targetMode };
        this.updateVisibleBoxes();
    }

    updateGridLayout(mode) {
        const gameGrid = document.querySelector('.game-grid');
        if (gameGrid) {
            gameGrid.style.gridTemplateColumns = `repeat(${mode.boxesGrid}, ${mode.boxesSize}px)`;
            gameGrid.style.gridAutoRows = `${mode.boxesSize}px`;
        }
    }

    initializeSettingsEvents() {
        const settingGroups = document.querySelectorAll('.setting-group');
        this.settingsButton.addEventListener('click', () => this.toggleSettings());
        this.settingsCloseButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeSettings();
        });

        settingGroups.forEach((group, index) => {
            group.style.setProperty('--index', index);
        });

        document.addEventListener('click', (e) => {
            if (this.isSettingsVisible &&
                !this.settingsPanel.contains(e.target) &&
                !this.settingsButton.contains(e.target)) {
                this.closeSettings();
            }
        });

        const rangeInputs = document.querySelectorAll('.setting-group input[type="range"]');
        const textInputs = document.querySelectorAll('.setting-group input[type="number"]');

        rangeInputs.forEach(input => {
            const textInput = document.getElementById(`${input.id}Text`);
            input.addEventListener('input', (e) => {
                if (textInput) {
                    textInput.value = e.target.value;
                }
                const labelSpan = input.closest('.setting-group').querySelector('.setting-value');
                if (labelSpan) {
                    const value = parseInt(e.target.value);
                    const settingId = e.target.id;
                    if (settingId.includes('Timer') || settingId.includes('Selection') || settingId.includes('Delay')) {
                        if (value >= 1000) {
                            const seconds = value / 1000;
                            labelSpan.textContent = seconds === Math.floor(seconds) ?
                                `${seconds.toFixed(0)} s` :
                                `${seconds.toFixed(1)} s`;
                        } else {
                            labelSpan.textContent = `${value} ms`;
                        }
                    } else {
                        const suffix = settingId.includes('Size') ? ' px' : '';
                        labelSpan.textContent = `${value}${suffix}`;
                    }
                }
                this.handleSettingInput(e);
            });
        });

        textInputs.forEach(input => {
            const rangeInput = document.getElementById(input.id.replace('Text', ''));
            input.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value >= parseFloat(input.min) && value <= parseFloat(input.max)) {
                    if (rangeInput) {
                        const step = parseFloat(rangeInput.step) || 1;
                        const roundedValue = Math.round(value / step) * step;
                        rangeInput.value = roundedValue;

                        const min = parseFloat(rangeInput.min) || 0;
                        const max = parseFloat(rangeInput.max) || 100;
                        const percentage = ((value - min) * 100) / (max - min);
                        rangeInput.style.background = `linear-gradient(to right, 
                    rgba(154, 150, 150, 0.3) 0%, 
                    rgba(175, 171, 171, 0.3) ${percentage}%, 
                    rgba(255, 255, 255, 0.05) ${percentage}%)`;

                        const labelSpan = rangeInput.closest('.setting-group').querySelector('.setting-value');
                        if (labelSpan) {
                            const settingId = rangeInput.id;
                            if (settingId.includes('Timer') || settingId.includes('Selection') || settingId.includes('Delay')) {
                                if (value >= 1000) {
                                    const seconds = value / 1000;
                                    labelSpan.textContent = seconds === Math.floor(seconds) ?
                                        `${seconds.toFixed(0)} s` :
                                        `${seconds.toFixed(1)} s`;
                                } else {
                                    labelSpan.textContent = `${value} ms`;
                                }
                            } else {
                                const suffix = settingId.includes('Size') ? ' px' : '';
                                labelSpan.textContent = `${value}${suffix}`;
                            }
                        }
                        this.game.state.tempMode[rangeInput.id] = value;
                    }
                }
            });

            input.addEventListener('change', (e) => {
                const value = parseFloat(e.target.value);
                let finalValue = value;
                if (isNaN(value) || value < parseFloat(input.min)) {
                    finalValue = parseFloat(input.min);
                } else if (value > parseFloat(input.max)) {
                    finalValue = parseFloat(input.max);
                }
                input.value = finalValue;
                const rangeInput = document.getElementById(input.id.replace('Text', ''));
                if (rangeInput) {
                    const step = parseFloat(rangeInput.step) || 1;
                    const roundedValue = Math.round(finalValue / step) * step;
                    rangeInput.value = roundedValue;

                    const min = parseFloat(rangeInput.min) || 0;
                    const max = parseFloat(rangeInput.max) || 100;
                    const percentage = ((finalValue - min) * 100) / (max - min);
                    rangeInput.style.background = `linear-gradient(to right, 
                rgba(154, 150, 150, 0.3) 0%, 
                rgba(175, 171, 171, 0.3) ${percentage}%, 
                rgba(255, 255, 255, 0.05) ${percentage}%)`;

                    const event = new Event('input', { bubbles: true });
                    e.target.dispatchEvent(event);
                }
            });
        });

        document.querySelector('.settings-save').addEventListener('click', () => {
            Object.assign(this.game.state.currentMode, this.game.state.tempMode);
            this.updateGridLayout(this.game.state.currentMode);
            this.settingsPanel.classList.add('hidden');
            this.isSettingsVisible = false;
            this.settingsButton.classList.remove('active');
        });
    }

    handleSettingInput(e) {
        const settingId = e.target.id;
        if (e.target.type === 'checkbox') {
            this.game.state.tempMode[settingId] = e.target.checked;
            return;
        }

        let newValue = parseInt(e.target.value);
        if (!isNaN(newValue)) {
            const labelSpan = e.target.closest('.setting-group').querySelector('.setting-value');
            if (labelSpan) {
                if (settingId.includes('Timer') || settingId.includes('Selection') || settingId.includes('Delay')) {
                    if (newValue >= 1000) {
                        const seconds = newValue / 1000;
                        labelSpan.textContent = seconds === Math.floor(seconds) ?
                            `${seconds.toFixed(0)} s` :
                            `${seconds.toFixed(1)} s`;
                    } else {
                        labelSpan.textContent = `${newValue} ms`;
                    }
                } else {
                    const suffix = settingId.includes('Size') ? ' px' : '';
                    labelSpan.textContent = `${newValue}${suffix}`;
                }
            }
            this.game.state.tempMode[settingId] = newValue;
        }
    }

    updateVisibleBoxes() {
        const gameGrid = document.querySelector('.game-grid');
        const allBoxes = document.querySelectorAll('.game-box');

        allBoxes.forEach(box => box.remove());

        for (let i = 0; i < Math.max(this.game.state.currentMode.numberOfBoxes, 16); i++) {
            const box = document.createElement('div');
            box.className = 'game-box';
            if (i >= this.game.state.currentMode.numberOfBoxes) {
                box.classList.add('hidden');
            }
            box.addEventListener('click', () => this.game.events.handleBoxClick(i));
            gameGrid.appendChild(box);
        }
    }
}