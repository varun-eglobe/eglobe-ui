/**
 * eGlobe UI Tabs Logic
 * Handles tab switching interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    const tabLinks = document.querySelectorAll('[data-eg-ui-toggle="tab"]');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSelector = link.getAttribute('href') || link.getAttribute('data-target');

            if (!targetSelector) return;

            // Find the parent nav to deactivate siblings
            const parentNav = link.closest('.eg-ui-nav');
            if (parentNav) {
                parentNav.querySelectorAll('.eg-ui-nav-link').forEach(sibling => {
                    sibling.classList.remove('active');
                    sibling.setAttribute('aria-selected', 'false');
                });
            }

            // Activate clicked link
            link.classList.add('active');
            link.setAttribute('aria-selected', 'true');

            // Find target pane
            const targetPane = document.querySelector(targetSelector);
            if (targetPane) {
                // Find parent tab-content to hide sibling panes
                const parentContent = targetPane.closest('.eg-ui-tab-content');
                if (parentContent) {
                    parentContent.querySelectorAll('.eg-ui-tab-pane').forEach(pane => {
                        pane.classList.remove('active');
                    });
                }

                // Activate target pane
                targetPane.classList.add('active');
            }
        });
    });
});
