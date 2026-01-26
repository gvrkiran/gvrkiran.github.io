/**
 * Personalization Lite
 * Lightweight personalization for non-home pages
 * Applies theme and basic personalization without welcome animation
 */

(async function initializePersonalizationLite() {
  'use strict';

  try {
    // Check if full personalization engine is available
    if (typeof PersonalizationEngine === 'undefined') {
      // Fallback: just apply theme from localStorage
      applyStoredTheme();
      return;
    }

    // Initialize personalization engine
    const context = await PersonalizationEngine.initialize();

    // Apply theme only (no welcome animation on subpages)
    PersonalizationEngine.applyToDOM();

    // Initialize ambient background if available
    if (typeof AmbientBackground !== 'undefined' && context.geo) {
      AmbientBackground.initialize(context.geo.country_code);
    }

    // Record visit (but quietly)
    if (typeof ReturningVisitor !== 'undefined') {
      ReturningVisitor.recordVisit(context);
    }

    // Mark as ready
    document.body.classList.add('personalized');

  } catch (error) {
    console.error('Personalization lite failed:', error);
    applyStoredTheme();
  }

  function applyStoredTheme() {
    // Try to apply theme from localStorage
    try {
      const themeOverride = localStorage.getItem('theme_override');
      if (themeOverride) {
        document.documentElement.setAttribute('data-theme', themeOverride);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'night-clear' : 'day-clear');
      }
    } catch {
      document.documentElement.setAttribute('data-theme', 'day-clear');
    }
    document.body.classList.add('personalized');
  }
})();
