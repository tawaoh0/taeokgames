(async () => {
  const { $, esc, nf, init, loadStats, slug } = window.FX;
  const D = window.TAEOK, S = await loadStats();
  $('#nav-discord').href = D.links.discord;

  const placeOf = (url) => (url && url.match(/games\/(\d+)/) || [])[1];
  const list = D.games.filter((g) => !g.placeholder);
  const g = list.find((x) => slug(x.name) === new URLSearchParams(location.search).get('g'));
  const root = $('#gp');

  if (!g) {
    root.innerHTML = `<section class="gp-empty"><h1>Jeu <span class="shine">introuvable</span></h1>
      <p class="lead">Ce jeu n'existe pas (ou plus).</p><a class="btn" href="index.html#jeux">← Voir tous les jeux</a></section>`;
    init(); return;
  }

  const st = S && S.games[placeOf(g.url)];
  const STATUS = { live: 'En ligne', beta: 'Bêta ouverte', soon: 'Bientôt' };
  const day = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const ymd = (iso) => String(iso).slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  const icon = g.icon || (st && st.icon);
  document.title = `${g.name} — codes et mises à jour · Taeok games`;
  document.querySelector('meta[name="description"]').content = `${g.name} : codes actifs, captures et fil des mises à jour. ${g.desc}`;
  root.style.setProperty('--c', g.color);

  // ── En-tête ──────────────────────────────────────────────
  const like = st && st.up + st.down ? Math.round(st.up / (st.up + st.down) * 100) : null;
  const head = `
    <a class="back" href="index.html#jeux">← Tous les jeux</a>
    <section class="gp-head">
      ${icon ? `<img class="gp-icon" src="${esc(icon)}" alt="">` : ''}
      <div class="gp-title">
        <div class="gp-badges"><span class="badge badge-${g.status}">${STATUS[g.status]}</span><span class="genre">${esc(g.genre)}</span></div>
        <h1>${esc(g.name)}</h1>
        <ul class="tags">${g.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>
      <div class="gp-cta">
        <a class="btn btn-big" href="${esc(g.url)}" target="_blank" rel="noopener">Jouer sur Roblox →</a>
        <a class="btn btn-ghost btn-big" href="${esc(D.links.discord)}" target="_blank" rel="noopener">Discord</a>
      </div>
    </section>
    ${st ? `<ul class="gp-stats spot">
      <li><b>${nf.format(st.visits)}</b><span>visites</span></li>
      <li><b>${nf.format(st.favorites)}</b><span>favoris</span></li>
      <li><b>${like === null ? '—' : like + ' %'}</b><span>likes</span></li>
      <li><b>${nf.format(st.playing)}</b><span>en ligne</span></li>
    </ul>` : ''}`;

  // ── Captures ─────────────────────────────────────────────
  const shots = [...(g.banner ? [g.banner] : []), ...(st ? st.thumbs : [])];
  const gallery = shots.length ? `
    <section class="gp-block"><h2 class="block-title">Captures</h2>
      <div class="gallery">${shots.map((s) => `<a href="${esc(g.url)}" target="_blank" rel="noopener"><img src="${esc(s)}" alt="Capture de ${esc(g.name)}" loading="lazy"></a>`).join('')}</div>
    </section>` : '';

  // ── Codes ────────────────────────────────────────────────
  const codes = (g.codes || []).map((c) => ({ ...c, off: c.expired || (c.expires && c.expires < today) }));
  const active = codes.filter((c) => !c.off), old = codes.filter((c) => c.off);
  const codeCard = (c) => `
    <li class="code spot${c.off ? ' off' : ''}">
      <div class="code-main"><code>${esc(c.code)}</code>${c.reward ? `<span class="reward">${esc(c.reward)}</span>` : ''}</div>
      <div class="code-side">
        <small>${c.off ? 'Expiré' : c.expires ? 'Expire le ' + day(c.expires + 'T12:00:00') : 'Sans date limite'}</small>
        ${c.off ? '' : `<button class="copy btn btn-sm" data-code="${esc(c.code)}">Copier</button>`}
      </div>
    </li>`;
  const codesBlock = `
    <section class="gp-block"><h2 class="block-title">Codes <span class="count">${active.length}</span></h2>
      ${active.length ? `<ul class="codes">${active.map(codeCard).join('')}</ul>` : `
        <div class="empty spot"><strong>Aucun code actif pour le moment.</strong>
          <p>Les nouveaux codes sont annoncés en premier sur le Discord.</p>
          <a class="btn btn-sm btn-ghost" href="${esc(D.links.discord)}" target="_blank" rel="noopener">Être prévenu sur Discord</a></div>`}
      ${old.length ? `<details class="old"><summary>Codes expirés (${old.length})</summary><ul class="codes">${old.map(codeCard).join('')}</ul></details>` : ''}
      <p class="hint">Comment l'utiliser : lance le jeu, ouvre le menu des codes, colle-le et valide. Les codes sont sensibles à la casse.</p>
    </section>`;

  // ── Fil des mises à jour ─────────────────────────────────
  const manual = (g.updates || []).map((u) => ({ date: u.date, title: u.title, notes: u.notes || [] }));
  const manualDays = new Set(manual.map((u) => ymd(u.date)));
  const auto = ((st && st.updateLog) || []).filter((d) => !manualDays.has(ymd(d))).map((d) => ({ date: d, title: 'Mise à jour du jeu', notes: [], auto: true }));
  const release = g.released || (st && st.created && ymd(st.created));
  const feed = [...manual, ...auto, ...(release ? [{ date: release, title: 'Sortie du jeu', notes: [], release: true }] : [])]
    .sort((a, b) => ymd(b.date).localeCompare(ymd(a.date)));
  const SHOWN = 6;
  const updatesBlock = `
    <section class="gp-block"><h2 class="block-title">Fil des mises à jour</h2>
      <ol class="feed">${feed.map((u, i) => `
        <li class="feed-item spot${u.release ? ' release' : ''}${i >= SHOWN ? ' extra' : ''}" ${i >= SHOWN ? 'hidden' : ''}>
          <time datetime="${esc(ymd(u.date))}">${day(ymd(u.date) + 'T12:00:00')}</time>
          <div><h3>${esc(u.title)}</h3>
          ${u.notes.length ? `<ul>${u.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : u.auto ? '<p>Nouvelle version publiée sur Roblox.</p>' : ''}</div>
        </li>`).join('')}</ol>
      ${feed.length > SHOWN ? `<button class="btn btn-ghost" id="more-updates">Voir les ${feed.length - SHOWN} précédentes</button>` : ''}
    </section>`;

  // ── Autres jeux ──────────────────────────────────────────
  const others = list.filter((x) => x !== g).slice(0, 4);
  const othersBlock = `
    <section class="gp-block"><h2 class="block-title">Autres jeux</h2>
      <div class="others">${others.map((o) => `
        <a class="other spot" href="jeu.html?g=${slug(o.name)}">${o.icon ? `<img src="${esc(o.icon)}" alt="">` : ''}<strong>${esc(o.name)}</strong><span>${esc(o.genre)}</span></a>`).join('')}</div>
    </section>`;

  root.innerHTML = head + `
    <section class="gp-block"><h2 class="block-title">À propos</h2><p class="lead gp-desc">${esc(g.desc)}</p></section>`
    + gallery + codesBlock + updatesBlock + othersBlock;

  // ── Interactions ─────────────────────────────────────────
  const toast = $('#toast');
  const say = (msg) => { toast.textContent = msg; toast.classList.add('show'); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('show'), 1800); };
  root.addEventListener('click', async (e) => {
    const b = e.target.closest('.copy');
    if (b) {
      const code = b.dataset.code;
      try { await navigator.clipboard.writeText(code); }
      catch { const t = document.createElement('textarea'); t.value = code; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
      b.textContent = 'Copié ✓'; setTimeout(() => { b.textContent = 'Copier'; }, 1600);
      say(`Code « ${code} » copié`);
    }
    if (e.target.id === 'more-updates') {
      root.querySelectorAll('.feed-item.extra').forEach((li) => { li.hidden = false; });
      e.target.remove();
    }
  });

  init();
})();
