// Effets partagés « Aurora glass » : reveal au scroll, halos, nav, curseur, boutons magnétiques.
window.FX = (() => {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nf = new Intl.NumberFormat('fr-FR');
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const countUp = (el) => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || '', start = performance.now(), dur = 1300;
    if (still) { el.textContent = nf.format(target) + suffix; return; }
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = nf.format(Math.round(target * e)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll?.('[data-count]').forEach(countUp);
      if (en.target.dataset.count) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });

  const reveal = (root = document) => root.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));

  const init = () => {
    reveal();
    // filet de sécurité : un saut de scroll rapide ne doit jamais laisser un bloc invisible
    addEventListener('scroll', () => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        if (el.getBoundingClientRect().top < 0) { el.classList.add('in'); io.unobserve(el); el.querySelectorAll('[data-count]').forEach(countUp); }
      });
    }, { passive: true });

    // nav mobile + ombre au scroll
    const burger = $('#burger'), nav = $('.nav');
    burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
    document.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));
    addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), { passive: true });

    // barre de progression
    const bar = $('#progress');
    const onScroll = () => { const max = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`; };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // halo qui suit le curseur sur toute surface .spot (délégué : marche aussi pour le contenu ajouté après)
    addEventListener('pointermove', (e) => {
      const el = e.target.closest?.('.spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });

    if (fine && !still) {
      const glow = $('#glow'), blobs = document.querySelectorAll('.aurora i');
      addEventListener('pointermove', (e) => {
        glow.style.opacity = 1;
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
        blobs.forEach((b, k) => { b.style.translate = `${x * (k + 1) * -40}px ${y * (k + 1) * -40}px`; });
      }, { passive: true });
      document.addEventListener('pointermove', (e) => {
        const b = e.target.closest?.('.btn:not(.btn-disabled)');
        if (!b) return;
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
      }, { passive: true });
      document.addEventListener('pointerout', (e) => { const b = e.target.closest?.('.btn'); if (b) b.style.transform = ''; });
    }
  };

  // ── Stats Roblox : lues au chargement (jamais intégrées au build) ──────────
  // On lit la copie distante (links.statsUrl, mise à jour par GitHub Actions) ET la copie livrée avec le site,
  // puis on garde la plus récente. Si tout échoue, la page s'affiche sans stats.
  const CDN = /^https:\/\/tr\.rbxcdn\.com\//;
  const clean = (j) => {
    if (!j || typeof j !== 'object' || !j.games) return null;
    const games = {};
    for (const [pid, g] of Object.entries(j.games)) {
      games[pid] = { ...g,
        visits: +g.visits || 0, playing: +g.playing || 0, favorites: +g.favorites || 0, up: +g.up || 0, down: +g.down || 0,
        updateLog: (Array.isArray(g.updateLog) ? g.updateLog : []).map(String).slice(0, 30),
        icon: CDN.test(g.icon) ? g.icon : null, thumbs: (g.thumbs || []).filter((u) => CDN.test(u) && /\/Image\//.test(u)) };
    }
    return { updatedAt: j.updatedAt, games };
  };
  const grab = async (url, ms) => {
    try {
      const c = new AbortController(), t = setTimeout(() => c.abort(), ms);
      const r = await fetch(url, { signal: c.signal });
      clearTimeout(t);
      return r.ok ? clean(await r.json()) : null;
    } catch { return null; }
  };
  const loadStats = async () => {
    const remote = window.TAEOK?.links?.statsUrl;
    const [a, b] = await Promise.all([remote ? grab(remote, 2500) : null, grab('data/stats.json', 4000)]);
    return [a, b].filter(Boolean).sort((x, y) => String(y.updatedAt).localeCompare(String(x.updatedAt)))[0] || null;
  };

  const slug = (name) => String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return { $, esc, nf, init, reveal, countUp, still, loadStats, slug };
})();
