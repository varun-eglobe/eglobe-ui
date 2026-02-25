/**
 * eGlobe UI Toast Logic
 * Handles dynamic toast notifications.
 */

const egToast = {
    containers: {},

    /**
     * Initialize a toast container for a specific position
     * @param {string} position
     */
    _initContainer(position) {
        if (!this.containers[position]) {
            const container = document.createElement('div');
            container.className = `eg-ui-toast-container eg-ui-toast-container--${position}`;

            const appContainer = document.querySelector('.eg-ui-app') || document.body;
            appContainer.appendChild(container);
            this.containers[position] = container;
        }
        return this.containers[position];
    },

    /**
     * Show a toast notification
     * @param {Object} options - Toast options
     * @param {string} options.message - The message to display
     * @param {string} options.type - 'success', 'info', 'warning', 'danger' (default: 'info')
     * @param {string} options.position - 'top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center' (default: 'top-right')
     * @param {number} options.duration - Duration in ms (default: 3000)
     * @param {boolean} options.showClose - Whether to show a close button and disable auto-hide (default: false)
     */
    show({ message = '', type = 'info', position = 'top-right', duration = 3000, showClose = false }) {
        const container = this._initContainer(position);

        const toast = document.createElement('div');
        toast.className = `eg-ui-toast eg-ui-toast--${type}`;

        let icon = '';
        switch (type) {
            case 'success': icon = '✓'; break;
            case 'warning': icon = '⚠'; break;
            case 'danger': icon = '✕'; break;
            case 'info': icon = 'ℹ'; break;
        }

        let closeBtnHtml = '';
        if (showClose) {
            closeBtnHtml = `<button class="eg-ui-toast__close" aria-label="Close">&times;</button>`;
        }

        toast.innerHTML = `
      <div class="eg-ui-toast__inner">
        <span class="eg-ui-toast__icon">${icon}</span>
        <span class="eg-ui-toast__message">${message}</span>
      </div>
      ${closeBtnHtml}
    `;

        container.appendChild(toast);

        // Trigger entry animation
        requestAnimationFrame(() => {
            toast.classList.add('eg-ui-toast--show');
        });

        // If showClose is enabled, add click listener and skip auto-hide
        if (showClose) {
            const closeBtn = toast.querySelector('.eg-ui-toast__close');
            closeBtn.addEventListener('click', () => this.hide(toast));
        } else {
            // Auto-remove after duration
            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }
    },

    /**
     * Remove a toast with animation
     * @param {HTMLElement} toast - The toast element to remove
     */
    hide(toast) {
        toast.classList.remove('eg-ui-toast--show');
        toast.addEventListener('transitionend', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, { once: true });
    }
};
