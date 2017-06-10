import Discord from 'discord.js'
import secret from './secret.json'
const client = new Discord.Client();
const broadcast = client.createVoiceBroadcast()

client.on('ready', () => {
  console.log('I am ready!');
  client.channels.find('name', 'Music Room').join()
    .then(connection => {
      console.log('Connected!')
      broadcast.playFile('./music/tuvan.mp3')
      for (const connection of client.voiceConnections.values()) {
        connection.playBroadcast(broadcast)
      }
    })
    .catch(console.error);
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pon');
  }
});

client.login(secret.API_KEY);
