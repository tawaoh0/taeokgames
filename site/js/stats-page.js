(async () => {
  const { $, esc, nf, init, reveal, loadStats } = window.FX;
  const D = window.TAEOK, S = await loadStats();
  $('#nav-discord').href = D.links.discord;

  if (!S) {
    $('#kpis').innerHTML = '<p class="note">Les stats ne sont pas encore disponibles. Elles arrivent après le prochain relevé automatique.</p>';
    $('#share-block').remove(); $('#chips').remove(); init(); return;
  }

  // ── Jeux = données du site + chiffres Roblox ─────────────
  const placeOf = (url) => (url && url.match(/games\/(\d+)/) || [])[1];
  const rows = D.games.filter((g) => !g.placeholder).map((g) => {
    const st = S.games[placeOf(g.url)];
    if (!st) return null;
    const total = st.up + st.down;
    return { id: placeOf(g.url), name: g.name, genre: g.genre, icon: g.icon || st.icon, color: g.color, url: g.url,
      visits: st.visits, playing: st.playing, favorites: st.favorites, likes: total ? Math.round(st.up / total * 100) : null,
      up: st.up, down: st.down, updated: st.updated };
  }).filter(Boolean);

  const when = new Date(S.updatedAt);
  $('#updated').textContent = when.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + ' · ' + when.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  // ── Totaux ───────────────────────────────────────────────
  const sum = (k) => rows.reduce((n, r) => n + r[k], 0);
  const votes = sum('up') + sum('down');
  const kpis = [
    { v: sum('visits'), l: 'visites au total' },
    { v: sum('playing'), l: 'joueurs en ligne', live: true },
    { v: sum('favorites'), l: 'favoris' },
    { v: votes ? Math.round(sum('up') / votes * 100) : 0, l: 'de likes', suffix: ' %' },
  ];
  $('#kpis').innerHTML = kpis.map((k, i) => `
    <div class="kpi spot reveal" style="--i:${i}">
      <strong data-count="${k.v}" data-suffix="${k.suffix || ''}">0</strong>
      <span>${k.live ? '<i class="live-dot"></i>' : ''}${esc(k.l)}</span>
    </div>`).join('');

  // ── Répartition des visites ──────────────────────────────
  const tv = sum('visits') || 1;
  const byVisits = [...rows].sort((a, b) => b.visits - a.visits);
  $('#share').innerHTML = byVisits.filter((r) => r.visits).map((r) =>
    `<a class="seg" href="${esc(r.url)}" target="_blank" rel="noopener" style="--v:${r.visits};--c:${esc(r.color)}" title="${esc(r.name)} — ${nf.format(r.visits)} visites"></a>`).join('');
  $('#legend').innerHTML = byVisits.map((r) =>
    `<li><i style="background:${esc(r.color)}"></i>${esc(r.name)} <b>${Math.round(r.visits / tv * 100)} %</b></li>`).join('');

  // ── Classement triable (animation FLIP) ──────────────────
  const METRICS = {
    visits:    { label: 'Visites',  get: (r) => r.visits,    fmt: (v) => nf.format(v) },
    playing:   { label: 'En ligne', get: (r) => r.playing,   fmt: (v) => nf.format(v) },
    favorites: { label: 'Favoris',  get: (r) => r.favorites, fmt: (v) => nf.format(v) },
    likes:     { label: 'Likes',    get: (r) => r.likes ?? -1, fmt: (v) => (v < 0 ? '—' : v + ' %') },
  };
  let metric = 'visits';

  $('#chips').innerHTML = Object.entries(METRICS).map(([k, m]) =>
    `<button class="chip" data-m="${k}" aria-pressed="${k === metric}">${m.label}</button>`).join('');

  const list = $('#rank');
  list.innerHTML = rows.map((r) => `
    <li class="rank-row spot reveal" data-id="${r.id}" style="--c:${esc(r.color)}">
      <span class="pos"></span>
      <img class="rank-icon" src="${esc(r.icon)}" alt="" loading="lazy">
      <div class="rank-main">
        <div class="rank-title"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a><span>${esc(r.genre)}</span></div>
        <div class="bar"><i></i></div>
        <div class="rank-meta">
          <span><b>${nf.format(r.visits)}</b> visites</span>
          <span><b>${nf.format(r.playing)}</b> en ligne</span>
          <span><b>${nf.format(r.favorites)}</b> favoris</span>
          <span><b>${r.likes === null ? '—' : r.likes + ' %'}</b> likes <small>(${r.up}👍 ${r.down}👎)</small></span>
        </div>
      </div>
      <strong class="rank-val"></strong>
    </li>`).join('');
  const el = Object.fromEntries([...list.children].map((li) => [li.dataset.id, li]));

  const sorted = () => [...rows].sort((a, b) => {
    const g = METRICS[metric].get;
    return g(b) - g(a) || b.visits - a.visits || b.favorites - a.favorites;
  });

  const apply = (animate) => {
    const order = sorted(), g = METRICS[metric].get, max = Math.max(1, ...order.map(g));
    const before = animate ? Object.fromEntries(order.map((r) => [r.id, el[r.id].getBoundingClientRect().top])) : null;
    order.forEach((r, i) => {
      const li = el[r.id];
      list.appendChild(li);
      li.querySelector('.pos').textContent = i + 1;
      li.classList.toggle('top', i === 0);
      li.querySelector('.bar i').style.setProperty('--w', Math.max(0, g(r)) / max * 100 + '%');
      li.querySelector('.rank-val').textContent = METRICS[metric].fmt(g(r));
    });
    if (before && !FX.still) {
      order.forEach((r) => {
        const li = el[r.id], dy = before[r.id] - li.getBoundingClientRect().top;
        if (!dy) return;
        li.style.transition = 'none'; li.style.transform = `translateY(${dy}px)`;
        requestAnimationFrame(() => requestAnimationFrame(() => { li.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)'; li.style.transform = ''; }));
      });
    }
    $('#note').textContent = metric === 'playing' && !sum('playing') ? 'Personne n’est en ligne au moment du relevé.' : '';
  };

  $('#chips').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b || b.dataset.m === metric) return;
    metric = b.dataset.m;
    document.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', c === b));
    apply(true);
  });

  apply(false);
  init();
  // la barre part de 0 puis se remplit quand la ligne apparaît
})();
