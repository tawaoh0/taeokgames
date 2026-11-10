// ─────────────────────────────────────────────────────────────
// Relève les stats Roblox publiques du groupe et écrit site/data/stats.json
//   node scripts/fetch-stats.mjs            (Node 18+, aucune dépendance)
// Les API Roblox bloquent les appels depuis un navigateur (CORS) : on relève
// donc les chiffres ici, puis le site les lit comme un fichier statique.
// Lancé chaque jour par GitHub Actions (.github/workflows/stats.yml) : aucun build Netlify nécessaire.
// ─────────────────────────────────────────────────────────────
import { writeFileSync } from 'node:fs';

const GROUP_ID = process.env.GROUP_ID || '541274555';
const OUT = new URL('../site/data/stats.json', import.meta.url);

async function get(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url);
    if (r.ok) return r.json();
    if (r.status === 429) await new Promise((s) => setTimeout(s, 1500 * (i + 1)));
    else throw new Error(`${r.status} sur ${url}`);
  }
  throw new Error(`Trop de tentatives : ${url}`);
}

async function main() {
const groupGames = (await get(`https://games.roblox.com/v2/groups/${GROUP_ID}/games?accessFilter=Public&limit=100&sortOrder=Asc`)).data;
const ids = groupGames.map((g) => g.id).join(',');

const [details, votes, icons, thumbs] = await Promise.all([
  get(`https://games.roblox.com/v1/games?universeIds=${ids}`),
  get(`https://games.roblox.com/v1/games/votes?universeIds=${ids}`),
  get(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&size=512x512&format=Png`),
  get(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${ids}&size=768x432&format=Png&countPerUniverse=4`),
]);

const voteBy = Object.fromEntries(votes.data.map((v) => [v.id, v]));
const iconBy = Object.fromEntries(icons.data.map((i) => [i.targetId, i.imageUrl]));
const thumbBy = Object.fromEntries(thumbs.data.map((t) => [t.universeId, t.thumbnails.filter((x) => x.state === 'Completed' && x.imageUrl).map((x) => x.imageUrl)]));

const games = {};
for (const g of details.data) {
  games[g.rootPlaceId] = {
    universeId: g.id,
    name: g.name,
    playing: g.playing ?? 0,
    visits: g.visits ?? 0,
    favorites: g.favoritedCount ?? 0,
    up: voteBy[g.id]?.upVotes ?? 0,
    down: voteBy[g.id]?.downVotes ?? 0,
    created: g.created,
    updated: g.updated,
    icon: iconBy[g.id] || null,
    thumbs: thumbBy[g.id] || [],
  };
}

if (!Object.keys(games).length) throw new Error('Aucun jeu renvoyé par Roblox');
const payload = { groupId: GROUP_ID, updatedAt: new Date().toISOString(), games };
writeFileSync(OUT, JSON.stringify(payload, null, 1) + '\n');
console.log(`✔ ${Object.keys(games).length} jeux — ${OUT.pathname}`);
for (const [pid, g] of Object.entries(games)) console.log(`  ${pid}  ${g.visits} visites · ${g.playing} en ligne · ${g.favorites} favoris · ${g.up}👍 ${g.down}👎  ${g.name}`);
}

await main();
