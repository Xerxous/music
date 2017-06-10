import ytdl from 'ytdl-core'

class Youtube {
  youtubePlay(environment, message, match) {
    environment.broadcast.end();
    let stream = ytdl(message.content, { filter : 'audioonly' });
    environment.broadcast.playStream(stream);
    environment.client.voiceConnections.last().playBroadcast(environment.broadcast);
    message.channel.send('Playing requested youtube video...');
  }

  youtubeCreateAlias(environment, message, match) {
    message.channel.send('DEBUG: youtubeCreateAlias');
  }

  youtubeDeleteAlias(environment, message, match) {
    message.channel.send('DEBUG: youtubeDeleteAlias');
  }
}

module.exports = new Youtube();
