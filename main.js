/* ==========================================================================
   AL Conseil — main.js
   Menu mobile · validation formulaire · reveal au scroll
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- 1. Menu mobile ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (siteNav.classList.contains('is-open')) {
          siteNav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Ouvrir le menu');
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ---------- 2. Validation formulaire ---------- */
  const form = document.getElementById('contact-form');

  if (form) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const feedback = document.getElementById('form-feedback');

    const setError = (fieldName, message) => {
      const errEl = form.querySelector(`[data-for="${fieldName}"]`);
      const input = form.querySelector(`[name="${fieldName}"]`);
      if (errEl) errEl.textContent = message;
      if (input) {
        if (message) {
          input.classList.add('has-error');
          input.setAttribute('aria-invalid', 'true');
        } else {
          input.classList.remove('has-error');
          input.removeAttribute('aria-invalid');
        }
      }
    };

    const validate = () => {
      let isValid = true;
      const fd = new FormData(form);

      const required = ['nom', 'prenom', 'entreprise', 'email', 'type-besoin', 'message'];
      required.forEach((name) => {
        const v = (fd.get(name) || '').toString().trim();
        if (!v) {
          setError(name, 'Ce champ est requis.');
          isValid = false;
        } else {
          setError(name, '');
        }
      });

      const email = (fd.get('email') || '').toString().trim();
      if (email && !emailRegex.test(email)) {
        setError('email', 'Adresse email invalide.');
        isValid = false;
      }

      const rgpd = form.querySelector('[name="rgpd"]');
      if (rgpd && !rgpd.checked) {
        setError('rgpd', 'Vous devez accepter le traitement de vos données.');
        isValid = false;
      } else {
        setError('rgpd', '');
      }

      return isValid;
    };

    form.querySelectorAll('input, textarea, select').forEach((field) => {
      field.addEventListener('blur', () => {
        const name = field.getAttribute('name');
        if (!name || name === '_gotcha') return;
        if (field.type === 'email') {
          const v = field.value.trim();
          if (v && !emailRegex.test(v)) {
            setError(name, 'Adresse email invalide.');
          } else if (field.required && !v) {
            setError(name, 'Ce champ est requis.');
          } else {
            setError(name, '');
          }
        } else if (field.required) {
          const v = (field.type === 'checkbox' ? field.checked : field.value.trim());
          if (!v) {
            setError(name, field.type === 'checkbox' ? 'Vous devez accepter le traitement de vos données.' : 'Ce champ est requis.');
          } else {
            setError(name, '');
          }
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const honeypot = form.querySelector('[name="_gotcha"]');
      if (honeypot && honeypot.value) return;

      if (!validate()) {
        const firstError = form.querySelector('.has-error');
        if (firstError) firstError.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours…';
      }

      const action = form.getAttribute('action');
      const isMailto = action && action.startsWith('mailto:');
      const isConfigured = action && action !== '#' && !isMailto;

      try {
        if (isConfigured) {
          const response = await fetch(action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' },
          });
          if (!response.ok) throw new Error('Erreur réseau');
        }

        showFeedback('success', 'Merci. Votre demande a bien été reçue — je reviens vers vous sous 24 heures.');
        form.reset();
        form.style.display = 'none';
      } catch (err) {
        showFeedback('error', "Une erreur est survenue. Merci de réessayer ou de m'écrire à alexandre.ley@al-conseil.fr.");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }
    });

    const showFeedback = (type, message) => {
      if (!feedback) return;
      feedback.className = 'form-feedback form-feedback--' + type;
      feedback.textContent = message;
      feedback.removeAttribute('aria-hidden');
      const wrapper = form.parentElement;
      if (wrapper && !wrapper.contains(feedback)) wrapper.appendChild(feedback);
      feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
  }

  /* ---------- 3. Reveal au scroll (léger) ---------- */
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const targets = document.querySelectorAll('.card, .value-card, .diff-item, .method-step, .reassurance-item');
    targets.forEach((el) => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el) => io.observe(el));
  }

})();
