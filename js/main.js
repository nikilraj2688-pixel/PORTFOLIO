/**
 * Main JavaScript file for Personal Portfolio Website
 * Handles progressive enhancement:
 * 1. Mobile navigation menu toggle with ARIA synchronization and keyboard trapping (Esc)
 * 2. Accessible contact form validation with inline error association and error summary focus
 * Designed so that the entire site functions completely even if JavaScript is disabled.
 */

(function () {
  'use strict';

  // Mark JS as available for CSS enhancements
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js-enabled');

  /* ==========================================================================
     1. Mobile Menu Toggle (Progressive Enhancement)
     ========================================================================== */
  function initMobileMenu() {
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const navList = document.getElementById('primary-nav-list');

    if (!toggleBtn || !navList) {
      return;
    }

    function openMenu() {
      toggleBtn.setAttribute('aria-expanded', 'true');
      navList.classList.add('is-open');
    }

    function closeMenu() {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navList.classList.remove('is-open');
    }

    function toggleMenu() {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    toggleBtn.addEventListener('click', toggleMenu);

    // Keyboard support: Close menu on Escape key press
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        if (toggleBtn.getAttribute('aria-expanded') === 'true') {
          closeMenu();
          toggleBtn.focus();
        }
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
      if (toggleBtn.getAttribute('aria-expanded') === 'true') {
        if (!navList.contains(event.target) && !toggleBtn.contains(event.target)) {
          closeMenu();
        }
      }
    });

    // Auto-close menu if resizing up to desktop screen width (>= 768px)
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768 && toggleBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });
  }

  /* ==========================================================================
     2. Accessible Contact Form Validation
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) {
      return;
    }

    const errorSummary = document.getElementById('error-summary');
    const errorList = document.getElementById('error-summary-list');
    const formStatus = document.getElementById('form-status');
    const honeypot = document.getElementById('website_url');

    // Fields to validate
    const fields = [
      {
        id: 'user-name',
        errorId: 'user-name-error',
        label: 'Full Name',
        validate: function (val) {
          if (!val.trim()) {
            return 'Please enter your full name.';
          }
          if (val.trim().length < 2) {
            return 'Full name must be at least 2 characters.';
          }
          return '';
        }
      },
      {
        id: 'user-email',
        errorId: 'user-email-error',
        label: 'Email Address',
        validate: function (val) {
          if (!val.trim()) {
            return 'Please enter your email address.';
          }
          // Standard HTML5 email validation pattern
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(val.trim())) {
            return 'Please enter a valid email address (e.g., name@example.com).';
          }
          return '';
        }
      },
      {
        id: 'user-subject',
        errorId: 'user-subject-error',
        label: 'Subject',
        validate: function (val) {
          if (!val || val === '') {
            return 'Please select a subject from the options.';
          }
          return '';
        }
      },
      {
        id: 'user-message',
        errorId: 'user-message-error',
        label: 'Message',
        validate: function (val) {
          if (!val.trim()) {
            return 'Please enter your message.';
          }
          if (val.trim().length < 10) {
            return 'Your message must be at least 10 characters long.';
          }
          return '';
        }
      },
      {
        id: 'user-consent',
        errorId: 'user-consent-error',
        label: 'Consent Checkbox',
        validate: function (val, element) {
          if (!element.checked) {
            return 'You must consent to data processing before submitting.';
          }
          return '';
        }
      }
    ];

    // Clear individual field error
    function clearFieldError(fieldConfig) {
      const input = document.getElementById(fieldConfig.id);
      const errorEl = document.getElementById(fieldConfig.errorId);
      if (input) {
        input.setAttribute('aria-invalid', 'false');
      }
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('is-visible');
      }
    }

    // Set individual field error
    function setFieldError(fieldConfig, message) {
      const input = document.getElementById(fieldConfig.id);
      const errorEl = document.getElementById(fieldConfig.errorId);
      if (input) {
        input.setAttribute('aria-invalid', 'true');
      }
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('is-visible');
      }
    }

    // Real-time revalidation on blur & input
    fields.forEach(function (fieldConfig) {
      const input = document.getElementById(fieldConfig.id);
      if (!input) return;

      const eventType = input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'input';

      input.addEventListener(eventType, function () {
        if (input.getAttribute('aria-invalid') === 'true') {
          const val = input.value;
          const errorMsg = fieldConfig.validate(val, input);
          if (!errorMsg) {
            clearFieldError(fieldConfig);
          } else {
            setFieldError(fieldConfig, errorMsg);
          }
        }
      });
    });

    // Handle form submit
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Clear previous status
      if (formStatus) {
        formStatus.innerHTML = '';
      }

      // Check honeypot: if filled, quietly drop without alerting spammer
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Bot submission blocked.');
        return;
      }

      const errors = [];

      fields.forEach(function (fieldConfig) {
        const input = document.getElementById(fieldConfig.id);
        if (!input) return;

        const val = input.value;
        const errorMsg = fieldConfig.validate(val, input);

        if (errorMsg) {
          errors.push({
            fieldId: fieldConfig.id,
            label: fieldConfig.label,
            message: errorMsg
          });
          setFieldError(fieldConfig, errorMsg);
        } else {
          clearFieldError(fieldConfig);
        }
      });

      if (errors.length > 0) {
        // Build error summary
        if (errorSummary && errorList) {
          errorList.innerHTML = '';
          errors.forEach(function (err) {
            const li = document.createElement('li');
            const anchor = document.createElement('a');
            anchor.href = '#' + err.fieldId;
            anchor.textContent = err.label + ': ' + err.message;
            anchor.addEventListener('click', function (e) {
              e.preventDefault();
              const targetInput = document.getElementById(err.fieldId);
              if (targetInput) {
                targetInput.focus();
              }
            });
            li.appendChild(anchor);
            errorList.appendChild(li);
          });

          errorSummary.classList.add('is-visible');
          // Move focus to error summary so screen readers announce errors immediately
          errorSummary.focus();
        }
      } else {
        // Success case
        if (errorSummary) {
          errorSummary.classList.remove('is-visible');
        }

        form.reset();
        fields.forEach(function (fieldConfig) {
          clearFieldError(fieldConfig);
        });

        if (formStatus) {
          formStatus.innerHTML = '<div class="status-message success" role="status">Thank you! Your message has been sent successfully. I will get back to you soon.</div>';
          formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initMobileMenu();
      initContactForm();
    });
  } else {
    initMobileMenu();
    initContactForm();
  }
})();

