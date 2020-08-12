const { Discord, MessageEmbed, Client } = require("discord.js");
const db = require('quick.db')
const ytdl = require("ytdl-core");
const client = new Client();

const Queue = new Map();
let Cooldown = new Set();
let LoopData = new Map();
let PlayCooldown = new Set();
let ReportCooldown = new Set();

const Commands = ["play", "skip", "stop", "queue"]

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  //client.user.setPresence({ activity: { name: '?help' }, status: 'online' })
  client.user.setActivity("?help", { type: "LISTENING"})
  Reboot()
});

client.on("message", async message => {
  
  let prefix = "?"
  if (message.channel.type === "dm")  {
    message.author.send("<:error:742048687793897534> You can't use commands in DMs.")
    return;
  }
  const ServerQueue = Queue.get(message.guild.id);
  
  let fetch = await db.fetch(`prefix_${message.guild.id}`);
  if (fetch === null)
    prefix = "?"
  else
    prefix = fetch
  
  const command = message.content.toString().toLowerCase().split(" ")[0]
  
  if (command === `${prefix}hi`) {
    message.channel.send('Hey')
  }
  
  if (command === `${prefix}loop`) {
    try {
      const Song = ServerQueue.songs[0]
    } catch {
      message.channel.send('<:error:742048687793897534> No song is playing!') 
      return;
    }
    const Song = ServerQueue.songs[0]
    const serverLoop = LoopData.get(message.guild.id)
    const tbe = {
      looping: true
    }
    LoopData.set(message.guild.id, tbe)
     if (String(Song.title).search('@everyone') > -1 || String(Song.title).search('@here') > -1) {
       message.channel.send(`<:success:742073883108180018> Looping playing song`)
       return;
     }
    message.channel.send('<:success:742073883108180018> Looping **' + Song.title + '**')
  }
  
    if (command === `${prefix}unloop`) {
    const serverLoop = LoopData.get(message.guild.id)
        try {
      const Song = ServerQueue.songs[0]
    } catch {
      message.channel.send('<:error:742048687793897534> No song is playing!') 
      return;
    }
    if (!serverLoop.looping) return message.channel.send('<:error:742048687793897534> No song is looping!');
      const tbe = {
      looping: false
    }
const Song = ServerQueue.songs[0]
    LoopData.set(message.guild.id, tbe)
      if (String(Song.title).search('@everyone') > -1 || String(Song.title).search('@here') > -1) {
        message.channel.send(`<:success:742073883108180018> Unlooped playing song`)
        return;
      }
       message.channel.send(`<:success:742073883108180018> Unlooped **${Song.title}**`)
  }

  
  /*if (message.content.startsWith(`${prefix}ban`)) {
    const Args = message.content.split(" ")
    const Reason = await String(Args.slice(2).join(" "))
    if (!message.author.id == '306767358574198786') { message.channel.send('<:error:742048687793897534> You cannot use this command.'); return; }
    if(!Args[1])  { message.channel.send('<:error:742048687793897534> Please enter an ID.'); return; }
    if (!Args[2]) { message.channel.send('<:error:742048687793897534> Please enter a ban reason.'); return; }
    
    Ban(message, Args[1], Reason)
    
  }*/
  
  
  if (command === `${prefix}play`) {
  //const data = await db.fetch(`bans_${message.author.id}`)
  //if (data === null) {
    const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
if (PlayCooldown.has(message.author.id)) {return;}
CommandCooldown(message.author)
    execute(message, ServerQueue);
    PlayCommandCooldown(message.author)
    return;
  //} else {
  //          message.channel.send(`<:banhammer:742368388587847680> You have been banned from using this bot. Reason: ${data}`)
  //  return;
 // }
  }
  
  if (command === (`<@!504430047604506625>`)) {
    const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
CommandCooldown(message.author)
    help(message, prefix)
  }
  
    if (command === (`${prefix}skip`)) {
      if (PlayCooldown.has(message.author.id)) {return;}
      const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
CommandCooldown(message.author)
       const tbe = {
      looping: false
    }
       LoopData.set(message.guild.id, tbe)
       
    skip(message, ServerQueue);
    return;
  }
  
      if (command === (`${prefix}stop`)) {
        if (PlayCooldown.has(message.author.id)) {return;}
        const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
CommandCooldown(message.author)
               const tbe = {
      looping: false
    }
       LoopData.set(message.guild.id, tbe)
    stop(message, ServerQueue);
    return;
  }
  
  if (command === (`${prefix}ping`)) {
        const c = CooldownCheck(message.author)
    if (c == true) {
      message.channel.send(':clock8: Slow down with the commands.');
      return;
    }
    CommandCooldown(message.author)
    var ping = Date.now() - message.createdTimestamp + " ms**";
    message.channel.send('Your ping is: **' + ping)
  }
  
    if (command === (`${prefix}connect`) || command === (`${prefix}join`)) {
          const c = CooldownCheck(message.author)
    if (c == true) {
      message.channel.send(':clock8: Slow down with the commands.');
      return;
    }
    CommandCooldown(message.author)
    if (!message.member.voice.channel) return message.channel.send(":warning: You're currently not in a voice channel.");
      const join = await message.member.voice.channel.join();
      message.channel.send(`<:success:742073883108180018> Connected to **${message.member.voice.channel.name}**`)
  }

 if (command === (`${prefix}disconnect`) || command === (`${prefix}leave`)) {
       const c = CooldownCheck(message.author)
    if (c == true) {
      message.channel.send(':clock8: Slow down with the commands.');
      return;
    }
    CommandCooldown(message.author)
    if (!message.member.voice.channel) return message.channel.send(":warning: You must be in a channel to disconnect the bot!");
    const leave = await message.member.voice.channel.leave();
    message.channel.send(`<:success:742073883108180018> Disconnected from **${message.member.voice.channel.name}**`)
  }
  
  if (command === (`${prefix}help`)) {
    const c = CooldownCheck(message.author)
    if (c == true) {
      message.channel.send(':clock8: Slow down with the commands.');
      return;
    }
    CommandCooldown(message.author)
    help(message, prefix)
  }
  
  if (command === (`${prefix}invite`)) {
    InviteCommand(message)
  }
  
  if (command === (`${prefix}queue`)) {
    const c = CooldownCheck(message.author)
    if (c == true) {
      message.channel.send(':clock8: Slow down with the commands.');
      return;
    }
    CommandCooldown(message.author)
    queue(message, message.guild)
  }

if (command === (`${prefix}report`)) {
const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
CommandCooldown(message.author)
report(message.author, message)
}
  
  if (command === (`${prefix}prefix`)) {
    const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
CommandCooldown(message.author)
    setprefix(message, message)
  }
  
  if (command === (`${prefix}songinfo`)) {
    SongInfo(message)
  }
  
});

async function execute(message, ServerQueue) {
  const args = message.content.split(" ");
const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send(":warning: You must be in a voice channel to play music!")
  const perms = voiceChannel.permissionsFor(message.client.user);
  if (!perms.has("CONNECT")) return message.channel.send(":warning: I cannot connect to this channel!")
  if (!perms.has("SPEAK")) return message.channel.send(":warning: I cannot speak in this channel!")
  
  if (!args[1]) { 
    TakePlayCooldown(message.author.id)
    message.channel.send(':warning: Please enter a valid YouTube link or video name.') 
    return; 
  }
  
  var songInfo = null
  
  try {
  songInfo = await ytdl.getInfo(args[1])
  } catch {
    const ReportMsg = await String(args.slice(1).join(" "))
    const youtube = require('ytsr')
      if (ReportMsg.search('@everyone') > -1 || ReportMsg.search('@here') > -1) {
        message.channel.send(`<:search:742479023346548808> Searching for...man I'm tired of this.`)
        return;
      }
     message.channel.send(`<:search:742479023346548808> Searching for: **${ReportMsg}**`)
      try { 
        var video = await youtube(String(ReportMsg), {limit: 1})
      } catch 
      { message.channel.send('<:error:742048687793897534> An error occured when trying to search. Does the query contain a large amount of characters?') 
       return;  }
    
      try {
        var e = video.items.filter(a => a.type === 'video')[0].link
      } catch {
        TakePlayCooldown(message.author.id)
        message.channel.send(`<:error:742048687793897534> No search results for ${ReportMsg}`)
        return;
      }
    songInfo = await ytdl.getInfo(e)
      
  }
  
  try {
    let length = songInfo.videoDetails.lengthSeconds
    if (length > 3600) {
      TakePlayCooldown(message.author.id)
      message.channel.send(`<:error:742048687793897534> Your song must be under **1 hour**.`)
      return;
    }
  } catch {
    console.log('Error occured')
  }
  
  try {
  let islive = songInfo.videoDetails.isLive
  if (islive == true) {
    TakePlayCooldown(message.author.id)
    message.channel.send(`<:error:742048687793897534> Your song cannot be **live**.`)
    return;
  }
  } catch {
    console.log('Error occured')
  }

  const val = CheckQueueLength(message.guild)
  if (val === true) {
    TakePlayCooldown(message.author.id)
   message.channel.send('<:error:742048687793897534> The queue must have under **10** songs.')
    return;
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
    var songInfo = null
    try{
    songInfo = await ytdl.getInfo(args[1]); 
    } catch {
      const ReportMsg = await String(args.slice(1).join(" "))
          const youtube = require('ytsr')
      var video = await youtube(String(ReportMsg))
      var e = video.items.filter(a => a.type === 'video')[0].link
      songInfo = await ytdl.getInfo(e)
    }
    try {
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    length: songInfo.videoDetails.lengthSeconds,
    thumbnail: songInfo.videoDetails.thumbnail.thumbnails
  };
      
      queueContruct.songs.push(song);
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message, message.guild, queueContruct.songs[0]);
    } catch (err) {
      TakePlayCooldown(message.author.id)
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
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    length: songInfo.videoDetails.lengthSeconds
  };
    ServerQueue.songs.push(song);
    TakePlayCooldown(message.author.id)
    return message.channel.send(`:thumbsup: **${song.title}** has been added to the queue!`) ;
    } catch(err) {
      TakePlayCooldown(message.author.id)
     if (message.content.search('@everyone') > -1 || message.content.search('@here') > -1) {
      message.channel.send(`<:error:742048687793897534> An error occured when trying to play...nice try.`)
      } else {
        message.channel.send(`<:error:742048687793897534> An error occured when trying to play **${String(args.slice(1).join(" "))}**.`)
      }
    }
  }
}

function skip(message, serverQueue) {
  const ServerQueue = Queue.get(message.guild.id);
  try {
  if (!message.member.voice.channel) return message.channel.send(":warning: You must be in a channel to stop music!");
  if (!serverQueue || !serverQueue.songs[0])
    return message.channel.send(":warning: The queue is currently empty.");
    serverQueue.connection.dispatcher.end();
  message.channel.send('<:success:742073883108180018> **Skipped**')
    play(message, message.guild, ServerQueue.songs[1])
  } catch(err) {
    message.channel.send('<:error:742048687793897534> An error has occured.')
    console.log(err + " * skip err")
    serverQueue.voiceChannel.leave();
    serverQueue.voiceChannel.join();
  }
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

function play(m, guild, song) {
  const serverQueue = Queue.get(guild.id)
  if (!song) {
    Queue.delete(guild.id);
    return;
  }
  
  try {
      const val = CheckQueueLength(guild)
  if (val === true) {
   serverQueue.textChannel.send('<:error:742048687793897534> The queue must have under **10** songs.')
    return;
  }
    var serverLoop = LoopData.get(guild.id)
  const dispatcher = serverQueue.connection
    .play(ytdl(song.url), { filter: 'audioonly' })
    .on("finish", () => {
      try {
        const serverLoop = LoopData.get(guild.id)
      if (serverLoop.looping === true) {
        play(m, guild, serverQueue.songs[0])
        return;
      }
        } catch {
      serverQueue.songs.shift();
      play(m, guild, serverQueue.songs[0]);
          return;
        }
      
      serverQueue.songs.shift();
    play(m, guild, serverQueue.songs[0])
      return;
    });
    try {
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    try {
      if (serverLoop.looping === true) {
      //serverQueue.textChannel.send(`:musical_note:  Now playing: **${song.title}**`);
      TakePlayCooldown(m.author.id)
        return;
      }
          if (String(song.title).search('@everyone') > -1 || String(song.title).search('@here') > -1) {
      serverQueue.textChannel.send(`:musical_note:  Now playing requested song.`);
      TakePlayCooldown(m.author.id)
      return;
    } 
    } catch {
      if (String(song.title).search('@everyone') > -1 || String(song.title).search('@here') > -1) {
      serverQueue.textChannel.send(`:musical_note:  Now playing requested song.`)
      return;
         } else {
           serverQueue.textChannel.send(`:musical_note:  Now playing: **${song.title}**`)
           return;
         }
    }
    serverQueue.textChannel.send(`:musical_note:  Now playing: **${song.title}**`)
      return;
    //}
  } catch(err) {
    console.log(err)
        if (String(song.title).search('@everyone') > -1 || String(song.title).search('@here') > -1) {
      serverQueue.textChannel.send(`<:error:742048687793897534>  An error occured when trying to play the requested song.`);
    } else {
      serverQueue.textChannel.send(`<:error:742048687793897534>  An error occured when trying to play **${song.title}.**`);
    }
  serverQueue.songs.shift();
    return;
  }
  } catch {
    console.log('err')
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

async function report(user, message) {
  const cool = CheckReportCooldown(message.author.id);
  if (cool === true) {
    message.channel.send(':clock8: You must wait **60** seconds before your last report before using this command.')
    return;
  }
  const Discord = require('discord.js');
  const Args = message.content.split(" ");
  if (!Args[1]) {
    message.channel.send('<:error:742048687793897534> Please provide a reason.')
    return;
  }
  const ReportMsg = await String(Args.slice(1).join(" "))
  const Webhook = new Discord.WebhookClient('506263048449818628', 'CaUwS8djvuspRrfLWlvLvDSEbw1fpYgjkBAcvQWJZgZsPG7jnPVmwpW3nA3xBUfAkxav');
  
  const ReportEmbed = new MessageEmbed()
  .setTitle(`Report from ${message.author.tag} - ${user.id}`)
  .setColor(0xFF0000)
  .setDescription(ReportMsg)
  .setTimestamp()
  Webhook.send(ReportEmbed)
  message.channel.send('<:success:742073883108180018> Your report has been sent.')
  GiveReportCooldown(message.author.id);
}

async function setprefix(message, user) {
  const db = require('quick.db')
  const Args = message.content.split(" ")
  const perms = message.channel.permissionsFor(user);
  if (!perms.has('MANAGE_GUILD')) {
    message.channel.send('<:error:742048687793897534> You do not have the **Manage Server** permission.')
    return;
  }
  if (!Args[1]) {
    message.channel.send(`<:error:742048687793897534> Please enter a prefix.`)
    return
  }
  if (Args[1].length > 3) {
    message.channel.send('<:error:742048687793897534> Your prefix must be under **3** characters.')
    return;
  }
  const p = await db.set(`prefix_${message.guild.id}`, Args[1])
  message.channel.send(`<:success:742073883108180018> Set prefix to **${db.get(`prefix_${message.guild.id}`)}**`)
  
}

async function help(message, prefix) {
    const date = new Date();
    const help = new MessageEmbed() 
    .setTitle('Help') 
    .setColor(16777210) 
    .setDescription(`**${prefix}help** - Displays all commands\n**${prefix}play** - Plays a song\n**${prefix}skip** - Skips the playing song\n**${prefix}stop** - Stops the queue\n**${prefix}connect** - Joins a voice channel\n**${prefix}disconnect** - Disconnects from a voice channel\n**${prefix}loop** - Loops the playing song\n**${prefix}unloop** - Unloops the playing song\n**${prefix}queue** - Displays the current song queue\n**${prefix}songinfo** - Displays the current song information\n\n**${prefix}invite** - Invite Lucy to your server\n**${prefix}prefix** - Configure the prefix\n**${prefix}report** - Report a bug\n**${prefix}ping** - View your ping`)
    .setTimestamp()
    .setFooter(`${message.author.tag}`, message.author.avatarURL()) 
    message.channel.send(help)
}

function CheckQueueLength(guild) {
  try {
  const serverQueue = Queue.get(guild.id);
  let count = 0
  var x;
  for (x in serverQueue.songs) {
    count += 1
  }
    if (count > 10) {
    return true
    } else 
      return false
    
} catch {
  console.log('Error')
}
}

function CooldownCheck(user) {
  if (Cooldown.has(user.id)) {
    return true
  }
}

function CommandCooldown(user) {
  Cooldown.add(user.id)
  setTimeout(() => {
    Cooldown.delete(user.id)
  }, 1000)
}

function PlayCommandCooldown(user) {
  return;
}

function TakePlayCooldown(user) {
  return;
}

async function Ban(m, id, reason) {
  try {
  const p = await db.set(`bans_${id}`, reason)
  const dev = await client.users.fetch(String(id));
  const rr = await db.fetch(`bans_${id}`)
  m.channel.send(`<:banhammer:742368388587847680> Banned ${dev} for reason: **${rr}**`)
  } catch(err) {
    m.channel.send('<:error:742048687793897534> An error occured when trying to ban.')
  }
}

async function CheckBan(id) {
  const data = await db.fetch(`bans_${id}`)
  if (!data == null) {
    return false
  } else {
  } return true
}

async function SelfRecover(message, guidid) {
  const join = await message.member.voice.channel.join();
  const leave = await message.member.voice.channel.leave();
}

async function Reboot() {
  const Discord = require('discord.js');
  const Webhook = new Discord.WebhookClient('742486346576429095', '77EQ6Iyd7wU3JQCRmqzbhi4Oq-5MeQB-R-Ai5vo_Jm0PWWjhB2uWkRQbqVWcg2D5LdjI');
  const Number = await db.fetch(`reboots_1`)
  const Embed = new MessageEmbed()
  .setTitle(`Reboot #${Number}`)
  .setColor(0x00FF00)
  .setDescription('Bot has rebooted.')
  Webhook.send(Embed)
  const AddNumber = await db.set(`reboots_1`, Number + 1)
}

async function SongInfo(message) { 
  try { 
    const serverQueue = Queue.get(message.guild.id); 
    const InfoEmbed = new MessageEmbed() 
    .setTitle('Song Information') 
    .setColor(16777210) 
    .setDescription(`**Title:** ${serverQueue.songs[0].title}\n**Url:** ${serverQueue.songs[0].url}\n**Length:** ${serverQueue.songs[0].length} seconds`) 
    .setThumbnail(`https://i.ytimg.com/vi/${serverQueue.songs[0].url.substring(32)}/hqdefault.jpg`)
     .setTimestamp()
    .setFooter(`${message.author.tag}`, message.author.avatarURL()) 
    message.channel.send(InfoEmbed) 
  } catch { 
    message.channel.send('<:error:742048687793897534> There is no playing song!') 
  } 
}

function CheckReportCooldown(id) {
  if (ReportCooldown.has(id)) {
    return true
  }
}

function GiveReportCooldown(id) {
  ReportCooldown.add(id)
    setTimeout(() => {
    ReportCooldown.delete(id)
  }, 60000)
}

function InviteCommand(m) {
  const InviteEmbed = new MessageEmbed()
  .setTitle('Invite Lucy')
  .setColor(16777210)
  .setDescription('Invite Lucy using this link: **https://discord.com/api/oauth2/authorize?client_id=504430047604506625&permissions=8&scope=bot**')
  m.channel.send("<:success:742073883108180018> I've sent you the invite link in DMs!")
  m.author.send(InviteEmbed)
}

client.login(process.env.SECRET);
