// records_settings.js
export class RecordsSettingsManager {
    constructor() {
        this.currentOpenPanel = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Settings toggle buttons
        document.querySelectorAll('.settings-toggle').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const entryId = button.getAttribute('data-entry');
                this.toggleSettingsPanel(entryId);
            });
        });

        // Close buttons
        document.querySelectorAll('.settings-close').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeCurrentPanel();
            });
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.settings-panel') && !e.target.closest('.settings-toggle')) {
                this.closeCurrentPanel();
            }
        });

        // Prevent panel click from closing
        document.querySelectorAll('.settings-panel').forEach(panel => {
            panel.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    toggleSettingsPanel(entryId) {
        const panel = document.querySelector(`.settings-panel[data-panel="${entryId}"]`);

        if (this.currentOpenPanel && this.currentOpenPanel !== panel) {
            this.currentOpenPanel.classList.add('hidden');
        }

        if (panel) {
            const isHidden = panel.classList.contains('hidden');
            panel.classList.toggle('hidden');
            this.currentOpenPanel = isHidden ? panel : null;
        }
    }

    closeCurrentPanel() {
        if (this.currentOpenPanel) {
            this.currentOpenPanel.classList.add('hidden');
            this.currentOpenPanel = null;
        }
    }
}