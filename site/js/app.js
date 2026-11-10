(async () => {
  const { $, esc, nf, init, reveal, loadStats } = window.FX;
  const D = window.TAEOK, S = await loadStats();

  // ── Données : stats Roblox rattachées à chaque jeu, tri par visites ──
  const placeOf = (url) => (url && url.match(/games\/(\d+)/) || [])[1];
  const withStats = D.games.map((g) => ({ ...g, st: S && S.games[placeOf(g.url)] || null }));
  const rankOf = (st) => [st ? st.visits : -1, st ? st.playing : 0, st ? st.favorites : 0];
  const real = withStats.filter((g) => !g.placeholder).sort((a, b) => {
    const A = rankOf(a.st), B = rankOf(b.st);
    return B[0] - A[0] || B[1] - A[1] || B[2] - A[2];
  });
  const games = [...real, ...withStats.filter((g) => g.placeholder)];
  const like = (st) => (st.up + st.down ? Math.round(st.up / (st.up + st.down) * 100) : null);

  // ── Liens ────────────────────────────────────────────────
  ['nav-discord', 'hero-discord', 'join-discord'].forEach((id) => { $('#' + id).href = D.links.discord; });
  $('#hero-roblox').href = D.links.roblox;
  $('#footer-links').innerHTML = Object.entries(D.links).filter(([k, u]) => u && k !== 'statsUrl')
    .map(([k, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${k}</a>`).join('')
    + '<a href="stats.html">stats</a>';

  // ── Stats du hero : chiffres réels si disponibles ────────
  let heroStats = D.stats;
  if (S) {
    const all = real.map((g) => g.st).filter(Boolean);
    const sum = (k) => all.reduce((n, s) => n + s[k], 0);
    heroStats = [
      { value: real.length, suffix: '', label: real.length > 1 ? 'jeux publiés' : 'jeu publié' },
      { value: sum('visits'), suffix: '', label: 'visites' },
      { value: sum('favorites'), suffix: '', label: 'favoris' },
      { value: sum('up'), suffix: '', label: 'likes' },
    ];
  }
  $('#stats').innerHTML = heroStats.map((s) =>
    `<li><strong data-count="${s.value}" data-suffix="${esc(s.suffix)}">0${esc(s.suffix)}</strong><span>${esc(s.label)}</span></li>`).join('');

  // ── Showreel : captures de nos jeux qui défilent en 3D ────
  const shots = [];
  // Un jeu avec moins de 2 captures (ex. tout juste sorti : l'image Roblox peut être un gris par défaut)
  // est représenté par une tuile « icône » plutôt qu'une capture douteuse.
  const pools = real.filter((g) => g.st).map((g) => g.st.thumbs.length >= 2
    ? g.st.thumbs.map((src) => ({ src, name: g.name, url: g.url }))
    : [{ icon: g.icon || g.st.icon, color: g.color, name: g.name, url: g.url }]);
  for (let k = 0; pools.some((p) => k < p.length); k++) pools.forEach((p) => p[k] && shots.push(p[k]));
  if (shots.length >= 6) {
    const ROWS = 3;
    $('#reel').innerHTML = `<div class="reel-tilt">` + Array.from({ length: ROWS }, (_, r) => {
      const tiles = shots.filter((_, i) => i % ROWS === r).map((s) =>
        s.icon
          ? `<a class="reel-tile reel-icon spot" style="--c:${esc(s.color)}" href="${esc(s.url)}" target="_blank" rel="noopener" tabindex="-1"><img class="ic" src="${esc(s.icon)}" alt="" decoding="async"><span>${esc(s.name)}</span></a>`
          : `<a class="reel-tile spot" href="${esc(s.url)}" target="_blank" rel="noopener" tabindex="-1"><img src="${esc(s.src)}" alt="" decoding="async"><span>${esc(s.name)}</span></a>`).join('');
      return `<div class="reel-row r${r}"><div class="reel-track">${tiles}${tiles}</div></div>`;
    }).join('') + `</div>`;
  } else { $('#reel').remove(); }

  // ── Jeu mis en avant ─────────────────────────────────────
  if (D.featured) {
    const f = D.featured;
    $('#featured').innerHTML = `
      <article class="featured spot reveal">
        <a class="featured-media" href="${esc(f.url)}" target="_blank" rel="noopener" aria-label="Jouer à ${esc(f.name)}">
          <img src="${esc(f.thumb)}" alt="" loading="lazy">
          <span class="featured-play">▶</span>
        </a>
        <div class="featured-body">
          <p class="kicker">À la une · sur Roblox</p>
          <div class="featured-title">
            <img class="featured-icon" src="${esc(f.icon)}" alt="" loading="lazy">
            <div><h2>${esc(f.name)}</h2><span>${esc(f.tagline)}</span></div>
          </div>
          <p class="featured-desc">${esc(f.desc)}</p>
          <ul class="tags">${f.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          <div class="featured-cta">
            <a class="btn" href="${esc(f.url)}" target="_blank" rel="noopener">Jouer sur Roblox →</a>
            <a class="btn btn-ghost" href="${esc(D.links.discord)}" target="_blank" rel="noopener">Discord</a>
          </div>
        </div>
      </article>`;
  }

  // ── Marquee ──────────────────────────────────────────────
  $('#marquee').innerHTML = [...D.marquee, ...D.marquee].map((t) => `<span>${esc(t)}</span><i>◆</i>`).join('');

  // ── Jeux (triés par stats) ───────────────────────────────
  const STATUS = { live: 'En ligne', beta: 'Bêta ouverte', soon: 'Bientôt' };
  $('#games').innerHTML = games.map((g, i) => {
    if (g.placeholder) return `
      <article class="game game-soon reveal" style="--accent:${esc(g.color)};--i:${i}" aria-label="Jeu à venir">
        <span class="soon-mark">?</span><h3>Bientôt</h3>
      </article>`;
    const st = g.st, lk = st && like(st);
    return `
      <article class="game spot reveal" style="--accent:${esc(g.color)};--i:${i}">
        <div class="game-head">
          ${g.icon ? `<img class="game-icon" src="${esc(g.icon)}" alt="" loading="lazy">` : '<span></span>'}
          ${S ? `<span class="rank rank-${i + 1}" title="Classement par visites">#${i + 1}</span>` : ''}
        </div>
        <div class="game-top">
          <span class="badge badge-${g.status}">${STATUS[g.status]}</span>
          <span class="genre">${esc(g.genre)}</span>
        </div>
        <h3>${esc(g.name)}</h3>
        <p>${esc(g.desc)}</p>
        ${st ? `<ul class="gstats">
          <li><b>${nf.format(st.visits)}</b><span>visites</span></li>
          <li><b>${nf.format(st.favorites)}</b><span>favoris</span></li>
          <li><b>${lk === null ? '—' : lk + ' %'}</b><span>likes</span></li>
        </ul>` : ''}
        <ul class="tags">${g.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        ${g.url ? `<a class="btn btn-sm" href="${esc(g.url)}" target="_blank" rel="noopener">Jouer →</a>`
                : `<span class="btn btn-sm btn-disabled">En développement</span>`}
      </article>`;
  }).join('');

  // ── Events & actus : manuels + sorties de jeux auto, récents d'abord ──
  const fmt = (iso) => {
    const d = new Date(iso + 'T12:00:00');
    return { day: d.getDate(), month: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''), year: d.getFullYear() };
  };
  const releases = real.map((g) => {
    const date = g.released || (g.st && g.st.created && g.st.created.slice(0, 10));
    return date && { date, title: 'Sortie de ' + g.name, desc: 'Nouveau jeu en ligne : ' + g.genre + '.', url: g.url, linkLabel: 'Jouer sur Roblox →', game: g };
  }).filter(Boolean);
  const feed = [...D.events, ...releases].sort((a, b) => (b.date || '9999').localeCompare(a.date || '9999'));
  const SHOWN = 5, thisYear = new Date().getFullYear();
  $('#events-list').innerHTML = feed.map((e, i) => {
    const link = e.url ? `<a class="event-link" href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.linkLabel || 'En savoir plus →')}</a>` : '';
    let t = `<time><b>?</b><span>bientôt</span></time>`;
    if (e.date) { const f = fmt(e.date); t = `<time datetime="${e.date}"><b>${f.day}</b><span>${f.month}${f.year !== thisYear ? ' ' + f.year : ''}</span></time>`; }
    const icon = e.game && e.game.icon ? `<img class="event-icon" src="${esc(e.game.icon)}" alt="" loading="lazy">` : '';
    return `<li class="event spot reveal${i >= SHOWN ? ' extra' : ''}" style="--i:${Math.min(i, SHOWN)}" ${i >= SHOWN ? 'hidden' : ''}>${t}<div><h3>${esc(e.title)}</h3><p>${esc(e.desc)}</p>${link}</div>${icon}</li>`;
  }).join('');
  if (feed.length > SHOWN) {
    const more = $('#events-more');
    more.hidden = false;
    more.textContent = `Voir les ${feed.length - SHOWN} actus précédentes`;
    more.addEventListener('click', () => {
      document.querySelectorAll('.event.extra').forEach((li) => { li.hidden = false; li.classList.add('in'); });
      more.remove();
    });
  }

  // ── Équipe / rôles / règles ──────────────────────────────
  $('#team').innerHTML = D.team.map((m, i) => `
    <div class="member spot reveal ${m.open ? 'open' : ''}" style="--i:${i}">
      <span class="avatar">${esc(m.avatar)}</span><strong>${esc(m.name)}</strong><span>${esc(m.role)}</span>
    </div>`).join('');
  $('#roles').innerHTML = D.roles.map((r) =>
    `<li class="spot"><span class="role-icon">${r.icon}</span><div><strong>${esc(r.name)}</strong><p>${esc(r.desc)}</p></div></li>`).join('');
  $('#rules').innerHTML = D.rules.map((r, i) => `<li class="spot reveal" style="--i:${i}"><span>0${i + 1}</span><p>${esc(r)}</p></li>`).join('');
  $('#stats').classList.add('spot');

  init();
})();
