import _ from 'lodash';
import ytdl from 'youtube-audio-stream';
import ytTitle from 'get-youtube-title';
import content from './content';

const { emptyQueue } = content;
const ytRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

const getPlayResponseMsg = (user, link) => {
  return `Playing next video: __${link}__ - Added by **${user}**.`;
}

const getAddedQueueMsg = (user, link) => {
  return `**${user}** added __${link}__ to the queue.`;
}

const getVideoTitle = (link, callback) => {
  console.log(link);
  const match = link.match(ytRegExp);
  const id = (match&&match[7].length==11)? match[7] : false;
  if (id) {
    ytTitle(id, callback);
  } else {
    ytTitle('<unknown>', callback);
  }
}

const play = (client, broadcast, nextSong) => {
  const stream = ytdl(nextSong);
  broadcast.playStream(stream);
  client.voiceConnections.last().playBroadcast(broadcast);
}

const renewBroadcast = (environment) => {
  environment.broadcast.destroy();
  const broadcast = environment.client.createVoiceBroadcast();
  broadcast.on('end', () => {
    next(environment, null)
    console.log('asdf')
  });
  return broadcast;
}

const sort = (queueList) => {
  const sortedList = [];
  let queueListMessage = '';
  queueList.map((element) => {
    sortedList[element[2]] = [element[0], element[1]];
  })
  sortedList.forEach((element, index) => {
    queueListMessage += `${index + 1}. __${element[1]}__ - added by **${element[0]}**\n`;
  })
  return queueListMessage;
}

export const list = (environment, callback) => {
  let queueList = [];
  let loopCounter = 0;
  environment.queue.forEach((nextSong, index) => {
    getVideoTitle(nextSong[1], (err, title) => {
      loopCounter++;
      queueList.push([nextSong[0], title, index]);
      if (loopCounter === environment.queue.length) {
        callback(sort(queueList));
        return;
      }
    });
  });
}

export const next = (environment, message, forced) => {
  if (forced) {
    environment.broadcast.end();
    return;
  }

  const { defaultChatChannel, client, queue } = environment;
  const nextSong = _.get(queue, '[0][1]');

  if (!nextSong) {
    defaultChatChannel.send(emptyQueue);
  } else if (!environment.broadcast.currentTranscoder) {
    const nextDj = _.get(queue, '[0][0]');
    queue.shift();
    environment.broadcast = renewBroadcast(environment);
    play(client, environment.broadcast, nextSong);
    getVideoTitle(nextSong, (error, title) => {
      defaultChatChannel.send(getPlayResponseMsg(nextDj, title));
    });
  } else {
    const author = message.author.username;
    const latestSong = queue[queue.length - 1][1];
    getVideoTitle(latestSong, (error, title) => {
      defaultChatChannel.send(getAddedQueueMsg(author, title));
    })
  }

  if (message) {
    message.delete();
  }
}
