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

function checkAndAddEgUiAppClass() {
    if (!document.body) return;

    // If class already exists, no need to check again
    if (document.body.classList.contains('eg-ui-app')) {
        return;
    }

    // If this script is loaded, the app is definitely installed
    // Also check for other indicators
    const isAppInstalled =
        // This script itself indicates the app is installed
        true ||
        // Check for loaded CSS files
        Array.from(document.styleSheets).some(sheet => {
            try {
                return sheet.href && (
                    sheet.href.includes('eg-ui.css') ||
                    sheet.href.includes('mealbot') ||
                    sheet.href.includes('eg-ui-')
                );
            } catch (e) {
                return false;
            }
        }) ||
        // Check for link tags
        document.querySelector('link[href*="eg-ui.css"]') ||
        document.querySelector('link[href*="mealbot"]') ||
        // Check for mealbot elements
        document.querySelector('.mealbot-modal-trigger') ||
        document.querySelector('.mealbot-cart-selections') ||
        document.querySelector('#mealbotOptionsModal') ||
        document.querySelector('[class*="mealbot"]') ||
        // Check for eg-ui elements
        document.querySelector('.eg-ui-modal') ||
        document.querySelector('[class*="eg-ui"]');

    if (isAppInstalled) {
        document.body.classList.add('eg-ui-app');
    }
}

// Run immediately if body is available, otherwise wait
if (document.body) {
    checkAndAddEgUiAppClass();
} else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndAddEgUiAppClass);
} else {
    setTimeout(checkAndAddEgUiAppClass, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    // Re-check and add class on DOMContentLoaded (in case body wasn't ready earlier)
    checkAndAddEgUiAppClass();

    // Also check after a delay to catch dynamically loaded stylesheets
    setTimeout(checkAndAddEgUiAppClass, 100);

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

    // --- Popovers ---
    const popoverTriggers = document.querySelectorAll('[data-eg-ui-toggle="popover"]');
    popoverTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = trigger.getAttribute('data-target') || trigger.getAttribute('href')?.substring(1);
            const popover = document.getElementById(targetId);

            if (popover) {
                const isOpen = popover.classList.contains('eg-ui-popover--open');

                // Close all other popovers first
                document.querySelectorAll('.eg-ui-popover--open').forEach(p => {
                    if (p !== popover) p.classList.remove('eg-ui-popover--open');
                });

                popover.classList.toggle('eg-ui-popover--open', !isOpen);
            }
        });
    });

    // --- Dropdowns ---
    const dropdownTriggers = document.querySelectorAll('[data-eg-ui-toggle="dropdown"]');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parent = trigger.closest('.eg-ui-dropdown');
            if (!parent) return;

            const isOpen = parent.classList.contains('eg-ui-dropdown--open');

            // Close all other dropdowns and popovers
            document.querySelectorAll('.eg-ui-dropdown--open').forEach(d => {
                if (d !== parent) d.classList.remove('eg-ui-dropdown--open');
            });
            document.querySelectorAll('.eg-ui-popover--open').forEach(p => {
                p.classList.remove('eg-ui-popover--open');
            });

            parent.classList.toggle('eg-ui-dropdown--open', !isOpen);
        });
    });

    // Close on click outside or item click
    document.addEventListener('click', (e) => {
        // Popovers
        if (!e.target.closest('.eg-ui-popover') && !e.target.closest('[data-eg-ui-toggle="popover"]')) {
            document.querySelectorAll('.eg-ui-popover--open').forEach(p => {
                p.classList.remove('eg-ui-popover--open');
            });
        }

        // Dropdowns
        if (!e.target.closest('.eg-ui-dropdown')) {
            document.querySelectorAll('.eg-ui-dropdown--open').forEach(d => {
                d.classList.remove('eg-ui-dropdown--open');
            });
        }

        // Close dropdown when an item is clicked
        if (e.target.classList.contains('eg-ui-dropdown-item')) {
            const parent = e.target.closest('.eg-ui-dropdown');
            if (parent) parent.classList.remove('eg-ui-dropdown--open');
        }
    });
});

// --- Accordions ---
document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.eg-ui-accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.eg-ui-accordion-item');
            const accordion = header.closest('.eg-ui-accordion');
            const collapse = item.querySelector('.eg-ui-accordion-collapse');
            const isActive = item.classList.contains('eg-ui-accordion-item--active');

            // Handle mutual exclusivity (standard accordion behavior)
            if (!isActive && accordion && !accordion.hasAttribute('data-eg-ui-always-open')) {
                const activeItems = accordion.querySelectorAll('.eg-ui-accordion-item--active');
                activeItems.forEach(activeItem => {
                    activeItem.classList.remove('eg-ui-accordion-item--active');
                    const activeCollapse = activeItem.querySelector('.eg-ui-accordion-collapse');
                    if (activeCollapse) activeCollapse.style.height = '0px';
                });
            }

            // Toggle current item
            if (isActive) {
                item.classList.remove('eg-ui-accordion-item--active');
                collapse.style.height = '0px';
            } else {
                item.classList.add('eg-ui-accordion-item--active');
                collapse.style.height = collapse.scrollHeight + 'px';
            }
        });
    });

    // Handle initial state for active items (if any)
    document.querySelectorAll('.eg-ui-accordion-item--active .eg-ui-accordion-collapse').forEach(collapse => {
        collapse.style.height = collapse.scrollHeight + 'px';
    });
});
