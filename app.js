import Discord from 'discord.js';
import modules from './lib/initializer';
import config from './config';
import secret from './secret';
import colors from 'colors';

const client = new Discord.Client();
let environment;
let broadcast;
let defaultChatChannel;
let defaultVoiceChannel;
let mods;

// Configures all settings and environment variables
client.on('ready', () => {
  console.log(`***${config.botName} is online***`.cyan.underline.bold);
  defaultChatChannel = client.channels.find('name', config.defaultChatChannel);
  defaultVoiceChannel = client.channels.find('name', config.defaultVoiceChannel);
  mods = modules(config.commandPrefix);
  if (defaultVoiceChannel) {
    broadcast = client.createVoiceBroadcast();
    defaultVoiceChannel.join();
    console.log(`joined ${config.defaultVoiceChannel} voice channel`.yellow);
  }
  // expand the environment variable as necessary
  environment = {
    client,
    config,
    broadcast,
    defaultChatChannel,
    defaultVoiceChannel
  }
});

client.on('message', message => {
  if (!client.voiceConnections.last()) {
    environment.defaultVoiceChannel.join();
  }
  console.log(`Message sent: ${message.content}`);
  for (let module in mods) {
    for (let key in mods[module].listens) {
      let match = message.content.match(`${config.commandPrefix} ${key}`);
      if (match) {
        console.log(`Found match. Calling ${mods[module].listens[key]}`);
        mods[module].module[mods[module].listens[key]](environment, message, match);
        break;
      }
    }
  }
});

/*
 * in secret.json: key API_KEY contains bot api key
 * create before starting bot
 */
client.login(secret.API_KEY);
