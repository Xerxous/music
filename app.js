import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import secret from './secret.json'

const client = new Discord.Client();
const broadcast = client.createVoiceBroadcast();

client.on('ready', () => {
  console.log('I am ready!');

  client.channels.find('name', 'Music Room').join();
});

client.on('message', message => {
  let regex = message.content.match(/\/romano (https?\:\/\/)?(www\.youtube\.com)\/.+/);
  let channel = client.channels.find('name', 'Music Room');

  if (regex) {
    console.log(regex);
    let stream = ytdl(message.content, { filter : 'audioonly' });
    broadcast.playStream(stream);
    const dispatcher = client.voiceConnections.last().playBroadcast(broadcast);
  }
});

client.login(secret.API_KEY);
