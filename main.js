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
        if (isMailto) {
          const fd = new FormData(form);
          const typeSelect = form.querySelector('#type-besoin');
          const typeLabel = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : '';
          const subject = `Demande de contact — ${fd.get('prenom')} ${fd.get('nom')} (${fd.get('entreprise')})`;
          const body = [
            `Nom : ${fd.get('nom')}`,
            `Prénom : ${fd.get('prenom')}`,
            `Entreprise : ${fd.get('entreprise')}`,
            `Email : ${fd.get('email')}`,
            `Téléphone : ${(fd.get('telephone') || '').toString().trim() || '—'}`,
            `Type de besoin : ${typeLabel}`,
            '',
            'Projet :',
            (fd.get('message') || '').toString(),
            '',
            '— Consentement RGPD accepté.',
          ].join('\n');
          window.location.href = `${action}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          showFeedback('success', "Votre client mail s'est ouvert avec la demande pré-remplie. Cliquez sur Envoyer dans votre messagerie pour la transmettre. Si rien ne s'est ouvert, écrivez directement à alexandre.ley@al-conseil.fr.");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
          return;
        }

        if (!isConfigured) throw new Error('Endpoint non configuré');

        const response = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('Erreur réseau');

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

  /* ---------- 3. Reveal au scroll (renforcé + stagger) ---------- */
  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && motionOK) {
    const selectors = [
      '.card', '.value-card', '.diff-item', '.method-step', '.reassurance-item',
      '.section-head', '.quote-block', '.manifesto', '.founder-card',
      '.contact-coords', '.contact-form-wrapper', '.cta-final'
    ];
    const targets = document.querySelectorAll(selectors.join(','));
    targets.forEach((el) => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    targets.forEach((el) => io.observe(el));
  }

  /* ---------- 4. Header compact au scroll ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          header.classList.toggle('is-scrolled', window.scrollY > 16);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 5. Effet magnétique léger sur les CTA principaux ---------- */
  if (motionOK && window.matchMedia('(hover: hover)').matches) {
    const magnets = document.querySelectorAll('.btn--primary.btn--lg, .btn--gold.btn--lg');
    magnets.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px) scale(1.02)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

})();
