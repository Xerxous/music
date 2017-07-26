import ytdl from 'ytdl-core';
import content from './content';

class Youtube {
  youtubePlay(environment, message, match) {
    environment.broadcast.destroy();

    const broadcast = environment.client.createVoiceBroadcast();
    environment.broadcast = broadcast;
    
    message.content = message.content.replace('youtu.be/', 'www.youtube.com/watch?v=')

    try {
      let stream = ytdl(message.content, { filter : 'audioonly' });
      environment.broadcast.playStream(stream);
      environment.client.voiceConnections.last().playBroadcast(environment.broadcast);
      message.channel.send(content.playResponse);
    } catch (error) {
      message.channel.send(content.badLinkResponse);
      console.log(`Invalid youtube link\n${error}`);
    }
  }

  youtubePlayPause(environment, message, match) {
    environment.broadcast.pause();
    message.channel.send(content.playPauseResponse);
  }

  youtubePlayResume(environment, message, match) {
    environment.broadcast.resume();
    message.channel.send(content.playResumeResponse);
  }

  youtubePlayStop(environment, message, match) {
    environment.broadcast.destroy();
    message.channel.send(content.playStopResponse);
  }
}

module.exports = new Youtube();
