// ─────────────────────────────────────────────────────────────
// TAEOK GAMES — données du site. Modifie ce fichier, rien d'autre.
// ─────────────────────────────────────────────────────────────
window.TAEOK = {
  links: {
    discord: 'https://discord.gg/BQVTuXNs9G',           // ← ton lien d'invitation Discord
    roblox:  'https://www.roblox.com/share/g/541274555', // ← ton groupe Roblox
    // Copie des stats mise à jour par GitHub Actions (dépôt PUBLIC) :
    // 'https://raw.githubusercontent.com/<ton-pseudo>/<ton-repo>/main/site/data/stats.json'
    statsUrl: 'https://raw.githubusercontent.com/tawaoh0/taeokgames/main/site/data/stats.json',
    youtube: '',
    tiktok:  '',
  },

  stats: [
    { value: 8,    suffix: '',  label: 'jeux publiés' },
    { value: 120,  suffix: '+', label: 'membres Discord' },
    { value: 2,    suffix: '',  label: 'projets en cours' },
    { value: 100,  suffix: '%', label: 'fait maison' },
  ],

  // Le jeu « à la une » est choisi automatiquement : c'est le dernier jeu créé (voir `released` / date de création Roblox).

  marquee: ['Build', 'Script Luau', 'Playtests', 'Events', 'Tournois', 'Sessions live', 'Recrutement ouvert'],

  // status : 'live' | 'beta' | 'soon'
  // Chaque jeu a sa page (jeu.html?g=<nom-du-jeu>). Deux listes à remplir à la main, par jeu :
  //   banner:  'img/mon-jeu.jpg'   // (facultatif) ta propre bannière 16:9, à déposer dans site/img/ ; utilisée à la une, dans le défilé et la galerie
  //   codes:   [{ code: 'WELCOME', reward: '500 gemmes', expires: '2026-12-31' }]   // expires: null = sans limite ; expired: true pour forcer « expiré »
  //   updates: [{ date: '2026-11-05', title: 'Les guildes', notes: ['Ajout des guildes', 'Correctifs'] }]
  // Les dates de mise à jour Roblox, elles, sont ajoutées toutes seules au fil des relevés.
  games: [
    {
      name: 'Terravora',
      released: '2026-09-17',   // date de sortie (sinon : date de création Roblox)
      status: 'live',
      genre: 'Guerre de territoires',
      desc: 'Pars à la conquête du monde ! Affronte d\'autres joueurs, conquiers leurs territoires, agrandis ton empire et grimpe les ranks jusqu\'à LÉGENDE.',
      url: 'https://www.roblox.com/fr/games/97611163590541/',
      tags: ['PvP', 'Ranks', 'Stratégie'],
      icon: 'https://tr.rbxcdn.com/180DAY-ee9a4f945c0634e15600a174af277069/512/512/Image/Png/noFilter',
      codes: [],
      updates: [],
      color: '#f5e642',
    },
    {
      name: 'Shroom Forge',
      status: 'live',
      genre: 'Idle · Collection',
      desc: 'Invoque des créatures, forge ton équipement et affronte des raids et des boss. Complète ta collection de champignons.',
      url: 'https://www.roblox.com/fr/games/86062750127411/',
      tags: ['Invocation', 'Raids', 'Guildes'],
      icon: 'https://tr.rbxcdn.com/180DAY-839655529f2847e1016e3eaccb367cb0/512/512/Image/Png/noFilter',
      codes: [],
      updates: [],
      color: '#b47bff',
    },
    {
      name: 'Break Up Ores',
      status: 'live',
      genre: 'Simulateur · Minage',
      desc: 'Creuse des grottes étincelantes avec ta pioche magique, déterre gemmes et cristaux rares et fais grandir ton empire minier.',
      url: 'https://www.roblox.com/fr/games/137524381681414/',
      tags: ['Minage', 'Gemmes', 'Simulateur'],
      icon: 'https://tr.rbxcdn.com/180DAY-c63f9c243ad98160245fd0d5d4007e8f/512/512/Image/Png/noFilter',
      codes: [],
      updates: [],
      color: '#4fd1ff',
    },
    {
      name: 'Mining Extraction Empire',
      status: 'live',
      genre: 'Tycoon · Minage',
      desc: 'Papy Marcel prend sa retraite et te laisse sa vieille mine : casse des blocs, vends par camion, train et avion, engage des ouvriers.',
      url: 'https://www.roblox.com/fr/games/72176707842436/',
      tags: ['Tycoon', 'Minage', 'Ouvriers'],
      icon: 'https://tr.rbxcdn.com/180DAY-92367f97eb6e34acc4a227b609cc2a06/512/512/Image/Png/noFilter',
      codes: [],
      updates: [],
      color: '#ff9f43',
    },
    {
      name: 'Steal an EGG in another World',
      status: 'live',
      genre: 'Aventure · Œufs',
      desc: 'Enfermé sous un dôme futuriste, explore une planète d\'œufs rares : trouve-les, fais-les éclore et ramène-les à ta base.',
      url: 'https://www.roblox.com/fr/games/104628684949493/',
      tags: ['Œufs', 'Exploration', 'Créatures'],
      icon: 'https://tr.rbxcdn.com/180DAY-66cbab671db68d7b4be6568d16c261a1/512/512/Image/Png/noFilter',
      codes: [],
      updates: [],
      color: '#7cf58a',
    },
    {
      name: 'Steal an Egg of KAIJU',
      status: 'live',
      genre: 'Œufs · Vol',
      desc: 'Attrape des œufs de Kaiju sur le tapis, fais-les grandir jusqu\'à devenir GÉANTS et vole ceux des autres… en défendant le tien.',
      url: 'https://www.roblox.com/fr/games/76816035021821/',
      tags: ['Kaiju', 'Vol', '36 espèces'],
      icon: 'https://tr.rbxcdn.com/180DAY-e784bf2bb4cd9557078230b9abd27efc/512/512/Image/Png/noFilter',
      codes: [],
      updates: [],
      color: '#ff5c3a',
    },
    {
      name: 'Pocket KAIJU Evolution',
      status: 'live',
      genre: 'Capture · Tour par tour',
      desc: 'Choisis ton premier kaiju, affaiblis les sauvages dans les hautes herbes puis capture-les. 8 arènes à puzzle à vaincre.',
      url: 'https://www.roblox.com/fr/games/117575285552293/',
      tags: ['Capture', 'Tour par tour', 'Arènes'],
      icon: 'https://tr.rbxcdn.com/180DAY-b4ffddb2904eacbfb2c9699e3961aaac/512/512/Image/Png/noFilter',
      codes: [],
      updates: [],
      color: '#22d3ee',
    },
    {
      name: 'Merge a Horde of Easter Eggs',
      status: 'live',
      genre: 'Fusion · Défense',
      desc: 'Fais éclore des œufs, fusionne tes monstres voxel et défends ton panier contre des vagues de méchants. 29 monstres à débloquer.',
      url: 'https://www.roblox.com/fr/games/104360879576033/',
      tags: ['Fusion', 'Défense', 'Voxel'],
      icon: 'https://tr.rbxcdn.com/180DAY-ae20988fa2a454dba9f2c1c3d8116eb8/512/512/Image/Png/noFilter',
      codes: [],
      updates: [],
      color: '#f472b6',
    },
    // Carte « Bientôt » : remplace-la par le prochain jeu quand il sort.
    { placeholder: true, color: '#a78bfa' },
  ],

  // Actus / events manuels. date : 'AAAA-MM-JJ' ou null → « Bientôt ».
  // Les SORTIES DE JEUX sont ajoutées toutes seules à partir de la liste des jeux (date = `released`,
  // sinon date de création Roblox), pas besoin de les recopier ici.
  events: [
    { date: null, title: 'Prochain jeu', desc: 'Un nouveau jeu arrive. Rejoins le Discord pour ne rien rater.' },
    { date: '2026-09-29', title: 'Ajout des guildes sur Shroom Forge', desc: 'Crée ou rejoins une guilde dans Shroom Forge et progresse avec ta team.', url: 'https://www.roblox.com/fr/events/6885583660423185042', linkLabel: 'Voir l\'event sur Roblox →' },
  ],

  team: [
    { name: 'Taeok',  role: 'Fondateur · Lead build', avatar: 'T' },
    { name: 'Pseudo', role: 'Scripteur Luau',          avatar: 'P' },
    { name: 'Pseudo', role: 'Modérateur · Events',      avatar: 'P' },
    { name: 'Toi ?',  role: 'On recrute',               avatar: '?', open: true },
  ],

  roles: [
    { icon: '🧱', name: 'Builder',   desc: 'Tu modélises dans Studio, tu as le sens du détail.' },
    { icon: '⌨️', name: 'Scripteur', desc: 'Luau, DataStores, systèmes de jeu.' },
    { icon: '🎮', name: 'Testeur',   desc: 'Tu casses tout et tu nous dis comment.' },
    { icon: '📣', name: 'Animateur', desc: 'Tu organises les events et fais vivre le Discord.' },
  ],

  rules: [
    'Respect avant tout. Zéro insulte, zéro harcèlement, zéro discrimination.',
    'Pas de spam, pas de pub pour d\'autres serveurs sans accord du staff.',
    'Pas de triche, d\'exploits ou de scripts malveillants sur nos jeux.',
    'Les bugs se signalent dans #bugs, pas en vocal à 3h du matin.',
    'Le staff a le dernier mot. Un souci ? Ouvre un ticket.',
  ],
};
