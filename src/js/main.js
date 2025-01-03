// src/js/main.js
import { SequenceGame } from './games/core/sequence.js';
import { SidebarManager } from './ui/components/sidebar.js';
import { RecordsSettingsManager } from './ui/views/records_settings.js';

document.addEventListener('DOMContentLoaded', () => {
    new SidebarManager();

    if (document.querySelector('.game-logs-container')) {
        new RecordsSettingsManager();
    }

    const game = new SequenceGame();

    const updateRangeProgress = (input) => {
        const min = input.min || 0;
        const max = input.max || 100;
        const value = input.value;
        const percentage = ((value - min) * 100) / (max - min);
        input.style.background = `linear-gradient(to right, 
            rgba(154, 150, 150, 0.3) 0%, 
            rgba(175, 171, 171, 0.3) ${percentage}%, 
            rgba(255, 255, 255, 0.05) ${percentage}%)`;
    };

    const rangeInputs = document.querySelectorAll('.setting-group input[type="range"]');
    rangeInputs.forEach(input => {
        updateRangeProgress(input);
        input.addEventListener('input', () => updateRangeProgress(input));
    });

    const settingsButton = document.getElementById('settingsButton');
    const settingsPanel = document.querySelector('.settings-panel');
    settingsButton.addEventListener('click', () => {
        setTimeout(() => {
            rangeInputs.forEach(input => updateRangeProgress(input));
        }, 0);
    });
});