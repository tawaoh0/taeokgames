# Discord « Taeok games » — structure du serveur

> Cette structure peut être créée **automatiquement** avec le bot (`bot/setup.js`), ou à la main en suivant ce document.

## Rôles (du plus haut au plus bas)

| Rôle | Couleur | Qui | Permissions clés |
|---|---|---|---|
| 👑 Fondateur | `#f5e642` | Toi | Administrateur |
| 🛡️ Staff | `#ff5c3a` | Modos de confiance | Gérer messages/salons, expulser, bannir, muter |
| 🧱 Builder | `#4fd1ff` | Membres de l'équipe build | Accès aux salons Studio |
| ⌨️ Scripteur | `#b47bff` | Membres de l'équipe code | Accès aux salons Studio |
| 🎮 Testeur | `#7cf58a` | Playtesters validés | Accès `#playtests` |
| ⭐ Membre | `#9a968e` | Tout le monde après validation des règles | Écrire partout dans « Communauté » |
| 🤖 Bot | `#5865f2` | Le bot | Gérer rôles + salons (pour le setup) |

## Salons

### 📌 ACCUEIL
- `#bienvenue` — message auto quand quelqu'un arrive (lecture seule)
- `#règles` — les 5 règles + bouton/réaction ✅ pour obtenir ⭐ Membre (lecture seule)
- `#annonces` — sorties de jeux, mises à jour, events (staff seulement, @everyone ping)
- `#présentations` — les nouveaux se présentent

### 🎮 NOS JEUX
- `#liens-jeux` — un message par jeu avec le lien Roblox (lecture seule)
- `#nouveautés` — changelogs / patch notes
- `#bugs` — un bug = un message (nom du jeu + description + screenshot)
- `#idées` — suggestions de la commu
- `#playtests` — réservé 🎮 Testeur : builds en avance, feedback

### 💬 COMMUNAUTÉ
- `#général` — discussion libre
- `#screens-et-clips` — captures, vidéos, moments funs
- `#cherche-équipe` — pour trouver des gens avec qui jouer
- `#hors-sujet` — tout le reste
- `#memes`

### 🛠️ STUDIO (Builder / Scripteur / Staff uniquement)
- `#dev-général` — organisation, todo, qui fait quoi
- `#build` — modèles, maps, assets
- `#scripts` — Luau, aide, revue de code
- `#ressources` — tutos, plugins, liens utiles

### 🔊 VOCAUX
- `🔊 Salon principal`
- `🎮 Jeu 1` / `🎮 Jeu 2`
- `🛠️ Studio` (équipe)
- `🎤 Event` (utilisé pendant les soirées)
- `😴 AFK`

### 🔒 STAFF (Staff / Fondateur)
- `#staff-chat`
- `#logs-modération`
- `#tickets` — support (via bot ou manuellement)

## Messages types

### `#bienvenue` (envoyé automatiquement par le bot)
> 🧱 **Bienvenue {membre} sur Taeok games !**
> On crée des serveurs Roblox et tu es au bon endroit pour y jouer en premier.
> 1. Lis les règles dans <#règles> et clique sur ✅
> 2. Présente-toi dans <#présentations>
> 3. Retrouve nos jeux dans <#liens-jeux>
> Tu veux rejoindre l'équipe (build / script / test) ? Dis-le dans ta présentation 👀

### `#règles`
> **Les règles — simples, courtes, non négociables**
> **01** — Respect avant tout. Zéro insulte, zéro harcèlement, zéro discrimination.
> **02** — Pas de spam, pas de pub pour d'autres serveurs sans accord du staff.
> **03** — Pas de triche, d'exploits ou de scripts malveillants sur nos jeux.
> **04** — Les bugs se signalent dans <#bugs>, pas en vocal à 3h du matin.
> **05** — Le staff a le dernier mot. Un souci ? Ouvre un ticket dans <#tickets>.
>
> ✅ Réagis pour accepter les règles et débloquer le serveur.

### `#liens-jeux` (un message par jeu)
> 🎮 **Taeok Tycoon** — *Tycoon* · 🟢 En ligne
> Construis ton empire bloc par bloc.
> ▶️ https://www.roblox.com/games/XXXXXXX

## Paramètres du serveur recommandés
- **Niveau de vérification** : Moyen (compte Discord > 5 min)
- **Filtre de contenu explicite** : tous les membres
- **Salon par défaut** : `#bienvenue`
- **Serveur communautaire** : activé (Paramètres → Communauté) → débloque les salons d'annonces et de forum
- **Onboarding** : question « Tu es plutôt ? » → Joueur / Builder / Scripteur → attribue les rôles automatiquement
