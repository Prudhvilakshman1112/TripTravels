/* ============================================
   Feedback Form — Validation + Submit
   ============================================ */

import { buildWhatsAppURL } from './whatsapp.js';

export function initFeedback(gsap) {
  const form = document.getElementById('feedback-form');
  if (!form) return;

  // Reveal on scroll
  if (gsap) {
    gsap.fromTo('.feedback-content > *',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: '.feedback-content', start: 'top 85%' }
      }
    );
    gsap.fromTo('.feedback-form-card',
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: '.feedback-form-card', start: 'top 88%' }
      }
    );
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const interest = data.get('interest');
    const message = data.get('message');

    const waMessage = `Hello Tour Trips!\n\nName: ${name}\nEmail: ${email}\nInterest: ${interest}\nMessage: ${message}`;
    const url = `https://wa.me/917569010557?text=${encodeURIComponent(waMessage)}`;

    // Show success state
    const btn = form.querySelector('.form-submit');
    btn.textContent = '✓ Sent! Redirecting to WhatsApp...';
    btn.classList.add('success');

    setTimeout(() => {
      window.open(url, '_blank', 'noopener');
      btn.textContent = 'Send Message';
      btn.classList.remove('success');
      form.reset();
    }, 1200);
  });
}

function validateForm(form) {
  let valid = true;
  const groups = form.querySelectorAll('.form-group');

  groups.forEach(group => {
    const input = group.querySelector('input, select, textarea');
    const error = group.querySelector('.form-error');
    group.classList.remove('error', 'shake');

    if (input && input.required && !input.value.trim()) {
      group.classList.add('error', 'shake');
      valid = false;
      setTimeout(() => group.classList.remove('shake'), 500);
    }

    if (input && input.type === 'email' && input.value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(input.value.trim())) {
        group.classList.add('error', 'shake');
        if (error) error.textContent = 'Please enter a valid email';
        valid = false;
        setTimeout(() => group.classList.remove('shake'), 500);
      }
    }
  });

  return valid;
}
