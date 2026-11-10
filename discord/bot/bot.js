// ─────────────────────────────────────────────────────────────
// BOT — accueil des nouveaux, rôle Membre via ✅, commande /jeux
//   npm start
// ─────────────────────────────────────────────────────────────
import 'dotenv/config';
import { Client, GatewayIntentBits, Partials, EmbedBuilder, SlashCommandBuilder, REST, Routes } from 'discord.js';
import { readFileSync } from 'node:fs';

for (const k of ['DISCORD_TOKEN', 'GUILD_ID']) {
  if (!process.env[k]) { console.error(`❌ Variable d'environnement manquante : ${k}`); process.exit(1); }
}

const cfg = JSON.parse(readFileSync(new URL('./config.json', import.meta.url), 'utf8'));
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Reaction, Partials.User],
});

const findChannel = (guild, name) => guild.channels.cache.find((c) => c.name === name);
const findRole = (guild, name) => guild.roles.cache.find((r) => r.name === name);

// ── Slash commands ─────────────────────────────────────────
const commands = [
  new SlashCommandBuilder().setName('jeux').setDescription('La liste de nos jeux Roblox'),
  new SlashCommandBuilder().setName('site').setDescription('Le site de Taeok games'),
].map((c) => c.toJSON());

client.once('ready', async () => {
  console.log(`Bot connecté : ${client.user.tag}`);
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID), { body: commands });
  client.user.setActivity('nos jeux Roblox 🧱');
});

// ── Bienvenue ──────────────────────────────────────────────
client.on('guildMemberAdd', async (member) => {
  const g = member.guild;
  const ch = findChannel(g, 'bienvenue');
  if (!ch) return;
  const id = (n) => findChannel(g, n)?.id;
  ch.send({
    content: `${member}`,
    embeds: [new EmbedBuilder()
      .setColor(0xf5e642)
      .setTitle('🧱 Bienvenue sur Taeok games !')
      .setDescription(
        `On crée des serveurs Roblox et tu es au bon endroit pour y jouer en premier.\n\n` +
        `1. Lis les règles dans <#${id('règles')}> et clique sur ✅\n` +
        `2. Présente-toi dans <#${id('présentations')}>\n` +
        `3. Retrouve nos jeux dans <#${id('liens-jeux')}>\n\n` +
        `Tu veux rejoindre l'équipe (build / script / test) ? Dis-le dans ta présentation 👀`)
      .setThumbnail(member.user.displayAvatarURL())],
  });
});

// ── ✅ sur les règles → rôle Membre ────────────────────────
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch();
  const msg = reaction.message;
  if (reaction.emoji.name !== '✅' || msg.embeds[0]?.footer?.text !== 'rules') return;
  const role = findRole(msg.guild, '⭐ Membre');
  const member = await msg.guild.members.fetch(user.id);
  if (role && !member.roles.cache.has(role.id)) await member.roles.add(role);
});

// ── Commandes ──────────────────────────────────────────────
client.on('interactionCreate', async (i) => {
  if (!i.isChatInputCommand()) return;
  if (i.commandName === 'jeux') {
    await i.reply({
      embeds: [new EmbedBuilder().setColor(0xf5e642).setTitle('🎮 Nos jeux Roblox')
        .setDescription(cfg.games.map((g) => `**${g.name}** — *${g.genre}* · ${g.status}${g.url ? `\n▶️ ${g.url}` : ''}`).join('\n\n'))],
    });
  }
  if (i.commandName === 'site') {
    await i.reply('🌐 https://taeok-games.example.com (mets ton URL ici)');
  }
});

client.on('error', (e) => console.error('Erreur client :', e));
process.on('unhandledRejection', (e) => console.error('Rejet non géré :', e));
client.login(process.env.DISCORD_TOKEN);
