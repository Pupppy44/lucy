// 2npspsfe5-
const { Discord, MessageEmbed, Client } = require("discord.js");
const save = require('data-store');
const ytdl = require("ytdl-core");
const client = new Client();

var Sounds = {
  bruh: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fbruh.m4a",
  oof: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Foof.m4a",
  gamecube: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fgamecube.m4a",
  fart: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Ffart.weba", 
  vsauce: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fvsauce.mp3", 
  garbage: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fgarbage.weba",
  explosion: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fexplosion.mp3",
  trains: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Ftrains.m4a",
  xp: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fxp.weba",
  poggers: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fpoggers.mp3",
  trombone: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Ftrombone.m4a",
  missionfailed: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fmissionfailed.m4a",
  justdoit: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fjustdoit.m4a",
  lawandorder: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Flawandorder.m4a",
  wasted: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fwasted.m4a",
  tadaah: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Ftadaah.m4a",
  nope: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fnope.m4a",
  nani: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fnani.mp3",
  laugh: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Flaugh.weba",
  nogodpleaseno: "https://cdn.glitch.com/f7779efc-40b6-411b-9374-4ee96bcee9dc%2Fnogodpleaseno.mp3"
}

const Queue = new Map();
let Cooldown = new Set();
let LoopData = new Map();
let PlayCooldown = new Set();
let ReportCooldown = new Set();
let Voting = new Map();
let StopVoting = new Map();
let dmc = new Set();
let dmc2 = new Set();
let dmc3 = new Set();

const IsTestingBot = true

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity(`?help on ${client.guilds.cache.size} servers`, { type: "LISTENING"})
});

client.on("message", async message => {
  if(message.author.bot) return;
  if (message.guild.id == "506125560745951242" && IsTestingBot === true) return;
  
  let prefix = "?"
  if (message.channel.type === "dm" && message.content.startsWith('?') && String(message.content).length > 1)  {
    message.author.send("<:error:742048687793897534> You can't use commands in DMs.")
    return;
  }
  const ServerQueue = Queue.get(message.guild.id);
  
  const save = require('data-store')({ path: __dirname + '/prefixes.json' });
  let fetch = save.get(`prefix_${message.guild.id}`)
  if (fetch === null || fetch === undefined)
    prefix = "?"
  else
    prefix = fetch

  const command = message.content.toString().toLowerCase().split(" ")[0]
  
  if (command === `${prefix}search`) {
    message.channel.send('<:angrycry:745334228786479306> This command is currently **blocked** from users.')
    return;
  }
  
  if (command === `${prefix}tip`) {
    if (message.guild.id == "506125560745951242" && IsTestingBot === true && message.author.id !== "306767358574198786") return message.channel.send('<:angrycry:745334228786479306> **Only Lucy Developers** can use me!');
    const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
if (PlayCooldown.has(message.author.id)) {return;}
CommandCooldown(message.author)
    Tip(message)
  }
  
  if (command === `${prefix}soundboard` || command === `${prefix}sb`) {
        const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
if (PlayCooldown.has(message.author.id)) {return;}
CommandCooldown(message.author)
    const args = message.content.split(" ")
    if (!args[1]) return SoundboardHelp(message);
    if (args[1]) return Soundboard(message);
  }
  
  if (command === `${prefix}clear`) {
     const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
if (PlayCooldown.has(message.author.id)) {return;}
CommandCooldown(message.author)
    if (message.member.roles.cache.some(role => role.name.toString().toLowerCase() === 'dj')) { 
      if (!message.member.voice.channel) return message.channel.send("<:warning:743466779249999884> You must be in a voice channel to clear the queue!");
    if (!ServerQueue) return message.channel.send("<:error:742048687793897534> There's no song(s) in the queue.");
    if (!ServerQueue.songs[0]) return message.channel.send("<:error:742048687793897534> There's no song(s) in the queue.");
    if (message.member.voice.channel === ServerQueue.voiceChannel) {
      Clear(message);
      return;
    } else {
      message.channel.send(`<:warning:743466779249999884> You must be in **${ServerQueue.voiceChannel.name}** to clear the queue!`);
      return;
    }
  
  } else {
    message.channel.send('<:error:742048687793897534> You must have the **DJ** role to use this command!');
    return;
  }
  }
  
  if (command === `${prefix}shift`) {
     const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
if (PlayCooldown.has(message.author.id)) {return;}
CommandCooldown(message.author)
    if (message.member.roles.cache.some(role => role.name.toString().toLowerCase() === 'dj')) { 
    if (!message.member.voice.channel) return message.channel.send("<:warning:743466779249999884> You must be in a voice channel to force skip!");
    if (!ServerQueue) return message.channel.send("<:error:742048687793897534> No song is playing!");
    if (!ServerQueue.songs[0]) return message.channel.send("<:error:742048687793897534> No song is playing!");
    if (message.member.voice.channel === ServerQueue.voiceChannel) {
      Shift(message)
    } else {
      message.channel.send(`<:warning:743466779249999884> You must be in **${ServerQueue.voiceChannel.name}** to force skip!`);
    }
      } else {
              message.channel.send('<:error:742048687793897534> You must have the **DJ** role to use this command!');
      return;
      }
  }
	
	if (command === `${prefix}exit`) {
		Exit(message);
	}
  
     if (command === `${prefix}status`) {
    if (message.author.id === '306767358574198786') {
    const args = message.content.split(" ")
    if (!args[1]) return message.channel.send('Enter type');
    if (!args[2]) return message.channel.send('Enter status');
    const msg = await String(args.slice(2).join(" "))
    client.user.setActivity(msg, { type: String(args[1])})
    message.channel.send(`<a:checkmark:743818721054949477> **Updated status**`)
  } else {
    console.log('No');
  }
     }
  
  
 if (command === `${prefix}volume`) {
       const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
if (PlayCooldown.has(message.author.id)) {return;}
CommandCooldown(message.author)
    if (!message.member.roles.cache.some(role => role.name.toString().toLowerCase() === 'dj')) { 
      message.channel.send('<:error:742048687793897534> You must have the **DJ** role to use this command!');
      return;
    }
    if (!message.member.voice.channel) return message.channel.send("<:warning:743466779249999884> You must be in a voice channel to configure the volume!");
    if (!ServerQueue) return message.channel.send("<:error:742048687793897534> There's no song playing.");
    if (!ServerQueue.songs[0]) return message.channel.send("<:error:742048687793897534> There's no song playing.");
    if (message.member.voice.channel === ServerQueue.voiceChannel) {
      Volume(message)
    } else {
      message.channel.send(`<:warning:743466779249999884> You must be in **${ServerQueue.voiceChannel.name}** to configure the volume!`);
    }
  }
  
  if (command === `${prefix}remove`) {
        const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
if (PlayCooldown.has(message.author.id)) {return;}
CommandCooldown(message.author)
    if (!message.member.roles.cache.some(role => role.name.toString().toLowerCase() === 'dj')) { 
      message.channel.send('<:error:742048687793897534> You must have the **DJ** role to use this command!');
      return;
    }
    if (!message.member.voice.channel) return message.channel.send("<:warning:743466779249999884> You must be in a voice channel to remove songs from the queue!");
    if (!ServerQueue) return message.channel.send("<:error:742048687793897534> There's no song(s) in the queue.");
    if (!ServerQueue.songs[1]) return message.channel.send("<:error:742048687793897534> There's no song(s) in the queue.");
    if (message.member.voice.channel === ServerQueue.voiceChannel) {
      Remove(message)
    } else {
      message.channel.send(`<:warning:743466779249999884> You must be in **${ServerQueue.voiceChannel.name}** to remove songs from the queue!`);
    }
  }
  
  
  if (command === `${prefix}loop`) {
    const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
if (PlayCooldown.has(message.author.id)) {return;}
CommandCooldown(message.author)
        if (!message.member.roles.cache.some(role => role.name.toString().toLowerCase() === 'dj')) { 
      message.channel.send('<:error:742048687793897534> You must have the **DJ** role to use this command!');
      return;
    }
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
    if (LoopData.get(message.guild.id)) {
      if (LoopData.get(message.guild.id).looping === true) {
        message.channel.send(`<:error:742048687793897534> The playing song is already looping!`)
        return;
      }
    }
    if (!message.member.voice.channel) return message.channel.send(`<:warning:743466779249999884> You must be in **${ServerQueue.voiceChannel.name}** to loop a song!`);
    if (message.member.voice.channel.name === ServerQueue.voiceChannel.name) {
    LoopData.set(message.guild.id, tbe)
     if (String(Song.title).search('@everyone') > -1 || String(Song.title).search('@here') > -1) {
       message.channel.send(`<:success:742073883108180018> Looping playing song`)
       return;
     }
    message.channel.send('<:success:742073883108180018> Looping **' + Song.title + '**')
    } else {
      message.channel.send(`<:warning:743466779249999884> You must be in **${ServerQueue.voiceChannel.name}** to loop a song!`);
      return;
    }
                                                                                 
  }
  
    if (command === `${prefix}unloop`) {
       const c = CooldownCheck(message.author)
if (c == true) {
message.channel.send(':clock8: Slow down with the commands.');
return;
}
if (PlayCooldown.has(message.author.id)) {return;}
CommandCooldown(message.author)
      if (!message.member.roles.cache.some(role => role.name.toString().toLowerCase() === 'dj')) { 
      message.channel.send('<:error:742048687793897534> You must have the **DJ** role to use this command!');
      return;
    }
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
      if (!message.member.voice.channel) return message.channel.send(`<:warning:743466779249999884> You must be in **${ServerQueue.voiceChannel.name}** to loop a song!`);
    if (message.member.voice.channel.name === ServerQueue.voiceChannel.name) {
const Song = ServerQueue.songs[0]
    LoopData.set(message.guild.id, tbe)
      if (String(Song.title).search('@everyone') > -1 || String(Song.title).search('@here') > -1) {
        message.channel.send(`<:success:742073883108180018> Unlooped playing song`)
        return;
      }
       message.channel.send(`<:success:742073883108180018> Unlooped **${Song.title}**`)
    } else {
      message.channel.send(`<:warning:743466779249999884> You must be in **${ServerQueue.voiceChannel.name}** to unloop a song!`);
    }
  }

  
  if (command === `${prefix}update`) {
    if (message.author.id === '306767358574198786') {
      client.user.setActivity(`${client.users.cache.size} users | ?help`, { type: "LISTENING"})
    message.channel.send(`<a:checkmark:743818721054949477> **Updated status**\n\n**Users:** ${client.users.cache.size}\n**Guilds:** ${client.guilds.cache.size}\n**Ping:** ${Date.now() - message.createdTimestamp + " ms"}`)
  } else {
    console.log('No');
  }
     }
  
  /*if (message.content.startsWith(`${prefix}ban`)) {
    const Args = message.content.split(" ")
    const Reason = await String(Args.slice(2).join(" "))
    if (!message.author.id == '306767358574198786') { message.channel.send('<:error:742048687793897534> You cannot use this command.'); return; }
    if(!Args[1])  { message.channel.send('<:error:742048687793897534> Please enter an ID.'); return; }
    if (!Args[2]) { message.channel.send('<:error:742048687793897534> Please enter a ban reason.'); return; }
    
    Ban(message, Args[1], Reason)
    
  }*/
  
  
  if (command === `${prefix}play` || command === `${prefix}p`) {
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
    DownloadAudio(message)
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
        dmcf(message)
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
      dmcf(message)
    if (!message.member.voice.channel) return message.channel.send(":warning: You're currently not in a voice channel.");
      const join = await message.member.voice.channel.join();
      message.channel.send(`<:success:742073883108180018> Connected to **${message.member.voice.channel.name}**`)
      if (ServerQueue && ServerQueue.songs[0]) {
        ServerQueue.connection = join
        //message.channel.send('<:warning:743466779249999884> Do not force disconnect the bot, use `disconnect`')
      }
  }

 if (command === (`${prefix}disconnect`) || command === (`${prefix}leave`)) {
   try {
     var sq = Queue.get(message.guild.id)
     if (!message.member.voice.channel) return message.channel.send(":warning: You must be in a channel to disconnect the bot!"); 
     if (sq.songs[0]) {
       message.channel.send(":warning: You can only disconnect the bot if there's no song playing.")
       return;
     }
   } catch {
     console.log('err')
   }
       const c = CooldownCheck(message.author)
    if (c == true) {
      message.channel.send(':clock8: Slow down with the commands.');
      return;
    }
    CommandCooldown(message.author)
   dmcf(message)
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
  
  if (command === `${prefix}queue` || command === (`${prefix}q`)) {
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
    message.channel.send(':warning: Please enter a valid YouTube link or video name.') 
    return; 
  }
  
  var songInfo = null
  
  try {
  songInfo = await ytdl.getInfo(args[1])
  } catch {
    var Videos = ["hi"]
    var ReportMsg = await String(args.slice(1).join(" "))
    const youtube = require('ytsr')
      if (ReportMsg.search('@everyone') > -1 || ReportMsg.search('@here') > -1) {
        message.channel.send(`<:warning:743466779249999884> Your search query contains **blacklisted** text.`)
        return;
      }
    if (ReportMsg.toString().length > 120) return message.channel.send(`<:warning:743466779249999884> Your search query cannot have more than **120** characters.`)
     message.channel.send(`<:search:742479023346548808> Searching for: **${ReportMsg}**`)
      try { 
        var video = await youtube(String(ReportMsg), {limit: 10})
      } catch 
      { message.channel.send('<:error:742048687793897534> An error occured when trying to search. Does the query contain a large amount of characters?') 
       return;  }
    
      try {
        var e = video.items.filter(a => a.type === 'video')[0].link
      } catch {
        message.channel.send(`<:error:742048687793897534> No search results for ${ReportMsg}`)
        return;
      }
      var s = ""
  var x;
  for (x in video.items) {
    var y;
    var c = 0
    for (y in Videos) c += 1;
    if (c < 11) {
    if (video.items[x] && video.items[x].type === 'video' && !x == 0) { 
      Videos.push(video.items[x])
      s += "\n**" + Videos.indexOf(video.items[x]) + ".** " + "[" + video.items[x].title + "](" + Videos[Videos.indexOf(video.items[x])].link + ")"
    }
  }
  }
  const emb = new MessageEmbed()
  .setTitle('Results for **' + ReportMsg + '**')
  .setColor(16777210)
  .setDescription(s)
  message.channel.send(emb)
  try {
  const filter = m => m.author.id === message.author.id
	var collected = await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['query'] })
  const Numbe = Number(collected.first().content)
  if (isNaN(Numbe)) return message.channel.send('<:error:742048687793897534> **Invalid Number**');
    console.log(video.items[Numbe])
  if (!Videos[Numbe] || Videos[Numbe].type == 'search-refinements' || Numbe === 0) return message.channel.send(`<:error:742048687793897534> There is no song in **#${Numbe}** of the query.`)
    const e = Videos[Numbe].link
    songInfo = await ytdl.getInfo(e)
  } catch(err) {
    if (err.toString().search("Could not find player config") > -1) return message.channel.send('<:error:742048687793897534> `Uh oh...` Looks like an error occured. Try using a video link.')
    message.channel.send(':thumbsup: Alright, have a great day.');
    return;
  }
  }
  try {
    let length = songInfo.videoDetails.lengthSeconds
    if (length > 10800) {
      message.channel.send(`<:error:742048687793897534> Your song must be under **3 hours**.`)
      return;
    }
  
  try {
  let islive = songInfo.videoDetails.isLive
  if (islive == true) {
    message.channel.send(`<:error:742048687793897534> Your song cannot be **live**.`)
    return;
  }
    
      if (length === 0) {
      message.channel.send(`<:error:742048687793897534> Your song must be over **0 seconds**.`)
      return;
    }
  } catch {
    console.log('Error occured')
  }
      } catch {
  }

  const val = CheckQueueLength(message.guild)
  if (val === true) {
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
    try {
  var song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    length: songInfo.videoDetails.lengthSeconds,
    author: songInfo.videoDetails.author.name,
    channel: songInfo.videoDetails.author.url,
    type: "music"
  };
      
      queueContruct.songs.push(song);
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message, message.guild, queueContruct.songs[0]);
      dmc3.delete(message.guild.id)
    } catch (err) {
      console.log(err)
      if(args[1] === "@everyone" || args[1] == "@here") {
      message.channel.send(`<:error:742048687793897534> An error occured when trying to play...nice try.`)
      } else {
          message.channel.send(`<:error:742048687793897534> An error occured when trying to play **${song.title}**, please try again.`)
      }
      Queue.delete(message.guild.id);
      return console.log(err);
    }
  } else {
    try {
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
    length: songInfo.videoDetails.lengthSeconds,
    author: songInfo.videoDetails.author.name,
    channel: songInfo.videoDetails.author.url,
    type: "music"
  };
    ServerQueue.songs.push(song);
      if (String(song.title).search('@everyone') > -1 || String(song.title).search('@here') > -1) {
        message.channel.send(':thumbsup: `' + song.title + '` has been added to the queue!')
        return;
      } else { message.channel.send(`:thumbsup: **${song.title}** has been added to the queue!`) 
              return; }
    } catch(err) {
     if (message.content.search('@everyone') > -1 || message.content.search('@here') > -1) {
      message.channel.send(`<:error:742048687793897534> An error occured when trying to play...nice try.`)
      } else {
        message.channel.send(`<:error:742048687793897534> An error occured when trying to play **${String(args.slice(1).join(" "))}**.`)
      }
    }
  }
}

async function skip(message, serverQueue) {
  const ServerQueue = Queue.get(message.guild.id);
  const VotingMap = Voting.get(message.guild.id)
  if (!VotingMap) {
    const lol = {
      voters: []
    }
    Voting.set(message.guild.id, lol)
  }
  try {
const VotingMap = Voting.get(message.guild.id)
const ServerQueue = Queue.get(message.guild.id);
  if (!serverQueue || !serverQueue.songs[0])
    return message.channel.send(":warning: The queue is currently empty.");
      if (!message.member.voice.channel) return message.channel.send(`:warning: You must be in **${serverQueue.voiceChannel.name}** to skip music!`);
  if (message.member.voice.channel.name == serverQueue.voiceChannel.name) { 
    var x;
for (x in VotingMap.voters)  {
if (VotingMap.voters[x] == message.author.id) {
          var count = 0;
    var x;
for (x in VotingMap.voters)  {
  count += 1
}
      if (count >= (Number(serverQueue.voiceChannel.members.size) - 1)) {
        try {
      serverQueue.connection.dispatcher.end();
      message.channel.send('<:success:742073883108180018> **Skipped**')
      Voting.delete(message.guild.id)
        return;
        } catch {
          
        }
    }
  message.channel.send('<:error:742048687793897534> You already voted!')
  return;
}
}
} else {
  message.channel.send(`:warning: You must be in **${serverQueue.voiceChannel.name}** to stop music!`);
  return;
}
  VotingMap.voters.push(message.author.id)
        var count = 0;
    var x;
for (x in VotingMap.voters)  {
  count += 1
}
  message.channel.send('<:success:742073883108180018> **Voted to skip** `[' + count + '/' + (Number(serverQueue.voiceChannel.members.size) - 1) + ']`' )
    if (count >= (Number(serverQueue.voiceChannel.members.size) - 1)) {
      serverQueue.connection.dispatcher.end();
      message.channel.send('<:success:742073883108180018> **Skipped**')
      Voting.delete(message.guild.id)
      StopVoting.delete(message.guild.id)
    }
  } catch(err) {
try {
 // Queue.delete(message.guild.id)
message.channel.send('<:success:742073883108180018> **Skipped**\n<:warning:743466779249999884> Do not force disconnect the bot, use `disconnect`')
        Voting.delete(message.guild.id)
      StopVoting.delete(message.guild.id)
  const con = await serverQueue.voiceChannel.join();
  serverQueue.connection = con
  play(message, message.guild, serverQueue.songs[1], true)
} catch {
  message.channel.send('<:error:742048687793897534> An error has occured.')
}
  }
}

function stop(message, serverQueue) {
  const ServerQueue = Queue.get(message.guild.id);
  const VotingMap = StopVoting.get(message.guild.id)
  if (!VotingMap) {
    const lol = {
      voters: []
    }
    StopVoting.set(message.guild.id, lol)
  }
  try {
const VotingMap = StopVoting.get(message.guild.id)
const ServerQueue = Queue.get(message.guild.id);
  if (!serverQueue || !serverQueue.songs[0])
    return message.channel.send(":warning: The queue is currently empty.");
      if (!message.member.voice.channel) return message.channel.send(`:warning: You must be in **${serverQueue.voiceChannel.name}** to stop music!`);
  if (message.member.voice.channel.name == serverQueue.voiceChannel.name) { 
    var x;
for (x in VotingMap.voters)  {
if (VotingMap.voters[x] == message.author.id) {
          var count = 0;
    var x;
for (x in VotingMap.voters)  {
  count += 1
}
      if (count >= (Number(serverQueue.voiceChannel.members.size) - 1)) {
        serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
      message.channel.send('<:success:742073883108180018> **Stopped**')
      StopVoting.delete(message.guild.id)
        return;
    }
  message.channel.send('<:error:742048687793897534> You already voted!')
  return;
}
}
} else {
  message.channel.send(`:warning: You must be in **${serverQueue.voiceChannel.name}** to stop music!`);
  return;
}
  VotingMap.voters.push(message.author.id)
        var count = 0;
    var x;
for (x in VotingMap.voters)  {
  count += 1
}
  message.channel.send('<:success:742073883108180018> **Voted to stop queue** `[' + count + '/' + (Number(serverQueue.voiceChannel.members.size) - 1) + ']`' )
    if (count >= (Number(serverQueue.voiceChannel.members.size) - 1)) {
              serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
      message.channel.send('<:success:742073883108180018> **Stopped**')
      StopVoting.delete(message.guild.id)
    }
  } catch(err) {
   try {
  Queue.delete(message.guild.id)
message.channel.send('<:success:742073883108180018> **Stopped**\n<:warning:743466779249999884> Do not force disconnect the bot, use `disconnect`')
        Voting.delete(message.guild.id)
      StopVoting.delete(message.guild.id)
} catch {
  message.channel.send('<:error:742048687793897534> An error has occured.')
}
}
}
function play(m, guild, song, b) {
  const serverQueue = Queue.get(guild.id)
  if (!song) {
    Queue.delete(guild.id);
    return;
  }
  
  if (b === true) {
    serverQueue.songs.shift();
  }
  
  try {
      const val = CheckQueueLength(guild)
  if (val === true) {
   serverQueue.textChannel.send('<:error:742048687793897534> The queue must have under **10** songs.')
    return;
  }
    var kk = false
    var serverLoop = LoopData.get(guild.id)
    try {
       const lmao = serverLoop.looping
    }catch{
             const tbe = {
      looping: false
    }
       LoopData.set(m.guild.id, tbe)
    }
    dmcf(m)
    const serverQueue = Queue.get(m.guild.id)
    if (!serverQueue.songs[1]) { 
      var serverLoop = LoopData.get(guild.id)
      if (serverLoop.looping === false) {
        var logo;
            if(serverQueue.songs[0].type === "soundboard") {
      logo = '<:soundboard:743296219975254057>'
    } else {
      logo = '<:music:745262043388706908>'
    }
                if (String(song.title).search('@everyone') > -1 || String(song.title).search('@here') > -1) {
      serverQueue.textChannel.send(`${logo} Now playing requested song.`)
                  kk = true;
                } else {serverQueue.textChannel.send(`${logo} Now playing: **${song.title}**`); 
                       kk = true;
                       }
    }
    }
    var higuys = null
    if (String(song.url).search('youtube') > -1) {
      higuys = ytdl(song.url)
    } else {
      higuys = song.url
    }
    const dispatcher = serverQueue.connection
    .play(higuys, { filter: 'audioonly' })
    .on("finish", () => {
      const vdlol = Voting.get(guild.id)
      if (vdlol) {
        Voting.delete(guild.id)
      }
            const avdlol = StopVoting.get(guild.id)
      if (avdlol) {
        StopVoting.delete(guild.id)
      }
      try {
        const serverLoop = LoopData.get(guild.id)
      if (serverLoop.looping === true) {
        play(m, guild, serverQueue.songs[0])
        
        return;
      }
        } catch {
      play(m, guild, serverQueue.songs[0]);
          return;
        }
      
     serverQueue.songs.shift();
    play(m, guild, serverQueue.songs[0])
      return;
    });
    try {
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
      if (serverLoop.looping === true) {
        return;
      }
      if (kk === false) {
        var logo = null
        if (song.type == "soundboard") {
          logo = "<:soundboard:743296219975254057>"
        } else {
          logo = "<:music:745262043388706908>"
        }
          if (String(song.title).search('@everyone') > -1 || String(song.title).search('@here') > -1) {
      serverQueue.textChannel.send(`${logo} Now playing requested song.`)
      return;
    } else {
      serverQueue.textChannel.send(`${logo} Now playing: **${song.title}**`)
      return;
    }
      }
              //  serverQueue.textChannel.send(`:musical_note:  Now playing: **${song.title}**`)
     // return;
    } catch {
      //if (String(song.title).search('@everyone') > -1 || String(song.title).search('@here') > -1) {
      //serverQueue.textChannel.send(`:musical_note:  Now playing requested song.`)
     // return;
         ///} //else {
           //serverQueue.textChannel.send(`:musical_note:  Now playing: **${song.title}**`)
           //return;
        // }
         //serverQueue.textChannel.send(`:musical_note:  Now playing: **${song.title}**`)
      return;
    }
    //}
  } catch(err) {
    console.log(err)
    const serverQueue = Queue.get(m.guild.id)
        if (String(song.title).search('@everyone') > -1 || String(song.title).search('@here') > -1) {
      serverQueue.textChannel.send(`<:error:742048687793897534>  An error occured when trying to play the requested song.`);
    } else {
      serverQueue.textChannel.send(`<:error:742048687793897534>  An error occured when trying to play **${song.title}.**`);
    }
  serverQueue.songs.shift();
    return;
  }
}

function queue(msg, guild) {
  const serverQueue = Queue.get(guild.id);
  if (!serverQueue || !serverQueue.songs) return msg.channel.send('<:warning:743466779249999884> The queue is empty.');
 try {
   
   let queuetxt = ""
   var x;
   for (x in serverQueue.songs) {
    var logo;
    if(serverQueue.songs[x].type === "soundboard") {
      logo = '<:soundboard:743296219975254057>'
    } else {
      logo = '<:music:745262043388706908>'
    }
    if(x == 0) {
      var linklol = ""
      if (serverQueue.songs[x].type === "music") { linklol = serverQueue.songs[x].url }
       queuetxt += `\n${logo} **Playing:** [${serverQueue.songs[x].title}](${linklol})\n`
    } else {
            var linklola = ""
      if (serverQueue.songs[x].type === "music") { linklola = serverQueue.songs[x].url }
      queuetxt += `\n**${logo}  ${x}.** [${serverQueue.songs[x].title}](${linklola})`
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
    msg.channel.send('<:error:742048687793897534> `Uh oh...` Looks like an error occured. If this keeps happening, contact support.')
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
  try {
  const save = require('data-store')({ path: __dirname + '/prefixes.json' });
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
  const p = await save.set(`prefix_${message.guild.id}`, Args[1])
  message.channel.send(`<:success:742073883108180018> Set prefix to **${save.get(`prefix_${message.guild.id}`)}**`)
  } catch {
    message.channel.send('<:error:742048687793897534> `Uh oh...` Looks like an error occured. If this keeps happening, contact support.')
  }
  
}

async function help(message, prefix) {
    const date = new Date();
    const help = new MessageEmbed() 
    .setTitle('Help') 
    .setColor(16777210) 
    .addField('General Commands',`**${prefix}help** - Displays all commands\n**${prefix}play** - Plays a song\n**${prefix}soundboard** - Displays the soundboard\n**${prefix}skip** - Skips the playing song\n**${prefix}stop** - Stops the queue\n**${prefix}connect** - Joins a voice channel\n**${prefix}disconnect** - Disconnects from a voice channel\n**${prefix}queue** - Displays the current song queue\n**${prefix}songinfo** - Displays the current song information`)
    .addField('DJ Commands', `**${prefix}loop** - Loops the playing song\n**${prefix}unloop** - Unloops the playing song\n**${prefix}clear** - Clears the queue\n**${prefix}shift** - Force skip the playing song\n**${prefix}remove** - Remove a specific song from the queue\n**${prefix}volume** - Configure the playing song's volume`)
    .addField('Miscellaneous Commands', `**${prefix}invite** - Invite Lucy to your server\n**${prefix}prefix** - Configure the prefix\n**${prefix}report** - Report a bug\n**${prefix}tip** - See a random tip`)
    .setTimestamp()
    .setFooter(`${message.author.tag}`, message.author.avatarURL())
    message.channel.send(help)
}

function CheckQueueLength(guild) {
  try {
  var serverQueue = Queue.get(guild.id);
  let count = 0
  var x;
  for (x in serverQueue.songs) {
    count += 1
  }
    if (count > 10) {
    return true
    } else 
      return false
    
} catch(e) {
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

async function SongInfo(message) { 
  try { 
    const serverQueue = Queue.get(message.guild.id); 
    const l = serverQueue.songs[0].length
    var thumbnail = null
    var url = null
    var desc = null
    if (serverQueue.songs[0].type === "soundboard") {
      thumbnail = 'https://i.imgur.com/kT0QBiv.png'
      desc = (`**Title:** ${serverQueue.songs[0].title}\n**Type:** Soundboard`) 
    } else {
      thumbnail = `https://i.ytimg.com/vi/${serverQueue.songs[0].url.substring(32)}/hqdefault.jpg`
      url = serverQueue.songs[0].url
      desc = `**Title:** [${serverQueue.songs[0].title}](${url})\n**Author:** [${serverQueue.songs[0].author}](${serverQueue.songs[0].channel})\n**Length:** ${fmtMSS(l)}`
    }
    const InfoEmbed = new MessageEmbed() 
    .setTitle('Song Information') 
    .setColor(16777210) 
    .setDescription(desc)
    .setThumbnail(thumbnail)
    .setTimestamp()
    .setFooter(`${message.author.tag}`, message.author.avatarURL()) 
    message.channel.send(InfoEmbed) 
  } catch(er) { 
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

function InviteCommand(message) {
  const InviteEmbed = new MessageEmbed()
  .setTitle('Invite Lucy')
  .setColor(16777210)
  .setDescription('Invite Lucy using **[this link](https://discord.com/api/oauth2/authorize?client_id=504430047604506625&permissions=8&scope=bot)**')
  .setTimestamp()
  .setFooter(`${message.author.tag}`, message.author.avatarURL()) 
  message.channel.send(InviteEmbed)
}


function dmcf(message) {
  dmc2.add(message.guild.id)
        setTimeout(() => {
                dmc2.delete(message.guild.id) }, 4000)
}

function Remove(message) {
  const ServerQueue = Queue.get(message.guild.id)
  const Args = message.content.split(" ")
  if (!Args[1]) return message.channel.send('<:error:742048687793897534> Please provide a number.');
  if (isNaN(Number(Args[1]))) return message.channel.send('<:error:742048687793897534> **Invalid number**');
  const Num = Number(Args[1])
  if (Num === 0) return message.channel.send('<:error:742048687793897534> You cannot remove the playing song!');
  if (!ServerQueue.songs[Num]) return message.channel.send(`<:warning:743466779249999884> There is no song in **#${Num}** of the queue.`);
  try {
    const Name = ServerQueue.songs[Num].title
    ServerQueue.songs.splice(Num, Num)
    if (String(Name).search('@everyone') > -1 || String(Name).search('@here') > -1) {
    message.channel.send('<:success:742073883108180018> Removed `' + Name + '` from the queue.');
    } else {
      message.channel.send(`<:success:742073883108180018> Removed **${Name}** from the queue.`);
    }
  } catch {
    message.channel.send('<:error:742048687793897534> `Uh oh...` Looks like an error occured. If this keeps happening, contact support.')
  }
}

async function DownloadAudio(m) {
  return;
  var AudioLink = null
  var VideoLink = null
  var HasNotCheckedAudio = true
  var HasNotCheckedVideo = true
  const l = m.content.split(" ")[1]
  try {
  const Info = await ytdl.getInfo(l)
  var y;
    VideoLink = Info.formats[0].url;
  var x;
  for (x in Info.formats) {
  if (Info.formats[x].qualityLabel === null && HasNotCheckedAudio) {
    AudioLink = Info.formats[x].url;
    HasNotCheckedAudio = false;
  }
  }
  const Details = new MessageEmbed()
  .addField("" + Info.videoDetails.title, "Note: The audio link may not always be available.", true)
  .setTitle('Downloads')
  .setDescription("**[Video Link](" + VideoLink +")**\n**[Audio Link](" + AudioLink +")**")
  .setColor(16777210)
      .setTimestamp()
    .setFooter(`${m.author.tag}`, m.author.avatarURL()) 
  m.channel.send(Details);
  } catch(e) {
    m.channel.send('Error ' + e)
  }
}

function Volume(message) {
  try {
  const ServerQueue = Queue.get(message.guild.id)
  const Args = message.content.split(" ")
  if (!Args[1]) return message.channel.send('<:error:742048687793897534> Please provide a number.');
  if (isNaN(Number(Args[1]))) return message.channel.send('<:error:742048687793897534> **Invalid number**');
  const Num = Number(Args[1])
  if (Num > 2 || Num < 0) return message.channel.send('<:error:742048687793897534> Number must be between **0** and **2**');
  ServerQueue.connection.dispatcher.setVolumeLogarithmic(Num)
  if (Num === 1) {
    message.channel.send(`<:success:742073883108180018> Changed volume to **default**`)
  } else {
    message.channel.send(`<:success:742073883108180018> Changed volume to **${Num / .020}%**`)
  }
  } catch {
    message.channel.send('<:error:742048687793897534> `Uh oh...` Looks like an error occured. If this keeps happening, contact support.')
  }
}

function Clear(message) {
try {
  const ServerQueue = Queue.get(message.guild.id)
  if (!ServerQueue || !ServerQueue.songs[0]) return message.channel.send('<:error:742048687793897534> The queue is empty.')
  ServerQueue.connection.dispatcher.end();
  Queue.delete(message.guild.id)
  message.channel.send('<:success:742073883108180018> **Cleared queue**')
} catch {
  try {
    Queue.delete(message.guild.id)
            Voting.delete(message.guild.id)
      StopVoting.delete(message.guild.id)
    message.channel.send('<:success:742073883108180018> **Cleared queue**')
  } catch {
    message.channel.send('<:error:742048687793897534> `Uh oh...` Looks like an error occured. If this keeps happening, contact support.')
  }
 }
}

async function Shift(message) {
  try {
    var ServerQueue = Queue.get(message.guild.id)
    if (!ServerQueue || !ServerQueue.songs[0]) return message.channel.send('<:error:742048687793897534> The queue is empty.');
    const Table = {
      looping: false
    }
      const LoopGuild = LoopData.set(message.guild.id, Table)
      LoopGuild.set(Table)
    ServerQueue.connection.dispatcher.end();
    message.channel.send('<:success:742073883108180018> **Shifted queue**')
  } catch(e) {
    try {
      const con = await ServerQueue.voiceChannel.join();
      ServerQueue.connection = con
  play(message, message.guild, ServerQueue.songs[1], true)
      message.channel.send('<:success:742073883108180018> **Shifted queue**')
              Voting.delete(message.guild.id)
      StopVoting.delete(message.guild.id)
    } catch {
      message.channel.send('<:error:742048687793897534> Uh oh, looks like an error occured. If this keeps happening, contact support.')
    }
  }
}

function SoundboardHelp(message) {
  const Embed = new MessageEmbed()
  .setTitle('Soundboard')
  .setColor(16777210)
  .addField('To play a sound: `soundboard <name>`', '`bruh`, `oof`, `gamecube`, `fart`, `vsauce`, `garbage`, `explosion`, `trains`, `xp`\n`poggers`, `trombone`, `missionfailed`, `justdoit`, `lawandorder`, `wasted`\n`tadaah`, `nope`, `nani`, `laugh`, `nogodpleaseno`', false)
  .setTimestamp()
  .setFooter(`${message.author.tag}`, message.author.avatarURL()) 
  message.channel.send(Embed)
}

async function Soundboard(message) {
try {
const args = message.content.split(" ");
const Word = args[1].toString().toLowerCase();
const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send(":warning: You must be in a voice channel to play a sound!")
  const perms = voiceChannel.permissionsFor(message.client.user);
  if (!perms.has("CONNECT")) return message.channel.send(":warning: I cannot connect to this channel!")
  if (!perms.has("SPEAK")) return message.channel.send(":warning: I cannot speak in this channel!")
  if (!Sounds[Word]) return message.channel.send('<:error:742048687793897534> Sound `' + args[1] + '` not found')
  const val = CheckQueueLength(message.guild)
  if (val === true) {
    message.channel.send('<:error:742048687793897534> The queue must have under **10** songs.')
    return;
  }
  const Song = Sounds[Word]
  const ServerQueue = Queue.get(message.guild.id)
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
    queueContruct.connection = await message.member.voice.channel.join();
    const Info = {
      title: UpperCase(Word),
      url: Sounds[Word],
      type: "soundboard"
    }
    queueContruct.songs.push(Info)
    play(message, message.guild, queueContruct.songs[0]);
    } else {
    const Song = Sounds[Word]
    const Info = {
      title: UpperCase(Word),
      url: Sounds[Word],
      type: "soundboard"
  }
    const UpperName = UpperCase(Word)
    ServerQueue.songs.push(Info);
    message.channel.send(`:thumbsup: **${UpperName}** has been added to the queue!`)
  }
} catch {
  message.channel.send('<:error:742048687793897534> `Uh oh...` Looks like an error occured. If this keeps happening, contact support.')
}
}

function Tip(message) {
  const Tips = [
    "Some commands have shorter versions of them, can you guess what **p** is?",
    "We have a support server **@** `discord.gg/pcYbebA`",
    "There's some secret, unlisted commands. Did you find all of them yet?",
    "Lucy started as a soundboard bot.",
    "Want to invite the bot to another server? Use the **invite** command.",
    "Inviting Lucy to your server makes your server **10** times better."
  ]
  const Random = Math.floor(Math.random() * Math.floor(6));
  message.channel.send('`Did you know?` ' + Tips[Random])
}

async function Exit(message) {
	const Embed = new MessageEmbed()
	.setColor(0xFF0000)
	.addField("__Oh crap, it's happening__", "**Restart the bot?** Respond with `yes` to confirm, *case sensitive*.")

	const Msg = await message.channel.send(Embed);

	const Filter = m => !m.author.bot;
	try {

		const Confirmation = await Msg.channel.awaitMessages( Filter, { max: 1, time: 10000, errors: ["exit"] } );

		const Response = Confirmation.first();

		if (Response.author.id != "306767358574198786") {
			message.channel.send('<:youtriedtorestart:748721993603350537> **Hah,** you thought.');
			return;
		}

		if (Response.content != "yes") {
			message.channel.send('**Alright**, you got us wiled up for a second there.');
			return;
		}

		const ConfirmedEmbed = new MessageEmbed()
		.setColor('#99ff40')
		.addField("__Alright__", "<a:loading:748718350171111464> **Restarting** the bot...")

		await message.channel.send(ConfirmedEmbed);

		process.exit();

	} catch {
		message.channel.send("There was an **error** trying to restart the bot, or you **didn't give me a response**, wow...");
		return;
	}
}

function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}

function UpperCase(string) {
return string.charAt(0).toUpperCase() + string.slice(1);
}

 async function k(message, st) {
 const youtube = require('ytsr')
 var Videos = ["hi"]
  var video = await youtube(st, {limit: 15})
        try {
        var e = video.items.filter(a => a.type === 'video')[0].link
      } catch {
        message.channel.send(`<:error:742048687793897534> No search results for **${st}**`)
        return;
      }
  var s = ""
  var x;
  for (x in video.items) {
    var y;
    var c = 0
    for (y in Videos) c += 1;
    if (c < 11) {
    if (video.items[x] && video.items[x].type === 'video' && !x == 0) { 
      Videos.push(video.items[x])
      s += "\n**" + Videos.indexOf(video.items[x]) + ".** " + video.items[x].title
    }
  }
  }
  const emb = new MessageEmbed()
  .setTitle('Results for **' + st + '**')
  .setColor(16777210)
  .setDescription(s)
  message.channel.send(emb)
  try {
  const filter = m => m.author.id === message.author.id
	const collected = await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
  const Numbe = Number(collected.first().content)
  if (isNaN(Numbe)) return message.channel.send('<:error:742048687793897534> **Invalid Number**');
    console.log(video.items[Numbe])
  if (!Videos[Numbe] || Videos[Numbe].type == 'search-refinements' || Numbe === 0) return message.channel.send(`<:error:742048687793897534> There is no song in **#${Numbe}** of the query.`)
  const connection = await message.member.voice.channel.join()
  const dis = connection.play(ytdl(Videos[Numbe].link))
	message.channel.send(`Now playing: **${Videos[Numbe].title}**`)
  } catch(e) {
    message.channel.send(':thumbsup: Alright, have a good day.')
    return;
  }
 }

client.login(process.env.SECRET);
