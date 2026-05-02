import './styles/index.css';
import packages from './data/packages.json';
import { initPreloader } from './modules/preloader.js';
import { initHero, initNav } from './modules/hero.js';
import { initMap } from './modules/map.js';
import { initCatalog } from './modules/catalog.js';
import { initAmenities } from './modules/amenities.js';
import { initFeedback } from './modules/feedback.js';
import { buildWhatsAppURL, getWhatsAppSVG } from './modules/whatsapp.js';
import { loadGSAP } from './modules/animations.js';

async function boot() {
  initNav();
  initFloatingWhatsApp();
  document.body.classList.add('preloader-active');
  await initPreloader();
  const { gsap, ScrollTrigger } = await loadGSAP();
  window.__gsap = { gsap, ScrollTrigger };
  initHero(gsap);
  initMap(packages);
  initCatalog(packages, gsap);
  initGroups(gsap);
  initAmenities(gsap, ScrollTrigger);
  initFeedback(gsap);
  gsap.fromTo('.footer', {opacity:0}, {opacity:1,duration:0.8,ease:'power2.out',scrollTrigger:{trigger:'.footer',start:'top 95%'}});
}

function initFloatingWhatsApp() {
  const fab = document.getElementById('whatsapp-float');
  if (!fab) return;
  fab.href = buildWhatsAppURL();
  fab.querySelector('.wa-icon').innerHTML = getWhatsAppSVG();
  setTimeout(() => fab.classList.add('visible'), 4000);
  window.addEventListener('scroll', () => { if (window.scrollY > 400) fab.classList.add('visible'); }, { passive: true });
}

function initGroups(gsap) {
  gsap.fromTo('.groups-content > *', {opacity:0,y:40}, {opacity:1,y:0,duration:0.8,ease:'expo.out',stagger:0.12,scrollTrigger:{trigger:'.groups-content',start:'top 85%'}});
  gsap.fromTo('.groups-feature', {opacity:0,x:-30}, {opacity:1,x:0,duration:0.6,ease:'expo.out',stagger:0.1,scrollTrigger:{trigger:'.groups-features',start:'top 85%'}});
  gsap.fromTo('.groups-card', {opacity:0,y:40,scale:0.96}, {opacity:1,y:0,scale:1,duration:0.8,ease:'expo.out',scrollTrigger:{trigger:'.groups-card',start:'top 88%'}});
}

boot();
