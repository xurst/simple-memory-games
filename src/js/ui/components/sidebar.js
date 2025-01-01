// sidebar.js
export class SidebarManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.mainContent = document.querySelector('.main-content');
        this.toggleButtons = document.querySelectorAll('.toggle-button');

        this.setupEventListeners();
        this.initializeState();
    }

    initializeState() {
        this.sidebar.classList.remove('sidebar-collapsed');
        this.mainContent.classList.remove('full-width');
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('sidebar-collapsed');
        this.mainContent.classList.toggle('full-width');
    }

    setupEventListeners() {
        this.toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSidebar();
            });
        });

        window.addEventListener('resize', debounce(() => {
            this.initializeState();
        }, 250));
    }
}

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