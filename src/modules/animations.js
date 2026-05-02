/* ============================================
   Shared GSAP Animation Utilities
   ============================================ */

let gsap, ScrollTrigger;

export async function loadGSAP() {
  if (gsap) return { gsap, ScrollTrigger };

  const [gsapModule, stModule] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm'),
    import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm'),
  ]);

  gsap = gsapModule.gsap || gsapModule.default;
  ScrollTrigger = stModule.ScrollTrigger || stModule.default;
  gsap.registerPlugin(ScrollTrigger);

  return { gsap, ScrollTrigger };
}

export function revealOnScroll(selector, options = {}) {
  const { gsap, ScrollTrigger } = window.__gsap || {};
  if (!gsap) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: options.y ?? 50, scale: options.scale ?? 1 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: options.duration ?? 0.9,
        delay: (options.stagger ?? 0.12) * i,
        ease: options.ease ?? 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: options.start ?? 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
}
