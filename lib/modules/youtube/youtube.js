import * as player from './player';
import content from './content';

class Youtube {
  listQueue(environment, message, match) {
    if (!environment.queue.length) {
      return message.channel.send(content.emptyQueue);
    }
    player.list(environment, (info) => {
      message.channel.send('Current items in queue:\n' + info);
    });
  }

  addQueue(environment, message, match) {
    const link = match[1].replace('youtu.be/', 'www.youtube.com/watch?v=');
    environment.queue.push([message.author.username, link]);
    player.next(
      environment,
      message,
    );
  }

  next(environment, message, match) {
    player.next(
      environment,
      message,
      true
    );
  }

  restart(environment, message, match) {
    environment.client.voiceConnections.last().disconnect();
    environment.defaultVoiceChannel.join();
    environment.broadcast.end();
  }

  pause(environment, message, match) {
    environment.broadcast.pause();
    message.channel.send(content.playPauseResponse);
  }

  resume(environment, message, match) {
    environment.broadcast.resume();
    message.channel.send(content.playResumeResponse);
  }
}

module.exports = new Youtube();
