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

class SidebarManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.mainContent = document.querySelector('.main-content');

        this.initializeButton();
        this.setupEventListeners();
    }

    initializeButton() {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.innerHTML = '☰';
        document.body.appendChild(toggleButton);

        this.toggleButton = toggleButton;
    }

    setupEventListeners() {
        const handleToggle = debounce(() => {
            this.sidebar.classList.toggle('sidebar-collapsed');
        }, 100);

        this.toggleButton.addEventListener('click', handleToggle);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SidebarManager();
});

export default SidebarManager;