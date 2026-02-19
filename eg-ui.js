/**
 * eGlobe UI Main JavaScript
 * Consolidates all library components (Modals, Tabs, Toasts) into a single entry point.
 */

/* ==========================================================================
   Modals
   ========================================================================== */

function openModal(modalId) {
    const modal = document.getElementById(modalId || 'egModal');
    if (modal) {
        modal.classList.add('eg-ui-modal--open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId || 'egModal');
    if (modal) {
        modal.classList.remove('eg-ui-modal--open');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

/* ==========================================================================
   Toasts
   ========================================================================== */

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

/* ==========================================================================
   Global Event Listeners (Tabs & Shared Behaviors)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- Modals ---
    const modals = document.querySelectorAll('.eg-ui-modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('eg-ui-modal__overlay') || e.target.classList.contains('eg-ui-modal')) {
                closeModal(modal.id);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.eg-ui-modal--open');
            openModals.forEach(modal => closeModal(modal.id));
        }
    });

    // --- Tabs ---
    const tabLinks = document.querySelectorAll('[data-eg-ui-toggle="tab"]');
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSelector = link.getAttribute('href') || link.getAttribute('data-target');
            if (!targetSelector) return;

            const parentNav = link.closest('.eg-ui-nav');
            if (parentNav) {
                parentNav.querySelectorAll('.eg-ui-nav-link').forEach(sibling => {
                    sibling.classList.remove('active');
                    sibling.setAttribute('aria-selected', 'false');
                });
            }

            link.classList.add('active');
            link.setAttribute('aria-selected', 'true');

            const targetPane = document.querySelector(targetSelector);
            if (targetPane) {
                const parentContent = targetPane.closest('.eg-ui-tab-content');
                if (parentContent) {
                    parentContent.querySelectorAll('.eg-ui-tab-pane').forEach(pane => {
                        pane.classList.remove('active');
                    });
                }
                targetPane.classList.add('active');
            }
        });
    });
});
