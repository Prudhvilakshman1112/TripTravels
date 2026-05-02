export function initHero(gsap) {
  const tl = gsap.timeline({ delay: 0.2 });
  tl.fromTo('.hero-badge', {opacity:0,y:20}, {opacity:1,y:0,duration:0.7,ease:'expo.out'});
  tl.fromTo('.hero-title .word-inner', {y:'110%'}, {y:'0%',duration:0.9,ease:'expo.out',stagger:0.08}, '-=0.3');
  tl.fromTo('.hero-description', {opacity:0,y:30}, {opacity:1,y:0,duration:0.8,ease:'expo.out'}, '-=0.4');
  tl.fromTo('.hero-actions', {opacity:0,y:20}, {opacity:1,y:0,duration:0.7,ease:'expo.out'}, '-=0.4');
  tl.fromTo('.hero-stat', {opacity:0,y:20}, {opacity:1,y:0,duration:0.6,ease:'expo.out',stagger:0.1}, '-=0.3');
  tl.fromTo('.hero-map-wrapper', {opacity:0,scale:0.94,x:40}, {opacity:1,scale:1,x:0,duration:1,ease:'expo.out'}, '-=0.8');
}

export function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 50); }, { passive: true });
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => { hamburger.classList.remove('active'); mobileMenu.classList.remove('open'); document.body.style.overflow = ''; });
    });
  }
}
