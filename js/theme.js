/**
 * theme.js - Accessible Theme Toggle (Light / Dark Mode)
 * - Detects OS prefers-color-scheme
 * - Overrides via manual toggle button
 * - Persists choice in localStorage
 * - Applies theme before paint to prevent flash of wrong theme (FOUC)
 * - Updates aria-label & aria-pressed state on toggle button
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'nikil_portfolio_theme';

  // Apply theme immediately to <html> attribute
  function getPreferredTheme() {
    try {
      var savedTheme = localStorage.getItem(STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (e) {
      // localStorage may be disabled or restricted
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  var currentTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Update theme button icon and accessible state
  function updateThemeButton(theme) {
    var toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;

    var isDark = theme === 'dark';
    toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    toggleBtn.setAttribute(
      'aria-label',
      isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );
    toggleBtn.setAttribute(
      'title',
      isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );

    var iconSun = toggleBtn.querySelector('.theme-icon-sun');
    var iconMoon = toggleBtn.querySelector('.theme-icon-moon');
    var labelText = toggleBtn.querySelector('.theme-toggle-text');

    if (iconSun && iconMoon) {
      if (isDark) {
        iconSun.style.display = 'inline-block';
        iconMoon.style.display = 'none';
      } else {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'inline-block';
      }
    }

    if (labelText) {
      labelText.textContent = isDark ? 'Light' : 'Dark';
    }
  }

  // Toggle function
  function toggleTheme() {
    var activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
    var nextTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch (e) {}

    updateThemeButton(nextTheme);
  }

  // Setup after DOM is ready
  function initThemeToggle() {
    var toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      updateThemeButton(document.documentElement.getAttribute('data-theme') || 'light');
      toggleBtn.addEventListener('click', toggleTheme);
    }

    // Listen for OS theme changes if user hasn't manually chosen one
    if (window.matchMedia) {
      var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', function (e) {
        try {
          if (!localStorage.getItem(STORAGE_KEY)) {
            var newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeButton(newTheme);
          }
        } catch (err) {}
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }

  // Expose toggle globally if needed
  window.__togglePortfolioTheme = toggleTheme;
})();

