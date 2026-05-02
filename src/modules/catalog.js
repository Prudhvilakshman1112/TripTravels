/* Catalog — Tabs, Cards, Elaborate Modal */
import { imageMap } from './map.js';
import { buildWhatsAppURL, getWhatsAppSVG } from './whatsapp.js';

const CATEGORIES = [
  { id: 'devotional', label: 'Devotional' },
  { id: 'summer', label: 'Summer Escapes' },
  { id: 'international', label: 'International' },
];
let activeCategory = 'devotional';

export function initCatalog(packages, gsap) {
  renderTabs();
  renderCards(packages);
  initTabSwitching(packages, gsap);
  initModal(packages);
}

function renderTabs() {
  const el = document.getElementById('catalog-tabs');
  if (!el) return;
  el.innerHTML = CATEGORIES.map((c, i) =>
    `<button class="catalog-tab${i===0?' active':''}" data-category="${c.id}">${c.label}</button>`
  ).join('') + '<div class="catalog-tab-indicator"></div>';
  requestAnimationFrame(() => moveIndicator(el));
}

function moveIndicator(el) {
  const tab = el.querySelector('.catalog-tab.active');
  const ind = el.querySelector('.catalog-tab-indicator');
  if (!tab || !ind) return;
  const tr = tab.getBoundingClientRect(), pr = el.getBoundingClientRect();
  ind.style.width = tr.width + 'px';
  ind.style.left = (tr.left - pr.left) + 'px';
}

function renderCards(packages) {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;
  const filtered = packages.filter(p => p.category === activeCategory);
  grid.innerHTML = filtered.map(pkg => `
    <div class="package-card" data-id="${pkg.id}">
      <img class="package-card-img" src="${imageMap[pkg.image]||''}" alt="${pkg.title}" loading="lazy"/>
      <div class="package-card-overlay"></div>
      <div class="package-card-badge">${CATEGORIES.find(c=>c.id===pkg.category)?.label||''}</div>
      <div class="package-card-content">
        <div class="package-card-duration">${pkg.duration}</div>
        <h3 class="package-card-title">${pkg.title}</h3>
        <div class="package-card-location"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${pkg.location}</div>
        <div class="package-card-details">
          <div class="package-card-price">${pkg.price}</div>
          <div class="package-card-price-note">${pkg.priceNote}</div>
          <div class="package-card-highlights">${pkg.highlights.slice(0,3).map(h=>`<span class="package-card-highlight">${h}</span>`).join('')}</div>
          <div class="package-card-actions">
            <a href="${buildWhatsAppURL(pkg.title)}" target="_blank" rel="noopener" class="btn btn-whatsapp">${getWhatsAppSVG()} Book Now</a>
            <button class="btn btn-secondary view-details-btn" data-id="${pkg.id}">Details</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function initTabSwitching(packages, gsap) {
  const el = document.getElementById('catalog-tabs');
  if (!el) return;
  el.addEventListener('click', e => {
    const tab = e.target.closest('.catalog-tab');
    if (!tab || tab.classList.contains('active')) return;
    el.querySelectorAll('.catalog-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCategory = tab.dataset.category;
    moveIndicator(el);
    const grid = document.getElementById('catalog-grid');
    if (gsap) {
      gsap.to(grid, { opacity:0, y:20, duration:0.25, ease:'power2.in', onComplete:() => {
        renderCards(packages);
        gsap.fromTo(grid, {opacity:0,y:20}, {opacity:1,y:0,duration:0.5,ease:'expo.out'});
        attachHandlers(packages);
      }});
    } else { renderCards(packages); attachHandlers(packages); }
  });
  attachHandlers(packages);
}

function attachHandlers(packages) {
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); const p=packages.find(x=>x.id===btn.dataset.id); if(p) openModal(p); });
  });
  document.querySelectorAll('.package-card').forEach(card => {
    card.addEventListener('click', e => { if(e.target.closest('a')||e.target.closest('.view-details-btn'))return; const p=packages.find(x=>x.id===card.dataset.id); if(p) openModal(p); });
  });
}

function initModal(packages) {
  const ov = document.getElementById('modal-overlay');
  if (!ov) return;
  ov.addEventListener('click', e => { if(e.target===ov) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });
  attachHandlers(packages);
}

function openModal(pkg) {
  const ov = document.getElementById('modal-overlay');
  const modal = document.getElementById('package-modal');
  if (!ov || !modal) return;

  const catLabel = CATEGORIES.find(c=>c.id===pkg.category)?.label || '';
  const itineraryHtml = (pkg.itinerary || []).map(d => `
    <div class="itinerary-day">
      <div class="itinerary-day-label">Day ${d.day}</div>
      <div class="itinerary-day-title">${d.title}</div>
      <div class="itinerary-day-desc">${d.desc}</div>
    </div>`).join('');
  const inclusionsHtml = pkg.highlights.map(h => `
    <div class="inclusion-item">
      <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>${h}
    </div>`).join('');

  modal.innerHTML = `
    <div class="modal-hero">
      <img src="${imageMap[pkg.image]||''}" alt="${pkg.title}"/>
      <div class="modal-hero-gradient"></div>
      <button class="modal-close" id="modal-close-btn">&times;</button>
      <div class="modal-hero-content">
        <div class="package-card-badge">${catLabel}</div>
        <h2 class="modal-hero-title">${pkg.title}</h2>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-meta">
        <div class="modal-meta-item"><span class="modal-meta-label">Duration</span><span class="modal-meta-value">${pkg.duration}</span></div>
        <div class="modal-meta-item"><span class="modal-meta-label">Starting From</span><span class="modal-meta-value">${pkg.price}</span></div>
        <div class="modal-meta-item"><span class="modal-meta-label">Location</span><span class="modal-meta-value">${pkg.location}</span></div>
      </div>
      <p class="modal-description">${pkg.description}</p>
      ${itineraryHtml ? `<h4 class="modal-itinerary-title">Day-by-Day Itinerary</h4><div class="itinerary-timeline">${itineraryHtml}</div>` : ''}
      <div class="modal-inclusions">
        <h4 class="modal-inclusions-title">What's Included</h4>
        <div class="inclusions-grid">${inclusionsHtml}</div>
      </div>
      <div class="modal-actions">
        <a href="${buildWhatsAppURL(pkg.title)}" target="_blank" rel="noopener" class="btn btn-whatsapp">${getWhatsAppSVG()} Book via WhatsApp</a>
        <button class="btn btn-secondary" onclick="document.getElementById('modal-overlay').classList.remove('open');document.body.style.overflow=''">Close</button>
      </div>
    </div>`;

  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
}

function closeModal() {
  document.getElementById('modal-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}
