const { Discord, MessageEmbed, Client } = require("discord.js");
const prefix = "?"
const ytdl = require("ytdl-core");
const client = new Client();

const Queue = new Map();
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ activity: { name: `${prefix}help` }, status: 'online' })
});

client.on("message", async message => {
  const ServerQueue = Queue.get(message.guild.id);
  
  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, ServerQueue);
    return;
  }
  
    if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, ServerQueue);
    return;
  }
  
      if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, ServerQueue);
    return;
  }
  
    if (message.content.startsWith(`${prefix}connect`)) {
    if (!message.member.voice.channel) return message.channel.send(":warning: You're currently not in a voice channel.");
      const join = await message.member.voice.channel.join();
      message.channel.send('<:success:742073883108180018> **Connected to voice channel**')
  }

 if (message.content.startsWith(`${prefix}disconnect`)) {
    if (!message.member.voice.channel) return message.channel.send(":warning: You must be in a channel to disconnect the bot!");
    var leave = await message.member.voice.channel.leave();
    message.channel.send("<:success:742073883108180018> **Disconnected from channel**")
  }
  
  if (message.content.startsWith(`${prefix}help`)) {
    const date = new Date();
    const help = new MessageEmbed() 
    .setTitle('Help') 
    .setColor('#ffffff') 
    .setDescription('**?help** - Displays all commands\n**?play <youtube_url>** - Plays a song\n**?skip** - Skips the playing song\n**?stop** - Stops the queue\n**?connect** - Joins a voice channel\n**?disconnect** - Disconnects from a voice channel\n**?queue** - Displays the current song queue')
    .setTimestamp()
    .setFooter(`${message.author.tag}`, message.author.avatarURL()) 
    message.channel.send(help)
  }
  
  if (message.content.startsWith(`${prefix}queue`)) {
    queue(message, message.guild)
  }
  
});

async function execute(message, ServerQueue) {
  const args = message.content.split(" ");
const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send(":warning: You must be in a voice channel to play music!")
  const perms = voiceChannel.permissionsFor(message.client.user);
  if (!perms.has("CONNECT")) return message.channel.send(":warning: I cannot connect to this channel!")
  if (!perms.has("SPEAK")) return message.channel.send(":warning: I cannot speak in this channel!")
  
  if (!args[1]) return message.channel.send(':warning: Please enter a valid YouTube link.');
  
  try {
    const songInfo = await ytdl.getInfo(args[1]);
    let length = songInfo.videoDetails.lengthSeconds
    if (length > 3600) {
      message.channel.send(`<:error:742048687793897534> Your song must be under **1 hour**.`)
      return;
    }
  } catch {
    console.log('Error occured')
  }
  
  try {
  const songInfo = await ytdl.getInfo(args[1]);
  let islive = songInfo.videoDetails.isLive
  if (islive == true) {
    message.channel.send(`<:error:742048687793897534> Your song cannot be **live**.`)
    return;
  }
  } catch {
    console.log('Error occured')
  }

  if (!ServerQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    Queue.set(message.guild.id, queueContruct);

    try {
   const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    length: songInfo.videoDetails.lengthSeconds
  };
      
      queueContruct.songs.push(song);
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      if(args[1] === "@everyone" || args[1] == "@here") {
      message.channel.send(`<:error:742048687793897534> An error occured when trying to play...nice try.`)
      } else {
        message.channel.send(`<:error:742048687793897534> An error occured when trying to play **${args[1]}**.`)
      }
      Queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    try {
   const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url
  };
    ServerQueue.songs.push(song);
    return message.channel.send(`:thumbsup: **${song.title}** has been added to the queue!`);    
    } catch(err) {
     if(args[1] === "@everyone" || args[1] === "@here") {
      message.channel.send(`<:error:742048687793897534> An error occured when trying to play...nice try.`)
      } else {
        message.channel.send(`<:error:742048687793897534> An error occured when trying to play **${args[1]}**.`)
      }
    }
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel) return message.channel.send(":warning: You must be in a channel to stop music!");
  if (!serverQueue)
    return message.channel.send(":warning: The queue is currently empty.");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel) return message.channel.send(":warning: You must be in a channel to stop music!");
  try {
   serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  } catch {
    message.channel.send("<:error:742048687793897534> The queue is empty.")
    return;
  }
message.channel.send("<:success:742073883108180018> **Stopped**")
}

function play(guild, song) {
  const serverQueue = Queue.get(guild.id);
  if (!song) {
    Queue.delete(guild.id);
    return;
  }
  
  try {

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url), { filter: 'audioonly' })
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`:musical_note:  Now playing: **${song.title}**`);
  } catch {
   serverQueue.textChannel.send(`<:error:742048687793897534>  An error occured when trying to play **${song.title}.**`)
  serverQueue.songs.shift();
    return;
  }
}

function queue(msg, guild) {
  const serverQueue = Queue.get(guild.id);
 try {
   let queuetxt = ""
   var x;
   for (x in serverQueue.songs) {
    if(x == 0) {
       queuetxt += `\n**Playing:** ${serverQueue.songs[x].title}\n`
    } else {
      queuetxt += `\n**${x}.** ${serverQueue.songs[x].title}`
    }
     }
   console.log(queuetxt)
     const QueueEmbed = new MessageEmbed()
     .setTitle('Queue')
     .setColor(0xFFFF00)
     .setDescription(queuetxt)
     .setTimestamp()
     .setFooter(`${msg.author.tag}`, msg.author.avatarURL()) 
     msg.channel.send(QueueEmbed)
 } catch(e) {
    msg.channel.send('The queue is currently empty.')
   return;
 }
  
}

client.login(process.env.SECRET);
