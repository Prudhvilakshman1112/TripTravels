/* Custom Interactive Route Map with 3D Destination Cards */
import { imageMap } from './map.js';

// Pin positions as % of the map container (calculated from geo coords)
const PIN_POSITIONS = {
  'vizag-coastal':       { x: 47.4, y: 42.3, home: true },
  'tirupati-divine':     { x: 42,   y: 50.8 },
  'varanasi-spiritual':  { x: 47.1, y: 26.5 },
  'hyderabad-heritage':  { x: 40.7, y: 42.9 },
  'rishikesh-adventure': { x: 40.4, y: 16.5 },
  'goa-beach':           { x: 34.4, y: 47.3 },
  'manali-snow':         { x: 38.9, y: 12.1 },
  'dubai-luxury':        { x: 7.6,  y: 26.7 },
  'thailand-tropical':   { x: 72.1, y: 50.4 },
  'bali-paradise':       { x: 83,   y: 82 },
  'singapore-modern':    { x: 76.9, y: 76.3 },
};

let activeCard = null;
let canvas, ctx, w, h;

export function initRouteMap(packages) {
  const mapEl = document.querySelector('.route-map');
  if (!mapEl) return;

  canvas = mapEl.querySelector('.route-map-canvas');
  ctx = canvas.getContext('2d');
  const pinsContainer = mapEl.querySelector('.route-map-pins');

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = mapEl.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
  }
  resize();
  window.addEventListener('resize', () => { resize(); drawBackground(); drawRoutes(packages); });

  // Draw background grid + routes
  drawBackground();
  drawRoutes(packages);

  // Create pins
  packages.forEach(pkg => {
    const pos = PIN_POSITIONS[pkg.id];
    if (!pos) return;

    const pin = document.createElement('div');
    pin.className = 'map-pin';
    pin.style.left = pos.x + '%';
    pin.style.top = pos.y + '%';
    pin.innerHTML = `
      <div class="map-pin-pulse"></div>
      <div class="map-pin-marker">
        <svg viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${pos.home ? '#e8943a' : '#ff4757'}"/>
          <circle cx="12" cy="12" r="5" fill="#fff"/>
        </svg>
      </div>
      <span class="map-pin-label">${pkg.location}</span>
    `;

    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      showDestCard(pkg, pos, mapEl, pinsContainer);
    });

    pinsContainer.appendChild(pin);
  });

  // Close card when clicking map background
  mapEl.addEventListener('click', () => hideDestCard());
}

function drawBackground() {
  ctx.clearRect(0, 0, w, h);

  // Subtle dot grid
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  const spacing = 30;
  for (let x = 0; x < w; x += spacing) {
    for (let y = 0; y < h; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Ambient glow at center (India region)
  const glow = ctx.createRadialGradient(w * 0.43, h * 0.4, 0, w * 0.43, h * 0.4, w * 0.3);
  glow.addColorStop(0, 'rgba(232,148,58,0.04)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
}

function drawRoutes(packages) {
  const vizag = PIN_POSITIONS['vizag-coastal'];
  if (!vizag) return;

  const fromX = (vizag.x / 100) * w;
  const fromY = (vizag.y / 100) * h;

  packages.forEach(pkg => {
    const pos = PIN_POSITIONS[pkg.id];
    if (!pos || pos.home) return;

    const toX = (pos.x / 100) * w;
    const toY = (pos.y / 100) * h;

    // Curved route line
    const midX = (fromX + toX) / 2;
    const midY = Math.min(fromY, toY) - Math.abs(toX - fromX) * 0.15;

    ctx.strokeStyle = 'rgba(232,148,58,0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(midX, midY, toX, toY);
    ctx.stroke();
    ctx.setLineDash([]);
  });
}

function showDestCard(pkg, pos, mapEl, container) {
  hideDestCard();

  const card = document.createElement('div');
  card.className = 'dest-card';
  card.id = 'active-dest-card';

  // Position card to the right of pin, or left if too far right
  const leftPct = pos.x;
  const topPct = pos.y;
  if (leftPct > 60) {
    card.style.right = (100 - leftPct + 2) + '%';
  } else {
    card.style.left = (leftPct + 2) + '%';
  }
  card.style.top = Math.max(5, topPct - 20) + '%';

  const imgSrc = imageMap[pkg.image] || '';
  card.innerHTML = `
    <button class="dest-card-close" onclick="event.stopPropagation()">&times;</button>
    <div class="dest-card-inner">
      <img class="dest-card-img" src="${imgSrc}" alt="${pkg.title}" />
      <div class="dest-card-body">
        <div class="dest-card-title">${pkg.title}</div>
        <div class="dest-card-desc">${pkg.mapTeaser}</div>
        <a href="#packages" class="dest-card-cta">
          Explore Package →
        </a>
      </div>
    </div>
  `;

  card.querySelector('.dest-card-close').addEventListener('click', hideDestCard);
  card.addEventListener('click', (e) => e.stopPropagation());

  container.appendChild(card);
  // Trigger animation
  requestAnimationFrame(() => card.classList.add('visible'));

  // Set active pin
  document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
  const pins = container.querySelectorAll('.map-pin');
  pins.forEach(p => {
    if (parseFloat(p.style.left) === pos.x) p.classList.add('active');
  });

  activeCard = card;
}

function hideDestCard() {
  if (activeCard) {
    activeCard.classList.remove('visible');
    setTimeout(() => activeCard?.remove(), 200);
    activeCard = null;
  }
  document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
}
