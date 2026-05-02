/* Interactive Leaflet Map with Photo Landmark Bubbles */
import heroVizag from '../assets/images/hero-vizag.png';
import tirupati from '../assets/images/tirupati.png';
import varanasi from '../assets/images/varanasi.png';
import hyderabad from '../assets/images/hyderabad.png';
import rishikesh from '../assets/images/rishikesh.png';
import goa from '../assets/images/goa.png';
import manali from '../assets/images/manali.png';
import dubai from '../assets/images/dubai.png';
import thailand from '../assets/images/thailand.png';
import bali from '../assets/images/bali.png';
import singapore from '../assets/images/singapore.png';
import kedarnath from '../assets/images/kedarnath.png';
import puri from '../assets/images/puri.png';
import maldives from '../assets/images/maldives.png';
import srilanka from '../assets/images/srilanka.png';

export const imageMap = {
  'hero-vizag': heroVizag, tirupati, varanasi, hyderabad,
  rishikesh, goa, manali, dubai, thailand, bali, singapore,
  kedarnath, puri, maldives, srilanka,
};

// Monument names to display above the bubble
const MONUMENT_NAMES = {
  'hyderabad-heritage': 'Charminar',
  'tirupati-divine': 'Tirumala Temple',
  'varanasi-spiritual': 'Varanasi Ghats',
  'vizag-coastal': 'Vizag Beach',
  'rishikesh-adventure': 'Lakshman Jhula',
  'goa-beach': 'Goa Beaches',
  'manali-snow': 'Rohtang Pass',
  'dubai-luxury': 'Burj Khalifa',
  'thailand-tropical': 'Grand Palace',
  'bali-paradise': 'Bali Temples',
  'singapore-modern': 'Marina Bay Sands',
  'kedarnath-divine': 'Kedarnath Temple',
  'puri-jagannath': 'Jagannath Temple',
  'maldives-luxury': 'Maldives Paradise',
  'srilanka-heritage': 'Sigiriya Fortress',
};

let L, map, activeBubble = null, activeCoords = null;

async function loadLeaflet() {
  if (L) return L;
  if (!document.querySelector('link[href*="leaflet"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }
  const m = await import('https://cdn.jsdelivr.net/npm/leaflet@1.9.4/+esm');
  L = m.default || m;
  return L;
}

export async function initMap(packages) {
  const L = await loadLeaflet();
  const mapEl = document.getElementById('hero-map');
  if (!mapEl) return;

  map = L.map('hero-map', {
    center: [20.5, 78.9], zoom: 4,
    zoomControl: false, attributionControl: false, scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, subdomains: 'abcd',
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Overlay container for bubbles
  const overlay = document.createElement('div');
  overlay.className = 'landmark-overlay';
  overlay.id = 'landmark-overlay';
  mapEl.appendChild(overlay);

  // Create pins
  packages.forEach(pkg => {
    const isHome = pkg.id === 'vizag-coastal';
    const icon = L.divIcon({
      className: 'map-pin-wrap',
      html: `<div class="map-pin-pulse"></div>
        <svg class="map-pin-icon" viewBox="0 0 24 36">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${isHome ? '#e8943a' : '#ff4757'}"/>
          <circle cx="12" cy="12" r="5" fill="#fff"/>
        </svg>
        <span class="map-pin-name">${pkg.location}</span>`,
      iconSize: [28, 38], iconAnchor: [14, 38],
    });

    const marker = L.marker(pkg.coordinates, { icon }).addTo(map);
    marker.on('click', () => showBubble(pkg));
  });

  const bounds = L.latLngBounds(packages.map(p => p.coordinates));
  map.fitBounds(bounds.pad(0.3));

  map.on('click', hideBubble);
  map.on('move zoom', repositionBubble);

  return map;
}

function showBubble(pkg) {
  hideBubble();
  if (!map) return;

  const overlay = document.getElementById('landmark-overlay');
  if (!overlay) return;

  const latlng = L.latLng(pkg.coordinates[0], pkg.coordinates[1]);
  const point = map.latLngToContainerPoint(latlng);

  const imgSrc = imageMap[pkg.image] || '';
  const name = MONUMENT_NAMES[pkg.id] || pkg.title;

  const bubble = document.createElement('div');
  bubble.className = 'landmark-bubble';
  bubble.innerHTML = `
    <span class="landmark-bubble-label">${name}</span>
    <div class="landmark-bubble-img-wrap">
      <img src="${imgSrc}" alt="${name}" />
    </div>
    <span class="landmark-bubble-arrow"></span>
  `;

  bubble.style.left = point.x + 'px';
  bubble.style.top = point.y + 'px';

  bubble.addEventListener('click', (e) => e.stopPropagation());

  overlay.appendChild(bubble);
  requestAnimationFrame(() => bubble.classList.add('visible'));

  activeBubble = bubble;
  activeCoords = latlng;
}

function repositionBubble() {
  if (!activeBubble || !activeCoords || !map) return;
  const point = map.latLngToContainerPoint(activeCoords);
  activeBubble.style.left = point.x + 'px';
  activeBubble.style.top = point.y + 'px';
}

function hideBubble() {
  if (activeBubble) {
    activeBubble.classList.add('hiding');
    const ref = activeBubble;
    setTimeout(() => ref.remove(), 350);
    activeBubble = null;
    activeCoords = null;
  }
}
