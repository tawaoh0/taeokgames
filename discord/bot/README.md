# Bot Taeok games

Deux scripts :
- `npm run setup` → crée **tout le serveur** (rôles, catégories, salons, permissions, message de règles, liens des jeux) d'après `config.json`. Relançable sans doublons.
- `npm start` → bot permanent : message de bienvenue, rôle ⭐ Membre quand on réagit ✅ aux règles, commandes `/jeux` et `/site`.

## Installation (5 min)

1. **Crée l'application** : https://discord.com/developers/applications → *New Application* → « Taeok games »
2. Onglet **Bot** → *Reset Token* → copie le token. Active **Server Members Intent** et **Message Content Intent**.
3. Onglet **OAuth2 → URL Generator** : coche `bot` + `applications.commands`, permissions **Administrator** (simple pour le setup, tu pourras réduire après). Ouvre l'URL générée et ajoute le bot sur ton serveur.
4. Dans Discord, active le *Mode développeur* (Paramètres → Avancés), clic droit sur ton serveur → *Copier l'identifiant*.
5. Ici :
   ```bash
   cp .env.example .env   # puis remplis DISCORD_TOKEN et GUILD_ID
   npm install
   npm run setup
   npm start
   ```

> ⚠️ Ne partage jamais `.env`. Le rôle du bot doit être **au-dessus** des rôles qu'il crée dans la liste des rôles (sinon il ne pourra pas attribuer ⭐ Membre).

## Personnaliser
Tout est dans `config.json` : rôles, salons, règles, jeux. Modifie puis relance `npm run setup`.

## Déployer sur Railway (bot 24/7, Mac éteint)

Le dossier contient déjà `Dockerfile` + `railway.json`. Seul `bot.js` tourne sur Railway ; `npm run setup` se lance une fois depuis ton Mac.

1. Mets ce dossier (`discord/bot`) sur GitHub (repo privé). `.env` est ignoré par git : **jamais** de token sur GitHub.
2. https://railway.app → *New Project* → *Deploy from GitHub repo* → choisis le repo.
3. Onglet **Variables** → ajoute `DISCORD_TOKEN` et `GUILD_ID` (mêmes valeurs que ton `.env`).
4. Railway build l'image et lance `node bot.js`. Onglet **Deployments → Logs** : tu dois voir `Bot connecté : Taeok games#1234`.
5. Pas de domaine / port à configurer : un bot Discord n'expose rien, il se connecte lui-même à Discord.

Chaque `git push` redéploie automatiquement. Le plan gratuit / Hobby suffit largement (le bot consomme ~50 Mo de RAM).
