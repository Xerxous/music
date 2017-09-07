import ytdl from 'ytdl-core';
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

  pause(environment, message, match) {
    environment.broadcast.pause();
    message.channel.send(content.playPauseResponse);
  }

  resume(environment, message, match) {
    environment.broadcast.resume();
    message.channel.send(content.playResumeResponse);
  }

  stop(environment, message, match) {
    environment.queue = [];
    environment.broadcast.destroy();
    message.channel.send(content.playStopResponse);
  }
}

module.exports = new Youtube();
