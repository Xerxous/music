import ytdl from 'ytdl-core'

class Youtube {
  constructor() {

  }

  youtubePlay(environment, message) {
    console.log('youtubePlay');
    let stream = ytdl(message.content, { filter : 'audioonly' });
    broadcast.playStream(stream);
    client.voiceConnections.last().playBroadcast(broadcast);
  }

  youtubeCreateAlias(environment, message) {
    console.log('youtubeCreateAlias');
  }

  youtubeDeleteAlias(environment, message) {
    console.log('youtubeDeleteAlias');
  }
}

module.exports =  new Youtube();
