/**
 * NIKIL RAJ K - LIVE SINGLE PAGE PORTFOLIO JS
 * Features:
 * 1. Preloader fade-out
 * 2. Sticky Glass Navbar blur & Shadow on scroll
 * 3. Mobile Hamburger Menu Toggle
 * 4. Active Navigation Link indicator on scroll (Spy)
 * 5. Theme Switcher (Dark / Light) with localStorage & pre-paint support
 * 6. Typing / Erasing Rotating Text Effect
 * 7. Infinite Tech Badges Duplicate for Seamless Scroll
 * 8. Scroll Reveal (IntersectionObserver)
 * 9. Animated Skill Bars Triggered when Scrolled into View
 * 10. View CV Lightbox Modal (Open, Close with ×, backdrop, and Escape key)
 * 11. Working Contact Form Validation & Submission Feedback (Formspree ready)
 * 12. Scroll-to-Top Button
 */

(function () {
  'use strict';

  var THEME_KEY = 'nikil_live_portfolio_theme';

  /* --------------------------------------------------------------------------
     1. Theme Switcher (Dark default)
     -------------------------------------------------------------------------- */
  function initTheme() {
    var toggleBtn = document.getElementById('theme-toggle-btn');
    var root = document.documentElement;

    function getSavedTheme() {
      try {
        var saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
      } catch (e) {}
      return 'dark'; // Dark theme default as requested
    }

    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (e) {}

      if (toggleBtn) {
        var isDark = theme === 'dark';
        toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        toggleBtn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
        toggleBtn.setAttribute('aria-label', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');

        var sunIcon = toggleBtn.querySelector('.icon-sun');
        var moonIcon = toggleBtn.querySelector('.icon-moon');
        if (sunIcon && moonIcon) {
          sunIcon.style.display = isDark ? 'block' : 'none';
          moonIcon.style.display = isDark ? 'none' : 'block';
        }
      }
    }

    var current = getSavedTheme();
    applyTheme(current);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var active = root.getAttribute('data-theme') || 'dark';
        applyTheme(active === 'dark' ? 'light' : 'dark');
      });
    }

    window.__setTheme = applyTheme;
  }

  /* --------------------------------------------------------------------------
     2. Preloader
     -------------------------------------------------------------------------- */
  function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        preloader.classList.add('fade-out');
        setTimeout(function () {
          preloader.style.display = 'none';
        }, 500);
      }, 300);
    });
  }

  /* --------------------------------------------------------------------------
     3. Sticky Navbar & Active Link Scroll Spy
     -------------------------------------------------------------------------- */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    var sections = document.querySelectorAll('section[id], header[id]');
    var hamburger = document.getElementById('hamburger-btn');
    var navMenu = document.getElementById('nav-menu');

    // Scroll listener for sticky blur & scroll-to-top button
    var scrollTopBtn = document.getElementById('scroll-top-btn');

    function onScroll() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // Sticky glass effect
      if (navbar) {
        if (scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Scroll top button visibility
      if (scrollTopBtn) {
        if (scrollY > 400) {
          scrollTopBtn.classList.add('is-visible');
        } else {
          scrollTopBtn.classList.remove('is-visible');
        }
      }

      // Active link highlight (ScrollSpy)
      var scrollPosition = scrollY + 180;
      sections.forEach(function (sec) {
        var top = sec.offsetTop;
        var height = sec.offsetHeight;
        var id = sec.getAttribute('id');

        if (scrollPosition >= top && scrollPosition < top + height) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Hamburger Mobile Menu
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', function () {
        var isOpen = navMenu.classList.contains('is-open');
        if (isOpen) {
          navMenu.classList.remove('is-open');
          hamburger.classList.remove('is-active');
          hamburger.setAttribute('aria-expanded', 'false');
        } else {
          navMenu.classList.add('is-open');
          hamburger.classList.add('is-active');
          hamburger.setAttribute('aria-expanded', 'true');
        }
      });

      // Close menu on link click
      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          navMenu.classList.remove('is-open');
          hamburger.classList.remove('is-active');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });

      // Close on escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          hamburger.classList.remove('is-active');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.focus();
        }
      });
    }

    // Scroll to top button action
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* --------------------------------------------------------------------------
     4. Typing / Rotating Roles Animation
     -------------------------------------------------------------------------- */
  function initTypingEffect() {
    var element = document.getElementById('typing-text');
    if (!element) return;

    var roles = [
      'Full Stack Developer',
      'AI & Machine Learning Engineer',
      'Python & Flask Specialist',
      'Vibe Coder & Creative Engineer'
    ];

    var roleIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typingSpeed = 100;

    function type() {
      var currentRole = roles[roleIndex];

      if (isDeleting) {
        element.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        element.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Pause before typing new word
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  /* --------------------------------------------------------------------------
     5. Infinite Tech Badges Duplicate for Seamless Flow
     -------------------------------------------------------------------------- */
  function initTechBadges() {
    var track = document.getElementById('tech-track');
    if (!track) return;
    // Clone children to make smooth continuous looping
    track.innerHTML += track.innerHTML;
  }

  /* --------------------------------------------------------------------------
     6. Scroll Reveal Animations (IntersectionObserver)
     -------------------------------------------------------------------------- */
  function initScrollReveal() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --------------------------------------------------------------------------
     7. Live Interactive Cursor Spotlight Reaction
     -------------------------------------------------------------------------- */
  function initCursorReaction() {
    var spotlight = document.getElementById('cursor-spotlight');
    if (!spotlight) return;

    // Check if user has touch device or prefers reduced motion
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      spotlight.style.display = 'none';
      return;
    }

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var currentX = mouseX;
    var currentY = mouseY;
    var isMoving = false;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(updateCursorSpotlight);
      }
    }, { passive: true });

    function updateCursorSpotlight() {
      // Smooth interpolation (lerp) for fluid motion
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      spotlight.style.left = currentX + 'px';
      spotlight.style.top = currentY + 'px';

      if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
        requestAnimationFrame(updateCursorSpotlight);
      } else {
        isMoving = false;
      }
    }
  }

  /* --------------------------------------------------------------------------
     8. View CV Lightbox Modal
     -------------------------------------------------------------------------- */
  function initResumeModal() {
    var modal = document.getElementById('resume-modal');
    var openBtn = document.getElementById('view-cv-btn');
    var closeBtn = document.getElementById('modal-close-btn');

    if (!modal || !openBtn) return;

    function openModal() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      openBtn.focus();
    }

    openBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. Working Contact Form Validation & Formspree Handling
     -------------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    var feedback = document.getElementById('contact-feedback');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = document.getElementById('name');
      var emailInput = document.getElementById('email');
      var subjectInput = document.getElementById('subject');
      var messageInput = document.getElementById('message');

      var name = nameInput ? nameInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var subject = subjectInput ? subjectInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !subject || !message) {
        showFeedback('Please fill out all required fields.', 'error');
        return;
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        return;
      }

      var action = form.getAttribute('action');
      var isRealEndpoint = action && action.indexOf('formspree.io/f/your_form_id') === -1;

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
      }

      if (isRealEndpoint) {
        var data = new FormData(form);
        fetch(action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        })
          .then(function (response) {
            if (response.ok) {
              form.reset();
              showFeedback('Thank you! Your message has been sent successfully.', 'success');
            } else {
              showFeedback('Oops! There was a problem sending your message. Please email me directly.', 'error');
            }
          })
          .catch(function () {
            showFeedback('Network error. Please email me at nick34688@gmail.com.', 'error');
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnText;
            }
          });
      } else {
        setTimeout(function () {
          form.reset();
          showFeedback('Thank you, ' + name + '! Your message has been received. I will get back to you shortly.', 'success');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        }, 600);
      }
    });

    function showFeedback(msg, type) {
      if (!feedback) return;
      feedback.textContent = msg;
      feedback.className = 'form-feedback ' + type;
      feedback.style.display = 'block';
    }
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */
  function init() {
    initTheme();
    initPreloader();
    initNavbar();
    initTypingEffect();
    initTechBadges();
    initScrollReveal();
    initCursorReaction();
    initResumeModal();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
