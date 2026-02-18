/**
 * eGlobe UI Modal Logic
 * Handles opening, closing, and accessibility features for modals.
 * Generic library implementation.
 */

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

// Global Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Close modal when clicking outside content (on overlay)
  const modals = document.querySelectorAll('.eg-ui-modal');
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      // If the click is on the overlay (the container itself or the explicit overlay div)
      if (e.target.classList.contains('eg-ui-modal__overlay') || e.target.classList.contains('eg-ui-modal')) {
        closeModal(modal.id);
      }
    });
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.eg-ui-modal--open');
      openModals.forEach(modal => closeModal(modal.id));
    }
  });
});