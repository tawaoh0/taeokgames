// ─────────────────────────────────────────────────────────────
// SETUP — crée rôles, catégories et salons décrits dans config.json
// Idempotent : relance-le autant que tu veux, il ne duplique rien.
//   npm run setup
// ─────────────────────────────────────────────────────────────
import 'dotenv/config';
import { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { readFileSync } from 'node:fs';

const cfg = JSON.parse(readFileSync(new URL('./config.json', import.meta.url), 'utf8'));
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const log = (...a) => console.log('•', ...a);

client.once('ready', async () => {
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  await guild.roles.fetch();
  await guild.channels.fetch();
  log(`Connecté à « ${guild.name} »`);

  // ── Rôles ──────────────────────────────────────────────
  const roles = {};
  for (const r of cfg.roles) {
    let role = guild.roles.cache.find((x) => x.name === r.name);
    const permissions = (r.permissions || []).map((p) => PermissionFlagsBits[p]);
    if (!role) {
      role = await guild.roles.create({ name: r.name, color: r.color, hoist: r.hoist, permissions, mentionable: true });
      log('rôle créé  ', r.name);
    } else {
      log('rôle existe', r.name);
    }
    roles[r.name] = role;
  }

  // ── Helpers permissions ────────────────────────────────
  const everyone = guild.roles.everyone;
  const overwritesFor = ({ onlyRoles, readOnly }) => {
    const ow = [];
    if (onlyRoles) {
      ow.push({ id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] });
      onlyRoles.forEach((n) => roles[n] && ow.push({ id: roles[n].id, allow: [PermissionFlagsBits.ViewChannel] }));
    }
    if (readOnly) {
      ow.push({ id: everyone.id, deny: [PermissionFlagsBits.SendMessages] });
      ['🛡️ Staff', '👑 Fondateur'].forEach((n) => roles[n] && ow.push({ id: roles[n].id, allow: [PermissionFlagsBits.SendMessages] }));
    }
    return ow;
  };

  // ── Catégories + salons ────────────────────────────────
  const created = {};
  for (const cat of cfg.categories) {
    let category = guild.channels.cache.find((c) => c.type === ChannelType.GuildCategory && c.name === cat.name);
    if (!category) {
      category = await guild.channels.create({ name: cat.name, type: ChannelType.GuildCategory, permissionOverwrites: overwritesFor(cat) });
      log('catégorie  ', cat.name);
    }
    for (const ch of cat.channels) {
      const type = ch.type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText;
      // Discord normalise les noms des salons texte (minuscules, tirets) ; les vocaux gardent le nom tel quel.
      const slug = ch.name.toLowerCase().replace(/\s+/g, '-');
      let channel = guild.channels.cache.find((c) => c.parentId === category.id && (c.name === ch.name || c.name === slug));
      if (!channel) {
        channel = await guild.channels.create({
          name: ch.name, type, parent: category.id, topic: ch.topic,
          permissionOverwrites: overwritesFor({ onlyRoles: ch.onlyRoles || cat.onlyRoles, readOnly: ch.readOnly }),
        });
        log('  salon    ', ch.name);
      }
      created[ch.name] = channel;
    }
  }

  // ── Messages d'accueil (une seule fois) ────────────────
  const postOnce = async (channel, marker, payload) => {
    if (!channel || channel.type !== ChannelType.GuildText) return;
    const msgs = await channel.messages.fetch({ limit: 20 });
    if (msgs.some((m) => m.author.id === client.user.id && m.embeds[0]?.footer?.text === marker)) return;
    const sent = await channel.send(payload);
    if (marker === 'rules') await sent.react('✅');
    log('message    ', marker);
  };

  await postOnce(created['règles'], 'rules', {
    embeds: [new EmbedBuilder()
      .setColor(0xf5e642)
      .setTitle('Les règles — simples, courtes, non négociables')
      .setDescription(cfg.rules.map((r, i) => `**0${i + 1}** — ${r}`).join('\n\n') + '\n\n✅ **Réagis pour accepter les règles et débloquer le serveur.**')
      .setFooter({ text: 'rules' })],
  });

  await postOnce(created['liens-jeux'], 'games', {
    embeds: cfg.games.map((g, i) => new EmbedBuilder()
      .setColor(0xf5e642)
      .setTitle(`🎮 ${g.name}`)
      .setDescription(`*${g.genre}* · ${g.status}${g.url ? `\n▶️ ${g.url}` : '\n*(en développement)*'}`)
      .setFooter({ text: i === cfg.games.length - 1 ? 'games' : ' ' })),
  });

  log('Setup terminé ✔');
  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
