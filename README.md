# Taeok games — site communautaire + Discord

Groupe de créateurs de serveurs Roblox.

- **Site** : `site/index.html` (statique, vanilla JS). Toutes les données (liens, jeux, events, équipe, règles) sont dans `site/js/data.js`.
- **Discord** : `discord/STRUCTURE.md` décrit le serveur complet ; `discord/bot/` le crée automatiquement et l'anime (voir son README).

## Lancer le site en local
```bash
npx serve site
```
## À faire avant de publier
1. Mettre le vrai lien d'invitation Discord et l'URL du groupe Roblox dans `site/js/data.js` → `links`.
2. Remplacer les jeux d'exemple par les vrais (nom, statut, lien Roblox).
3. Compléter l'équipe et les prochains events.

## Stats des jeux (page `stats.html` + classement de l'accueil)
Les API Roblox refusent les appels depuis un navigateur : les chiffres sont relevés par un script, puis lus par le site.

```bash
node scripts/fetch-stats.mjs     # récupère visites, joueurs, favoris, likes + captures de tous les jeux du groupe
```
- Écrit `site/js/stats.js` (fichier généré, ne pas modifier à la main).
- Les cartes de l'accueil sont triées par visites ; la page Stats permet aussi de trier par joueurs en ligne, favoris et likes.
- Un jeu ajouté dans `site/js/data.js` récupère ses stats tout seul (le lien `…/games/<placeId>/` fait le lien).
- À relancer régulièrement (ex. une fois par jour) avant de publier le site.

## Publier sur Netlify sans consommer de crédits pour les stats
Netlify ne fait que **servir** `site/` : pas de build, pas de fonction, pas de rebuild quotidien.
Les stats sont relevées par **GitHub Actions** (gratuit), puis le site les lit au chargement de la page.

1. Mets le dossier `taeok-games` sur GitHub dans un dépôt **public** (aucun secret dedans : `.env` est ignoré).
2. Netlify → *Add new site* → *Import from Git*. `netlify.toml` règle tout, et sa règle `ignore` ne redéploie que si `site/` change
   (les commits de stats et les modifs du bot Discord ne coûtent aucun déploiement).
3. Dans `site/js/data.js`, renseigne `links.statsUrl` :
   `https://raw.githubusercontent.com/<ton-pseudo>/<ton-repo>/main/site/data/stats.json`
4. GitHub → onglet *Actions* → *Relevé des stats Roblox* → *Run workflow* pour tester. Ensuite c'est automatique toutes les 6 h
   (`.github/workflows/stats.yml`). Le workflow ne commit que si les chiffres ont changé, avec `[skip ci]`.

Le site garde aussi une copie de `site/data/stats.json` livrée avec lui : si la copie distante est injoignable, il utilise la plus récente des deux.
Relevé manuel : `node scripts/fetch-stats.mjs`.

Actus : les sorties de jeux apparaissent toutes seules (date = `released` dans `site/js/data.js`, sinon date de création Roblox). Les autres events se saisissent dans `events` du même fichier.
