(() => {
  'use strict';

  /* ---------- Datos (ejemplo; en producción vienen de data/products.json o del backend) ---------- */
  const CATS = {
    utiles:     { label: 'Útiles escolares',    subs: { cuadernos: 'Cuadernos', escritura: 'Escritura y trazo', tijeras: 'Tijeras' } },
    papeleria:  { label: 'Papelería y oficina', subs: { agendas: 'Agendas', escritorio: 'Escritorio' } },
    tecnologia: { label: 'Tecnología',          subs: { ratones: 'Ratones', teclados: 'Teclados' } },
    hogar:      { label: 'Hogar y cocina',      subs: { cocina: 'Cocina', costura: 'Costura' } },
  };

  const PRODUCTS = [
    { id: 1,  name: 'Tijeras escolares de filo izquierdo',   cat: 'utiles',     sub: 'tijeras',    price: 89,   rating: 4.7, isNew: false, icon: '✂️' },
    { id: 2,  name: 'Cuaderno con espiral al lado derecho',  cat: 'utiles',     sub: 'cuadernos',  price: 65,   rating: 4.5, isNew: true,  icon: '📓' },
    { id: 3,  name: 'Cuaderno cosido sin espiral',           cat: 'utiles',     sub: 'cuadernos',  price: 72,   rating: 4.3, isNew: false, icon: '📔' },
    { id: 4,  name: 'Pluma de gel de secado rápido',         cat: 'utiles',     sub: 'escritura',  price: 45,   rating: 4.6, isNew: true,  icon: '🖊️' },
    { id: 5,  name: 'Lápiz triangular ergonómico',           cat: 'utiles',     sub: 'escritura',  price: 38,   rating: 4.4, isNew: false, icon: '✏️' },
    { id: 6,  name: 'Regla con numeración de derecha a izquierda', cat: 'utiles', sub: 'escritura', price: 52,  rating: 4.6, isNew: false, icon: '📏' },
    { id: 7,  name: 'Agenda semanal con anillas a la derecha', cat: 'papeleria', sub: 'agendas',   price: 210,  rating: 4.2, isNew: false, icon: '📅' },
    { id: 8,  name: 'Organizador de escritorio invertido',   cat: 'papeleria',  sub: 'escritorio', price: 180,  rating: 4.1, isNew: true,  icon: '🗂️' },
    { id: 9,  name: 'Ratón ergonómico para mano izquierda',  cat: 'tecnologia', sub: 'ratones',    price: 699,  rating: 4.7, isNew: false, icon: '🖱️' },
    { id: 10, name: 'Teclado con teclado numérico a la izquierda', cat: 'tecnologia', sub: 'teclados', price: 1290, rating: 4.5, isNew: true, icon: '⌨️' },
    { id: 11, name: 'Abrelatas para zurdos',                 cat: 'hogar',      sub: 'cocina',     price: 189,  rating: 4.4, isNew: false, icon: '🥫' },
    { id: 12, name: 'Cuchillo de pan serrado izquierdo',     cat: 'hogar',      sub: 'cocina',     price: 420,  rating: 4.9, isNew: false, icon: '🔪' },
    { id: 13, name: 'Tijeras de costura para zurdos',        cat: 'hogar',      sub: 'costura',    price: 349,  rating: 4.8, isNew: false, icon: '🧵' },
  ];

  const QUICK = {
    new:   p => p.isNew,
    cheap: p => p.price < 200,
    top:   p => p.rating >= 4.5,
  };

  /* ---------- Utilidades ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const norm = s => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* modo privado */ } },
  };

  const root = document.documentElement;
  const el = {
    grid: $('#grid'), empty: $('#empty'), title: $('#title'), status: $('#status'), crumbs: $('#crumbs'),
    sidebar: $('#sidebar'), fab: $('#fab'), backdrop: $('#backdrop'), q: $('#q'),
    hand: $('#handBtn'), theme: $('#themeBtn'),
  };

  /* ---------- Estado único ---------- */
  const state = { cat: 'all', sub: null, q: '', quick: new Set() };

  const readURL = () => {
    const p = new URLSearchParams(location.search);
    const cat = p.get('cat'), sub = p.get('sub');
    state.cat = CATS[cat] ? cat : 'all';
    state.sub = state.cat !== 'all' && CATS[state.cat].subs[sub] ? sub : null;
    state.q = p.get('q') || '';
    state.quick = new Set((p.get('f') || '').split(',').filter(k => QUICK[k]));
  };

  const writeURL = push => {
    const p = new URLSearchParams();
    if (state.cat !== 'all') p.set('cat', state.cat);
    if (state.sub) p.set('sub', state.sub);
    if (state.q) p.set('q', state.q);
    if (state.quick.size) p.set('f', [...state.quick].join(','));
    const url = p.toString() ? `?${p}` : location.pathname;
    try { history[push ? 'pushState' : 'replaceState'](null, '', url); } catch { /* file:// */ }
  };

  /* ---------- Filtrado ---------- */
  const matches = p => {
    if (state.cat !== 'all' && p.cat !== state.cat) return false;
    if (state.sub && p.sub !== state.sub) return false;
    for (const k of state.quick) if (!QUICK[k](p)) return false;
    if (state.q) {
      const hay = norm(`${p.name} ${CATS[p.cat].label} ${CATS[p.cat].subs[p.sub]}`);
      if (!state.q.split(/\s+/).every(w => hay.includes(norm(w)))) return false;
    }
    return true;
  };

  /* ---------- Render ---------- */
  const card = p => `
    <li class="card">
      <div class="thumb" aria-hidden="true">${p.icon}</div>
      <div class="body">
        ${p.isNew ? '<span class="badge">Nuevo</span>' : ''}
        <h2>${esc(p.name)}</h2>
        <p class="meta">${esc(CATS[p.cat].subs[p.sub])}</p>
        <p class="row"><strong>${money.format(p.price)}</strong><span aria-label="Valoración ${p.rating} de 5">★ ${p.rating.toFixed(1)}</span></p>
      </div>
    </li>`;

  const render = () => {
    const list = PRODUCTS.filter(matches);
    el.grid.innerHTML = list.map(card).join('');
    el.empty.hidden = list.length > 0;

    const catLabel = state.cat === 'all' ? null : CATS[state.cat].label;
    const subLabel = state.sub ? CATS[state.cat].subs[state.sub] : null;
    const heading = subLabel || catLabel || 'Todos los productos';
    el.title.textContent = heading;
    el.status.textContent = `${list.length} ${list.length === 1 ? 'producto' : 'productos'}`;
    document.title = `${heading} · leftools`;

    el.crumbs.innerHTML = ['<a href="./" data-cat="all">Catálogo</a>']
      .concat(catLabel ? [subLabel ? `<a href="?cat=${state.cat}" data-cat="${state.cat}">${esc(catLabel)}</a>` : esc(catLabel)] : [])
      .concat(subLabel ? [esc(subLabel)] : [])
      .join(' / ');

    $$('a[data-cat]', el.sidebar).forEach(a => {
      const on = a.dataset.cat === state.cat && (a.dataset.sub || null) === state.sub;
      on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
    });
    $$('details', el.sidebar).forEach(d => { if (d.dataset.cat === state.cat) d.open = true; });
    $$('.chip').forEach(c => c.setAttribute('aria-pressed', state.quick.has(c.dataset.quick)));
    if (el.q.value !== state.q) el.q.value = state.q;
  };

  const initCounts = () => {
    $$('a[data-cat]', el.sidebar).forEach(a => {
      const { cat, sub } = a.dataset;
      const n = PRODUCTS.filter(p => (cat === 'all' || p.cat === cat) && (!sub || p.sub === sub)).length;
      const badge = $('.count', a);
      if (badge) badge.textContent = n;
    });
  };

  /* ---------- Hoja de categorías (móvil) ---------- */
  const sheet = open => {
    el.sidebar.classList.toggle('is-open', open);
    el.backdrop.hidden = !open;
    el.fab.setAttribute('aria-expanded', open);
    if (open) $('a, summary', el.sidebar).focus();
  };

  /* ---------- Eventos ---------- */
  const goTo = (cat, sub) => {
    state.cat = cat; state.sub = sub || null;
    writeURL(true); render(); sheet(false);
    $('#resultados').focus({ preventScroll: true });
    scrollTo({ top: 0 });
  };

  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-cat]');
    if (a) { e.preventDefault(); goTo(a.dataset.cat, a.dataset.sub); return; }

    const chip = e.target.closest('.chip');
    if (chip) {
      const k = chip.dataset.quick;
      state.quick.has(k) ? state.quick.delete(k) : state.quick.add(k);
      writeURL(false); render();
    }
  });

  let t;
  el.q.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = el.q.value.trim(); writeURL(false); render(); }, 120);
  });
  el.q.closest('form').addEventListener('submit', e => e.preventDefault());

  el.fab.addEventListener('click', () => sheet(!el.sidebar.classList.contains('is-open')));
  el.backdrop.addEventListener('click', () => { sheet(false); el.fab.focus(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && el.sidebar.classList.contains('is-open')) { sheet(false); el.fab.focus(); }
  });
  addEventListener('popstate', () => { readURL(); render(); });

  /* ---------- Preferencias: lado (zurdo/diestro) y tema ---------- */
  const setHand = h => {
    root.dataset.hand = h;
    el.hand.textContent = h === 'left' ? 'Interfaz: zurda' : 'Interfaz: diestra';
    store.set('lt-hand', h);
  };
  const setTheme = t => {
    root.dataset.theme = t;
    el.theme.textContent = t === 'dark' ? '☀️' : '🌙';
    store.set('lt-theme', t);
  };
  el.hand.addEventListener('click', () => setHand(root.dataset.hand === 'left' ? 'right' : 'left'));
  el.theme.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  /* ---------- Arranque ---------- */
  setHand(root.dataset.hand || 'left');
  setTheme(root.dataset.theme || 'light');
  initCounts();
  readURL();
  render();
})();
