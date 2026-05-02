/* ============================================
   Amenities Section — Scroll Reveals + Marquee
   ============================================ */

export function initAmenities(gsap, ScrollTrigger) {
  if (!gsap) return;

  // Reveal header
  gsap.fromTo('.amenities-header > *',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.15,
      scrollTrigger: { trigger: '.amenities-header', start: 'top 85%' }
    }
  );

  // Stagger amenity cards
  gsap.fromTo('.amenity-card',
    { opacity: 0, y: 50, scale: 0.95 },
    {
      opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'expo.out', stagger: 0.12,
      scrollTrigger: { trigger: '.amenities-grid', start: 'top 85%' }
    }
  );

  // Counter animation
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.floor(this.targets()[0].val) + suffix;
          }
        });
      }
    });
  });

  // Reveal stats
  gsap.fromTo('.stat-item',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: '.amenities-stats', start: 'top 88%' }
    }
  );

  // Reveal partners
  gsap.fromTo('.partners-section',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: '.partners-section', start: 'top 90%' }
    }
  );
}
