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
        this.isSettingsVisible = false;
        this.settingsButton.classList.remove('active');
    }

    toggleSettings() {
        if (this.isSettingsVisible) {
            this.closeSettings();
        } else {
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
            'highlightTimer': ['value', 'highlightValue', ' ms'],
            'timerSelection': ['value', 'timerValue', ' ms'],
            'speedOfSelection': ['value', 'speedValue', ' ms'],
            'turnDelay': ['value', 'delayValue', ' ms'],
            'repetitionEnabled': ['checked', null, ''],
            'aiDifficulty': ['value', 'aiDifficultyValue', ''],
            'numberOfBoxes': ['value', 'numberOfBoxesValue', ''],
            'boxesGrid': ['value', 'boxesGridValue', ''],
            'boxesSize': ['value', 'boxesSizeValue', ' px']
        };

        for (const [setting, [prop, labelId, suffix]] of Object.entries(settingInputs)) {
            const input = document.getElementById(setting);
            if (input) {
                input[prop] = targetMode[setting];
                if (labelId) {
                    const label = document.getElementById(labelId);
                    if (label) {
                        const valueSuffix = setting.includes('Timer') || setting.includes('Selection') || setting.includes('Delay') ? ' ms' :
                            setting.includes('Size') ? ' px' : '';
                        label.textContent = `${targetMode[setting]}${valueSuffix}`;
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
        this.settingsButton.addEventListener('click', () => this.toggleSettings());
        this.settingsCloseButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeSettings();
        });

        document.addEventListener('click', (e) => {
            if (this.isSettingsVisible &&
                !this.settingsPanel.contains(e.target) &&
                !this.settingsButton.contains(e.target)) {
                this.closeSettings();
            }
        });

        document.querySelector('.settings-save').addEventListener('click', () => {
            Object.assign(this.game.state.currentMode, this.game.state.tempMode);
            this.updateGridLayout(this.game.state.currentMode);
            this.settingsPanel.classList.add('hidden');
            this.isSettingsVisible = false;
            this.settingsButton.classList.remove('active');
        });
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