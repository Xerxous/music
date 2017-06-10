import Discord from 'discord.js'
import modules from './lib/initializer'
import config from './config'
import secret from './secret'

const client = new Discord.Client();
let environment;
let broadcast;
let defaultChatChannel;
let defaultVoiceChannel;

// Configures all settings and environment variables
client.on('ready', () => {
  console.log(`${config.botName} is online`);
  defaultChatChannel = client.channels.find('name', config.defaultChatChannel);
  defaultVoiceChannel = client.channels.find('name', config.defaultVoiceChannel);
  if (defaultVoiceChannel) {
    broadcast = client.createVoiceBroadcast();
    defaultVoiceChannel.join();
    console.log(`joined ${config.defaultVoiceChannel} voice channel`);
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
  if (message.author.id != config.botId) {
    for (let module in modules) {
      for (let key in modules[module].listens) {
        let match = message.content.match(key);
        if (match) {
          modules[module].module[modules[module].listens[key]](environment, message, match);
          break;
        }
      }
    }
  }
});

/*
 * in secret.json: key API_KEY contains bot api key
 * create before starting bot
 */
client.login(secret.API_KEY);
