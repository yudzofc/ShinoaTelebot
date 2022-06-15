const { fetchJson, range, parseMarkdown, getBuffer, runtime, time } = require('./lib/function')
const { Telegraf } = require('telegraf')
const help = require('./lib/help')
const tele = require('./lib/tele')
const chalk = require('chalk')
const os = require('os')
const fs = require('fs')
const { TraceMoe } = require('trace.moe.ts')
const wait = new TraceMoe();
const saucenao = require("sagiri");
const client = saucenao("074a1f1a40e94436de37232d4e9f9d70afcdb90e");
const textapi = require('textmaker-thiccy');
const { AnimeWallpaper } = require("anime-wallpaper");
const wall = new AnimeWallpaper();
const brainly = require('brainly-scraper');
const samih = JSON.parse(fs.readFileSync('./database/simi.json'));
const moment = require('moment-timezone');
const {
  apikey,
  bot_token,
  owner,
  ownerLink,
  version,
  prefix
} = JSON.parse(fs.readFileSync(`./config.json`))

if (bot_token == "") {
  return console.log("=== BOT TOKEN CANNOT BE EMPTY ===")
}

const bot = new Telegraf(bot_token)

bot.on("new_chat_members", async (lol) => {
  var message = lol.message
  var pp_group = await tele.getPhotoProfile(message.chat.id)
  var groupname = message.chat.title
  var groupmembers = await bot.telegram.getChatMembersCount(message.chat.id)
  for (x of message.new_chat_members) {
    var pp_user = await tele.getPhotoProfile(x.id)
    var full_name = tele.getUser(x).full_name
    console.log(chalk.whiteBright("├"), chalk.cyanBright("[  JOINS  ]"), chalk.whiteBright(full_name), chalk.greenBright("join in"), chalk.whiteBright(groupname))

    welkom = `Selamat Datang di Grup ${groupname}\n❖ Nama      :\n❖ Umur       :\n❖ Asal Kota :\n❖ Hobby     :`
    await lol.replyWithPhoto({ url: `https://yuzzu-api.herokuapp.com/api/welcome2?name=${full_name}&mem=${groupmembers}&gcname=${groupname}&picurl=${pp_user}&bgurl=https://i.ibb.co/wzyW0n5/Ep-D73w-PVo-AAN03n-1.jpg&gcicon=${pp_group}` }, { caption: welkom, parse_mode: "Markdown" })
  }
})

bot.on("left_chat_member", async (lol) => {
  var message = lol.message
  var pp_group = await tele.getPhotoProfile(message.chat.id)
  var pp_user = await tele.getPhotoProfile(message.left_chat_member.id)
  var pp_group = await tele.getPhotoProfile(message.chat.id)
  var groupname = message.chat.title
  var groupmembers = await bot.telegram.getChatMembersCount(message.chat.id)
  var pp_user = await tele.getPhotoProfile(message.left_chat_member.id)
  var full_name = tele.getUser(message.left_chat_member).full_name
  console.log(chalk.whiteBright("├"), chalk.cyanBright("[  LEAVE  ]"), chalk.whiteBright(full_name), chalk.greenBright("leave from"), chalk.whiteBright(groupname))
  Beliau = `Semoga Beliau Diterima Disisi-Nya`
  await lol.replyWithPhoto({ url: `https://yuzzu-api.herokuapp.com/api/goodbye2?name=${full_name}&mem=${groupmembers}&gcname=${groupname}&picurl=${pp_user}&bgurl=https://i.ibb.co/wzyW0n5/Ep-D73w-PVo-AAN03n-1.jpg&gcicon=${pp_group}` }, { caption: Beliau, parse_mode: "Markdown" })
})

bot.command('start', async (lol) => {
  user = tele.getUser(lol.message.from)
  await help.start(lol, user.full_name)
  await lol.deleteMessage()
})

bot.command('help', async (lol) => {
  user = tele.getUser(lol.message.from)
  await help.help(lol, user.full_name, lol.message.from.id.toString())
})

bot.on("callback_query", async (lol) => {
  cb_data = lol.callbackQuery.data.split("-")
  user_id = Number(cb_data[1])
  if (lol.callbackQuery.from.id != user_id) return lol.answerCbQuery("Sorry, You do not have the right to access this button.", { show_alert: true })
  callback_data = cb_data[0]
  user = tele.getUser(lol.callbackQuery.from)
  const isGroup = lol.chat.type.includes("group")
  const groupName = isGroup ? lol.chat.title : ""
  if (!isGroup) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ ACTIONS ]"), chalk.whiteBright(callback_data), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
  if (isGroup) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ ACTIONS ]"), chalk.whiteBright(callback_data), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))
  if (callback_data == "help") return await help[callback_data](lol, user.full_name, user_id)
  await help[callback_data](lol, user_id.toString())
})

bot.on("message", async (lol) => {
  try {
    const body = lol.message.text || lol.message.caption || ""
    comm = body.trim().split(" ").shift().toLowerCase()
    cmd = false
    if (prefix != "" && body.startsWith(prefix)) {
      cmd = true
      comm = body.slice(1).trim().split(" ").shift().toLowerCase()
    }
    const command = comm
    const args = await tele.getArgs(lol)
    const user = tele.getUser(lol.message.from)

    const reply = async (text) => {
      for (var x of range(0, text.length, 4096)) {
        return await lol.replyWithMarkdown(text.substr(x, 4096), { disable_web_page_preview: true })
      }
    }
	const pesan = lol.message
	const groupId = pesan.chat.id
    const isCmd = cmd
    const isGroup = lol.chat.type.includes("group")
    const groupName = isGroup ? lol.chat.title : ""

    const isImage = lol.message.hasOwnProperty("photo")
    const isVideo = lol.message.hasOwnProperty("video")
    const isAudio = lol.message.hasOwnProperty("audio")
    const isSticker = lol.message.hasOwnProperty("sticker")
    const isContact = lol.message.hasOwnProperty("contact")
    const isLocation = lol.message.hasOwnProperty("location")
    const isDocument = lol.message.hasOwnProperty("document")
    const isAnimation = lol.message.hasOwnProperty("animation")
    const isMedia = isImage || isVideo || isAudio || isSticker || isContact || isLocation || isDocument || isAnimation

    const quotedMessage = lol.message.reply_to_message || {}
    const isQuotedImage = quotedMessage.hasOwnProperty("photo")
	const isSimi = samih.includes(groupId)
    const isQuotedVideo = quotedMessage.hasOwnProperty("video")
    const isQuotedAudio = quotedMessage.hasOwnProperty("audio")
    const isQuotedSticker = quotedMessage.hasOwnProperty("sticker")
    const isQuotedContact = quotedMessage.hasOwnProperty("contact")
    const isQuotedLocation = quotedMessage.hasOwnProperty("location")
    const isQuotedDocument = quotedMessage.hasOwnProperty("document")
    const isQuotedAnimation = quotedMessage.hasOwnProperty("animation")
    const isQuoted = lol.message.hasOwnProperty("reply_to_message")

    var typeMessage = body.substr(0, 50).replace(/\n/g, '')
    if (isImage) typeMessage = "Image"
    else if (isVideo) typeMessage = "Video"
    else if (isAudio) typeMessage = "Audio"
    else if (isSticker) typeMessage = "Sticker"
    else if (isContact) typeMessage = "Contact"
    else if (isLocation) typeMessage = "Location"
    else if (isDocument) typeMessage = "Document"
    else if (isAnimation) typeMessage = "Animation"

    if (!isGroup && !isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ PRIVATE ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
    if (isGroup && !isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[  GROUP  ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))
    if (!isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
    if (isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))

    var file_id = ""
    if (isQuoted) {
      file_id = isQuotedImage ? lol.message.reply_to_message.photo[lol.message.reply_to_message.photo.length - 1].file_id :
        isQuotedVideo ? lol.message.reply_to_message.video.file_id :
          isQuotedAudio ? lol.message.reply_to_message.audio.file_id :
            isQuotedDocument ? lol.message.reply_to_message.document.file_id :
              isQuotedAnimation ? lol.message.reply_to_message.animation.file_id : ""
    }
    var mediaLink = file_id != "" ? await tele.getLink(file_id) : ""

    function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
    function kyun(seconds){
            function pad(s){
            return (s < 10 ? '0' : '') + s;
            }
            var hours = Math.floor(seconds / (60*60));
            var minutes = Math.floor(seconds % (60*60) / 60);
            var seconds = Math.floor(seconds % 60);
            return `${pad(hours)}Jam ${pad(minutes)}Menit ${pad(seconds)}Detik`
            }
        const time2 = moment().tz('Asia/Jakarta').format('HH:mm:ss')
          if(time2 < "23:59:00"){
          var ucapanWaktu = '𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐌𝐚𝐥𝐚𝐦🌌'
}
          if(time2 < "19:00:00"){
          var ucapanWaktu = '𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐏𝐞𝐭𝐚𝐧𝐠🌆'
}
          if(time2 < "18:00:00"){
          var ucapanWaktu = '𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐒𝐨𝐫𝐞🌇'
}
          if(time2 < "15:00:00"){
          var ucapanWaktu = '𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐒𝐢𝐚𝐧𝐠🏞'
}
          if(time2 < "11:00:00"){
          var ucapanWaktu = '𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐏𝐚𝐠𝐢🌅'
}
          if(time2 < "05:00:00"){
          var ucapanWaktu = '𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐌𝐚𝐥𝐚𝐦🏙'
}

    switch (command) {
      case 'help':
	  case 'menu':
        await help.help(lol, user.full_name, lol.message.from.id.toString())
        break
		
	case 'runtime':
            run = process.uptime() 
            teks = `${runtime(run)}`
            await await lol.replyWithPhoto({ url: `https://images7.alphacoders.com/753/753131.png` }, { caption: 'Bot berjalan selama ' + teks , parse_mode: "Markdown" })
            break 
	case 'simih':
					if (!isGroup) return reply('Harus di group om')
					if (args.length < 1) return reply('Ketik simih 1 untuk mengaktifkan, ketik simih 0 untuk menonaktifkan')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('𝘀𝘂𝗱𝗮𝗵 𝗮𝗸𝘁𝗶𝗳 !!!')
						samih.push(groupId)
						fs.writeFileSync('./database/simi.json', JSON.stringify(samih))
						await reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ Mengaktifkan simi')
					} else if (Number(args[0]) === 0) {
						samih.splice(groupId, 1)
						fs.writeFileSync('./database/simi.json', JSON.stringify(samih))
						reply('❬ 𝗦𝗨𝗞𝗦𝗘𝗦 ❭ Menonaktifkan simi')
					} else {
						reply('?')
					}
					break
      // Islami //
      case 'listsurah':
        result = await fetchJson(`https://api.lolhuman.xyz/api/quran?apikey=${apikey}`)
        result = result.result
        text = 'List Surah:\n'
        for (var x in result) {
          text += `${x}. ${result[x]}\n`
        }
        await reply(text)
        break
      case 'alquran':
        if (args.length < 1) return await reply(`Example: ${prefix + command} 18 or ${prefix + command} 18/10 or ${prefix + command} 18/1-10`)
        urls = `https://api.lolhuman.xyz/api/quran/${args[0]}?apikey=${apikey}`
        quran = await fetchJson(urls)
        result = quran.result
        ayat = result.ayat
        text = `QS. ${result.surah} : 1-${ayat.length}\n\n`
        for (var x of ayat) {
          arab = x.arab
          nomor = x.ayat
          latin = x.latin
          indo = x.indonesia
          text += `${arab}\n${nomor}. ${latin}\n${indo}\n\n`
        }
        await reply(text)
        break
      case 'alquranaudio':
        if (args.length == 0) return await reply(`Example: ${prefix + command} 18 or ${prefix + command} 18/10`)
        surah = args[0]
        await lol.replyWithAudio({ url: `https://api.lolhuman.xyz/api/quran/audio/${surah}?apikey=${apikey}` })
        break
      case 'asmaulhusna':
        result = await fetchJson(`https://api.lolhuman.xyz/api/asmaulhusna?apikey=${apikey}`)
        result = result.result
        text = `\`No        :\` *${result.index}*\n`
        text += `\`Latin     :\` *${result.latin}*\n`
        text += `\`Arab      :\` *${result.ar}*\n`
        text += `\`Indonesia :\` *${result.id}*\n`
        text += `\`English   :\` *${result.en}*`
        await reply(text)
        break
      case 'kisahnabi':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Muhammad`)
        query = args.join(" ")
        result = await fetchJson(`https://api.lolhuman.xyz/api/kisahnabi/${query}?apikey=${apikey}`)
        result = result.result
        text = `\`Name   :\` ${result.name}\n`
        text += `\`Lahir  :\` ${result.thn_kelahiran}\n`
        text += `\`Umur   :\` ${result.age}\n`
        text += `\`Tempat :\` ${result.place}\n`
        text += `\`Story  :\`\n${result.story}`
        await reply(text)
        break
      case 'jadwalsholat':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Yogyakarta`)
        daerah = args.join(" ")
        result = await fetchJson(`https://api.lolhuman.xyz/api/sholat/${daerah}?apikey=${apikey}`)
        result = result.result
        text = `\`Wilayah :\` *${result.wilayah}*\n`
        text += `\`Tanggal :\` *${result.tanggal}*\n`
        text += `\`Sahur   :\` *${result.sahur}*\n`
        text += `\`Imsak   :\` *${result.imsak}*\n`
        text += `\`Subuh   :\` *${result.subuh}*\n`
        text += `\`Terbit  :\` *${result.terbit}*\n`
        text += `\`Dhuha   :\` *${result.dhuha}*\n`
        text += `\`Dzuhur  :\` *${result.dzuhur}*\n`
        text += `\`Ashar   :\` *${result.ashar}*\n`
        text += `\`Maghrib :\` *${result.maghrib}*\n`
        text += `\`Isya    :\` *${result.isya}*`
        await reply(text)
        break

      // Downloader //
      case 'ytplay':
      case 'play':
        if (args.length == 0) return await reply(`Example: ${prefix + command} melukis senja`)
        query = args.join(" ")
        await fetchJson(`https://yuzzu-api.herokuapp.com/api/yts?judul=${query}`)
          .then(async (bujank) => {
            views = bujank.result[0].views
            views2 = numberWithCommas(views)
            duration = bujank.result[0].duration
            uploadedAt = bujank.result[0].uploadedAt
            bang = await fetchJson(`https://yuzzu-api.herokuapp.com/api/ytdl?link=${bujank.result[0].url}`)
            tod = bang.result
          })
        caption = `\`❖ Title    :\` *${tod.title}*\n`
        caption += `\`❖ Size     :\` *${tod.size_mp3}*\n`
        caption += `\`❖ Views    :\` *${views2}*\n`
        caption += `\`❖ Duration :\` *${duration}*\n`
        caption += `\`❖ Uploaded :\` *${uploadedAt}*\n`
        caption += `\`❖ Link     :\` *https://youtu.be/${tod.id}*\n`

        await lol.replyWithPhoto({ url: tod.thumb }, { caption: caption, parse_mode: "Markdown" })
        await lol.replyWithAudio({ url: tod.mp3, filename: tod.title }, { thumb: tod.thumb })


        break
      case 'ytsearch':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Melukis Senja`)
        try {
          query = args.join(" ")
          result = await fetchJson(`https://api.lolhuman.xyz/api/ytsearch?apikey=${apikey}&query=${query}`)
          hasil = result.result.slice(0, 3)
          hasil.forEach(async (res) => {
            caption = `\`❖ Title     :\` *${res.title}*\n`
            caption += `\`❖ Link      :\`* https://www.youtube.com/watch?v=${res.videoId} *\n`
            caption += `\`❖ Published :\` *${res.published}*\n`
            caption += `\`❖ Views    :\` *${res.views}*\n`
            await lol.replyWithPhoto({ url: res.thumbnail }, { caption: caption, parse_mode: "Markdown" })
          })
        } catch (e) {
          await help.messageError(lol)
        }
        break
      case 'ytmp3':
        if (args.length == 0) return await reply(`Example: ${prefix + command} https://www.youtube.com/watch?v=qZIQAk-BUEc`)
        result = await fetchJson(`https://yuzzu-api.herokuapp.com/api/ytdl?link=${args[0]}`)
        result = result.result
        caption = `\`❖ Title    :\` *${result.title}*\n`
        caption += `\`❖ Size     :\` *${result.size_mp3}*`
        await lol.replyWithPhoto({ url: result.thumb }, { caption: caption, parse_mode: "Markdown" })
        if (Number(result.size.split(` MB`)[0]) >= 50.00) return await reply(`Sorry the bot cannot send more than 50 MB!`)
        await lol.replyWithAudio({ url: result.mp3, filename: result.title })
        break
      case 'ytmp4':
        if (args.length == 0) return await reply(`Example: ${prefix + command} https://www.youtube.com/watch?v=qZIQAk-BUEc`)
        result = await fetchJson(`https://yuzzu-api.herokuapp.com/api/ytdl?link=${args[0]}`)
        result = result.result
        caption = `\`❖ Title    :\` *${result.title}*\n`
        caption += `\`❖ Size     :\` *${result.size}*\n`
        caption += `\`❖ Quality  :\` *${result.quality}*`
        await lol.replyWithPhoto({ url: result.thumb }, { caption: caption, parse_mode: "Markdown" })
        if (Number(result.size.split(` MB`)[0]) >= 50.00) return await reply(`Sorry the bot cannot send more than 50 MB!`)
        await lol.replyWithVideo({ url: result.link })
        break
      case 'tiktoknowm':
        if (args.length == 0) return await reply(`Example: ${prefix + command} https://vt.tiktok.com/ZSwWCk5o/`)
        url = `https://yuzzu-api.herokuapp.com/api/tiktok?link=${args[0]}`
        result = await fetchJson(url)

        bang = result.result
        tod = bang.result
        await lol.replyWithVideo({ url: tod.nowatermark })
        break
      case 'tiktokmusic':
        if (args.length == 0) return await reply(`Example: ${prefix + command} https://vt.tiktok.com/ZSwWCk5o/`)
        await lol.replyWithAudio({ url: `https://api.lolhuman.xyz/api/tiktokmusic?apikey=${apikey}&url=${args[0]}` })
        break
      case 'twitterimage':
        if (args.length == 0) return await reply(`Example: ${prefix + command} https://twitter.com/memefess/status/1385161473232543747`)
        url = `https://api.lolhuman.xyz/api/twitterimage?apikey=${apikey}&url=${args[0]}`
        result = await fetchJson(url)
        await lol.replyWithPhoto({ url: result.result.link }, { caption: result.result.title })
        break
      case 'twittervideo':
        if (args.length == 0) return await reply(`Example: ${prefix + command} https://twitter.com/gofoodindonesia/status/1229369819511709697`)
        url = `https://api.lolhuman.xyz/api/twitter2?apikey=${apikey}&url=${args[0]}`
        result = await fetchJson(url)
        await lol.replyWithVideo({ url: result.result.link[0].url })
        break
      case 'spotify':
        if (args.length == 0) return await reply(`Example: ${prefix + command} https://open.spotify.com/track/0ZEYRVISCaqz5yamWZWzaA`)
        result = await fetchJson(`https://api.lolhuman.xyz/api/spotify?apikey=${apikey}&url=${args[0]}`)
        result = result.result
        caption = `\`❖ Title      :\` *${result.title}*\n`
        caption += `\`❖ Artists    :\` *${result.artists}*\n`
        caption += `\`❖ Duration   :\` *${result.duration}*\n`
        caption += `\`❖ Popularity :\` *${result.popularity}*`
        await lol.replyWithPhoto({ url: result.thumbnail }, { caption: caption, parse_mode: "Markdown" })
        await lol.replyWithAudio({ url: result.link }, { title: result.title, thumb: result.thumbnail })
        break
      case 'spotifysearch':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Melukis Senja`)
        try {
          query = args.join(" ")
          result = await fetchJson(`https://api.lolhuman.xyz/api/spotifysearch?apikey=${apikey}&query=${query}`)
          hasil = result.result.slice(0, 3)
          hasil.forEach(async (res) => {
            caption = `\`❖ Title     :\` *${res.title}*\n`
            caption += `\`❖ Artists   :\` *${res.artists}*\n`
            caption += `\`❖ Link      :\`* ${res.link} *\n`
            caption += `\`❖ Duration  :\` *${res.duration}*\n`
            await reply(caption)
          })
        } catch (e) {
          help.messageError(lol)
        }
        break
      case 'jooxplay':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Melukis Senja`)
        query = args.join(" ")
        result = await fetchJson(`https://api.lolhuman.xyz/api/jooxplay?apikey=${apikey}&query=${query}`)
        result = result.result
        caption = `\`❖ Title    :\` *${result.info.song}*\n`
        caption += `\`❖ Artists  :\` *${result.info.singer}*\n`
        caption += `\`❖ Duration :\` *${result.info.duration}*\n`
        caption += `\`❖ Album    :\` *${result.info.album}*\n`
        caption += `\`❖ Uploaded :\` *${result.info.date}*\n`
        caption += `\`❖ Lirik    :\`\n`
        if ((caption + result.lirik).length >= 1024) {
          await lol.replyWithPhoto({ url: result.image }, { caption: caption, parse_mode: "Markdown" })
          await lol.replyWithMarkdown(result.lirik)
        } else {
          await lol.replyWithPhoto({ url: result.image }, { caption: caption + result.lirik, parse_mode: "Markdown" })
        }
        await lol.replyWithAudio({ url: result.audio[0].link, filename: result.info.song }, { thumb: result.image })
        break
      case 'zippyshare':
        if (args.length == 0) return await reply(`Example: ${prefix + command} https://www51.zippyshare.com/v/5W0TOBz1/file.html`)
        url = await fetchJson(`https://api.lolhuman.xyz/api/zippyshare?apikey=${apikey}&url=${args[0]}`)
        url = url.result
        text = `\`❖ File Name    :\` *${url.name_file}*\n`
        text += `\`❖ Size         :\` *${url.size}*\n`
        text += `\`❖ Date Upload  :\` *${url.date_upload}*\n`
        text += `\`❖ Download Url :\` *${url.download_url}*`
        await reply(text)
        break
      case 'pinterest':
        if (args.length == 0) return await reply(`Example: ${prefix + command} loli kawaii`)
        query = args.join(" ")
        url = await fetchJson(`https://yuzzu-api.herokuapp.com/api/pinterest?judul==${query}`)
        bang = url.result
        url = bang[Math.floor(Math.random() * bang.length)]
        text = `Nih bang ${query}`
        lol.replyWithPhoto({ url: url }, { caption: text, parse_mode: "Markdown" })
        break
      case 'pinterestdl':
        if (args.length == 0) return await reply(`Example: ${prefix + command} https://id.pinterest.com/pin/696580267364426905/`)
        url = await fetchJson(`https://api.lolhuman.xyz/api/pinterestdl?apikey=${apikey}&url=${args[0]}`)
        url = url.result["736x"]
        await lol.replyWithPhoto({ url: url })
        break
      case 'pixiv':
        if (args.length == 0) return await reply(`Example: ${prefix + command} loli kawaii`)
        query = args.join(" ")
        await lol.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/pixiv?apikey=${apikey}&query=${query}` })
        break
      case 'pixivdl':
        if (args.length == 0) return await reply(`Example: ${prefix + command} 63456028`)
        pixivid = args[0]
        await lol.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/pixivdl/${pixivid}?apikey=${apikey}` })
        break

      // Searching
      case 'reverse':
        if (!isQuotedImage) return await reply(`Please reply a image use this command.`)
        google = await fetchJson(`https://api.lolhuman.xyz/api/googlereverse?apikey=${apikey}&img=${mediaLink}`)
        yandex = await fetchJson(`https://api.lolhuman.xyz/api/reverseyandex?apikey=${apikey}&img=${mediaLink}`)
        options = {
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Google', url: google.result },
                { text: 'Yandex', url: yandex.result }
              ]
            ]
          }
        }
        await lol.reply(`Found result`, options)
        break

      // AniManga //
      case 'character':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Miku Nakano`)
        query = args.join(" ")
        result = await fetchJson(`https://api.lolhuman.xyz/api/character?apikey=${apikey}&query=${query}`)
        result = result.result
        text = `Id : ${result.id}\n`
        text += `Name : ${result.name.full}\n`
        text += `Native : ${result.name.native}\n`
        text += `Favorites : ${result.favourites}\n`
        text += `Media : \n`
        ini_media = result.media.nodes
        for (var x of ini_media) {
          text += `- ${x.title.romaji} (${x.title.native})\n`
        }
        text += `\nDescription : \n${result.description.replace(/__/g, "_")}`
        await lol.replyWithPhoto({ url: result.image.large }, { caption: text })
        break
      case 'manga':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Gotoubun No Hanayome`)
        query = args.join(" ")
        result = await fetchJson(`https://api.lolhuman.xyz/api/manga?apikey=${apikey}&query=${query}`)
        result = result.result
        text = `Id : ${result.id}\n`
        text += `Id MAL : ${result.idMal}\n`
        text += `Title : ${result.title.romaji}\n`
        text += `English : ${result.title.english}\n`
        text += `Native : ${result.title.native}\n`
        text += `Format : ${result.format}\n`
        text += `Chapters : ${result.chapters}\n`
        text += `Volume : ${result.volumes}\n`
        text += `Status : ${result.status}\n`
        text += `Source : ${result.source}\n`
        text += `Start Date : ${result.startDate.day} - ${result.startDate.month} - ${result.startDate.year}\n`
        text += `End Date : ${result.endDate.day} - ${result.endDate.month} - ${result.endDate.year}\n`
        text += `Genre : ${result.genres.join(", ")}\n`
        text += `Synonyms : ${result.synonyms.join(", ")}\n`
        text += `Score : ${result.averageScore}%\n`
        text += `Characters : \n`
        ini_character = result.characters.nodes
        for (var x of ini_character) {
          text += `- ${x.name.full} (${x.name.native})\n`
        }
        text += `\nDescription : ${result.description}`
        await lol.replyWithPhoto({ url: result.coverImage.large }, { caption: text })
        break
      case 'anime':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Gotoubun No Hanayome`)
        query = args.join(" ")
        result = await fetchJson(`https://api.lolhuman.xyz/api/anime?apikey=${apikey}&query=${query}`)
        result = result.result
        text = `Id : ${result.id}\n`
        text += `Id MAL : ${result.idMal}\n`
        text += `Title : ${result.title.romaji}\n`
        text += `English : ${result.title.english}\n`
        text += `Native : ${result.title.native}\n`
        text += `Format : ${result.format}\n`
        text += `Episodes : ${result.episodes}\n`
        text += `Duration : ${result.duration} mins.\n`
        text += `Status : ${result.status}\n`
        text += `Season : ${result.season}\n`
        text += `Season Year : ${result.seasonYear}\n`
        text += `Source : ${result.source}\n`
        text += `Start Date : ${result.startDate.day} - ${result.startDate.month} - ${result.startDate.year}\n`
        text += `End Date : ${result.endDate.day} - ${result.endDate.month} - ${result.endDate.year}\n`
        text += `Genre : ${result.genres.join(", ")}\n`
        text += `Synonyms : ${result.synonyms.join(", ")}\n`
        text += `Score : ${result.averageScore}%\n`
        text += `Characters : \n`
        ini_character = result.characters.nodes
        for (var x of ini_character) {
          text += `- ${x.name.full} (${x.name.native})\n`
        }
        text += `\nDescription : ${result.description}`
        await lol.replyWithPhoto({ url: result.coverImage.large }, { caption: text })
        break
      case 'wait':
        if (isQuotedImage || isQuotedAnimation || isQuotedVideo || isQuotedDocument) {
          url_file = await tele.getLink(file_id)
          result = await fetchJson(
				`https://api.trace.moe/search?anilistInfo&url=${url_file}`
		  ).then(async (bang) => {
              tod = bang.result[0]
			  from2 = time(tod.from)
              caption = `\`❖ Anilist    :\` *https://anilist.co/anime/${tod.anilist.id}/*\n`
              caption += `\`❖ MAL        :\` *https://myanimelist.net/anime/${tod.anilist.idMal}/*\n`
              caption += `\`❖ Title      :\` *${tod.anilist.title.romaji}*\n`
			  caption += `\`❖ Title Jpn  :\` *${tod.anilist.title.native}*\n`
			  caption += `\`❖ Title Eng  :\` *${tod.anilist.title.english}*\n`
			  caption += `\`❖ Synonyms   :\` *${tod.anilist.synonyms}*\n`
			  caption += `\`❖ Ecchi      :\` *${tod.anilist.isAdult}*\n`
              caption += `\`❖ Filename   :\` *${tod.filename}*\n`
			  caption += `\`❖ Time       :\` *${from2}*\n`
			  caption += `\`❖ Episode    :\` *${tod.episode}*\n`
			  caption += `\`❖ Similarity :\` *${(tod.similarity * 100).toFixed(1)}% *\n`
              await lol.replyWithVideo({ url: tod.video }, { caption: caption, parse_mode: "Markdown" })
            })
        } else {
          reply(`Tag gambar yang sudah dikirim`)
        }
        break
      case 'saucenao':
        if (isQuotedImage || isQuotedAnimation || isQuotedVideo || isQuotedDocument) {
          url_file = await tele.getLink(file_id)
          await client(url_file)
            .then(async (result) => {
              tod = result[0]
              caption = `\`❖ Site       :\` *${tod.site}*\n`
              caption += `\`❖ Index      :\` *${tod.index}*\n`
              caption += `\`❖ Similarity :\` *${tod.similarity}*\n`
              caption += `\`❖ Link HD    :\` *${tod.url}*\n`
              await lol.replyWithPhoto({ url: tod.thumbnail }, { caption: caption, parse_mode: "Markdown" })
            })
        } else {
          reply(`Tag gambar yang sudah dikirim`)
        }
        break
      case 'kusonime':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Owari no Seraph`)
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/anime/kusonime?search=${body.slice(10)}&apikey=ZeroYT7`)
        result = result.result
        caption = `\❖ Title         :\ ${result.title}\n`
        caption += `\❖ Title JP      :\ ${result.title_jp}\n`
        caption += `\❖ Genre         :\ ${result.genre}\n`
        caption += `\❖ Season        :\ ${result.season}\n`
        caption += `\❖ Producer      :\ ${result.producer}\n`
        caption += `\❖ Type          :\ ${result.type}\n`
        caption += `\❖ Status        :\ ${result.status}\n`
        caption += `\❖ Total episode :\ ${result.total_episode}\n`
        caption += `\❖ Score         :\ ${result.score}\n`
        caption += `\❖ Duration      :\ ${result.duration}\n`
        caption += `\❖ Released on   :\ ${result.released_on}\n`

        lol.replyWithPhoto({ url: result.thumbs }, { caption: caption })
        setTimeout(function() {
          caption1 = `❉──────────────────❉\n\n*「 Description 」*\n\n${result.description}\n\n ❉──────────────────❉\n`

          return reply(caption1)
        }, 1000);

        setTimeout(function() {
          caption2 = '❉──────────────────❉\n'
          for (let Y of result.download) {
            caption2 += `\n*「 Download 」*\n\n*➸ Resolution:* ${Y.resolution}\n\n*➸ Link:* ${Y.download_list[0].downloader}\n\n${Y.download_list[0].download_link}\n ❉──────────────────❉\n`
          }
          return reply(caption2)
        }, 2000);
        break
      case 'kusonimesearch':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Gotoubun No Hanayome`)
        query = args.join(" ")
        result = await fetchJson(`https://api.lolhuman.xyz/api/kusonimesearch?apikey=${apikey}&query=${query}`)
        result = result.result
        text = `*Title : ${result.title}\n`
        text += `**Japanese : ${result.japanese}\n`
        text += `**Genre : ${result.genre}\n`
        text += `**Seasons : ${result.seasons}\n`
        text += `**Producers : ${result.producers}\n`
        text += `**Type : ${result.type}\n`
        text += `**Status : ${result.status}\n`
        text += `**Total Episode : ${result.total_episode}\n`
        text += `**Score : ${result.score}\n`
        text += `**Duration : ${result.duration}\n`
        text += `**Released On : ${result.released_on}*\n`
        link_dl = result.link_dl
        for (var x in link_dl) {
          text += `\n\n*${x}*\n`
          for (var y in link_dl[x]) {
            text += `[${y}](${link_dl[x][y]}) | `
          }
        }
        if (text.length <= 1024) {
          return await lol.replyWithPhoto({ url: result.thumbnail }, { caption: text })
        }
        await lol.replyWithPhoto({ url: result.thumbnail })
        await reply(text)
        break
      case 'otakudesu':
        if (args.length == 0) return await reply(`Example: ${prefix + command} https://otakudesu.tv/lengkap/pslcns-sub-indo/`)
        result = await fetchJson(`https://api.lolhuman.xyz/api/otakudesu?apikey=${apikey}&url=${args[0]}`)
        result = result.result
        text = `Title : ${result.title}\n`
        text += `Japanese : ${result.japanese}\n`
        text += `Judul : ${result.judul}\n`
        text += `Type : ${result.type}\n`
        text += `Episode : ${result.episodes}\n`
        text += `Aired : ${result.aired}\n`
        text += `Producers : ${result.producers}\n`
        text += `Genre : ${result.genres}\n`
        text += `Duration : ${result.duration}\n`
        text += `Studios : ${result.status}\n`
        text += `Rating : ${result.rating}\n`
        text += `Credit : ${result.credit}\n\n`
        get_link = result.link_dl
        for (var x in get_link) {
          text += `*${get_link[x].title}*\n`
          for (var y in get_link[x].link_dl) {
            ini_info = get_link[x].link_dl[y]
            text += `\`Reso : \`${ini_info.reso}\n`
            text += `\`Size : \`${ini_info.size}\n`
            text += `\`Link : \``
            down_link = ini_info.link_dl
            for (var z in down_link) {
              text += `[${z}](${down_link[z]}) | `
            }
            text += "\n\n"
          }
        }
        await reply(text)
        break
      case 'otakudesusearch':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Gotoubun No Hanayome`)
        query = args.join(" ")
        result = await fetchJson(`https://api.lolhuman.xyz/api/otakudesusearch?apikey=${apikey}&query=${query}`)
        result = result.result
        text = `Title : ${result.title}\n`
        text += `Japanese : ${result.japanese}\n`
        text += `Judul : ${result.judul}\n`
        text += `Type : ${result.type}\n`
        text += `Episode : ${result.episodes}\n`
        text += `Aired : ${result.aired}\n`
        text += `Producers : ${result.producers}\n`
        text += `Genre : ${result.genres}\n`
        text += `Duration : ${result.duration}\n`
        text += `Studios : ${result.status}\n`
        text += `Rating : ${result.rating}\n`
        text += `Credit : ${result.credit}\n`
        get_link = result.link_dl
        for (var x in get_link) {
          text += `\n\n*${get_link[x].title}*\n`
          for (var y in get_link[x].link_dl) {
            ini_info = get_link[x].link_dl[y]
            text += `\n\`\`\`Reso : \`\`\`${ini_info.reso}\n`
            text += `\`\`\`Size : \`\`\`${ini_info.size}\n`
            text += `\`\`\`Link : \`\`\`\n`
            down_link = ini_info.link_dl
            for (var z in down_link) {
              text += `[${z}](${down_link[z]}) | `
            }
          }
        }
        await reply(text)
        break

      // Movie & Story
      case 'lk21':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Transformer`)
        query = args.join(" ")
        result = await fetchJson(`https://api.lolhuman.xyz/api/lk21?apikey=${apikey}&query=${query}`)
        result = result.result
        text = `Title : ${result.title}\n`
        text += `Link : ${result.link}\n`
        text += `Genre : ${result.genre}\n`
        text += `Views : ${result.views}\n`
        text += `Duration : ${result.duration}\n`
        text += `Tahun : ${result.tahun}\n`
        text += `Rating : ${result.rating}\n`
        text += `Desc : ${result.desc}\n`
        text += `Actors : ${result.actors.join(", ")}\n`
        text += `Location : ${result.location}\n`
        text += `Date Release : ${result.date_release}\n`
        text += `Language : ${result.language}\n`
        text += `Link Download : ${result.link_dl}`
        await lol.replyWithPhoto({ url: result.thumbnail }, { caption: text })
        break
      case 'drakorongoing':
        result = await fetchJson(`https://api.lolhuman.xyz/api/drakorongoing?apikey=${apikey}`)
        result = result.result
        text = "Ongoing Drakor\n\n"
        for (var x of result) {
          text += `Title : ${x.title}\n`
          text += `Link : ${x.link}\n`
          text += `Thumbnail : ${x.thumbnail}\n`
          text += `Year : ${x.category}\n`
          text += `Total Episode : ${x.total_episode}\n`
          text += `Genre : ${x.genre.join(", ")}\n\n`
        }
        await reply(text)
        break
      case 'wattpad':
        if (args.length == 0) return await reply(`Example: ${prefix + command} https://www.wattpad.com/707367860-kumpulan-quote-tere-liye-tere-liye-quote-quote`)
        result = await fetchJson(`https://api.lolhuman.xyz/api/wattpad?apikey=${apikey}&url=${args[0]}`)
        result = result.result
        text = `Title : ${result.title}\n`
        text += `Rating : ${result.rating}\n`
        text += `Motify date : ${result.modifyDate}\n`
        text += `Create date: ${result.createDate}\n`
        text += `Word : ${result.word}\n`
        text += `Comment : ${result.comment}\n`
        text += `Vote : ${result.vote}\n`
        text += `Reader : ${result.reader}\n`
        text += `Pages : ${result.pages}\n`
        text += `Description : ${result.desc}\n\n`
        text += `Story : \n${result.story}`
        await lol.replyWithPhoto({ url: result.photo }, { caption: text })
        break
      case 'wattpadsearch':
        if (args.length == 0) return await reply(`Example: ${prefix + command} Tere Liye`)
        query = args.join(" ")
        result = await fetchJson(`https://api.lolhuman.xyz/api/wattpadsearch?apikey=${apikey}&query=${query}`)
        result = result.result
        text = "Wattpad Seach : \n"
        for (var x of result) {
          text += `Title : ${x.title}\n`
          text += `Url : ${x.url}\n`
          text += `Part : ${x.parts}\n`
          text += `Motify date : ${x.modifyDate}\n`
          text += `Create date: ${x.createDate}\n`
          text += `Coment count: ${x.commentCount}\n\n`
        }
        await reply(text)
        break
      case 'cerpen':
        result = await fetchJson(`https://api.lolhuman.xyz/api/cerpen?apikey=${apikey}`)
        result = result.result
        text = `Title : ${result.title}\n`
        text += `Creator : ${result.creator}\n`
        text += `Story :\n${result.cerpen}`
        await reply(text)
        break
      case 'ceritahoror':
        result = await fetchJson(`https://api.lolhuman.xyz/api/ceritahoror?apikey=${apikey}`)
        result = result.result
        text = `Title : ${result.title}\n`
        text += `Desc : ${result.desc}\n`
        text += `Story :\n${result.story}\n`
        await lol.replyWithPhoto({ url: result.thumbnail }, { caption: text })
        break

      // Random Text //
      case 'quotes':
        quotes = await fetchJson(`https://api.lolhuman.xyz/api/random/quotes?apikey=${apikey}`)
        quotes = quotes.result
        await reply(`_${quotes.by}_\n\n*― ${quotes.quote}*`)
        break
      case 'quotesanime':
        quotes = await fetchJson(`https://api.lolhuman.xyz/api/random/quotesnime?apikey=${apikey}`)
        quotes = quotes.result
        await reply(`_${quotes.quote}_\n\n*― ${quotes.character}*\n*― ${quotes.anime} ${quotes.episode}*`)
        break
      case 'quotesdilan':
        quotedilan = await fetchJson(`https://api.lolhuman.xyz/api/quotes/dilan?apikey=${apikey}`)
        await reply(quotedilan.result)
        break
      case 'quotesimage':
        await lol.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/random/${command}?apikey=${apikey}` })
        break
      case 'faktaunik':
      case 'katabijak':
      case 'pantun':
      case 'bucin':
        result = await fetchJson(`https://api.lolhuman.xyz/api/random/${command}?apikey=${apikey}`)
        await reply(result.result)
        break
      case 'randomnama':
        result = await fetchJson(`https://api.lolhuman.xyz/api/random/nama?apikey=${apikey}`)
        await reply(result.result)
        break

      // Random Image //
      case 'art':
      case 'bts':
      case 'exo':
      case 'elf':
      case 'loli':
      case 'neko':
      case 'waifu':
      case 'shota':
      case 'husbu':
      case 'sagiri':
      case 'shinobu':
      case 'megumin':
      case 'wallnime':
        await lol.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/random/${command}?apikey=${apikey}` })
        break
      case 'chiisaihentai':
      case 'trap':
      case 'blowjob':
      case 'yaoi':
      case 'ecchi':
      case 'hentai':
      case 'hololewd':
      case 'sideoppai':
      case 'animefeets':
      case 'animebooty':
      case 'animethighss':
      case 'hentaiparadise':
      case 'animearmpits':
      case 'hentaifemdom':
      case 'lewdanimegirls':
      case 'biganimetiddies':
      case 'animebellybutton':
      case 'hentai4everyone':
        await lol.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/random/nsfw/${command}?apikey=${apikey}` })
        break
      case 'ahegao':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/ahegao?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'cum':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/cum?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'ass':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/ass?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'bdsm':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/bdsm?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'blowjob':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/blowjob?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'ero':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/ero?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'foot':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/foot?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'femdom':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/femdom?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'cuckold':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/cuckold?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'gangbang':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/gangbang?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'glasses':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/glasses?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'hentai':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/hentai?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'hentaigif':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/hentaigif?apikey=ZeroYT7`)
        await lol.replyWithVideo({ url: result.result })
        break
      case 'jahy':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/jahy?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'masturbation':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/masturbation?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'neko':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/nsfwNeko?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'orgy':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/orgy?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'panties':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/panties?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'pussy':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/pussy?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'thighs':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/thighs?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
      case 'yuri':
        result = await fetchJson(`https://zeroyt7-api.herokuapp.com/api/nsfw/yuri?apikey=ZeroYT7`)
        await lol.replyWithPhoto({ url: result.result })
        break
		
	case 'wallpaperanime':
			if (args.length == 0) return await reply(`Example: ${prefix + command} shinoa`)
				text = args.join(" ")
			result = await wall.getAnimeWall4({ title: `${text}`, type: "sfw", page: 1 })
			bang = result[Math.floor(Math.random() * result.length)]
			await lol.replyWithPhoto({ url: bang.image })
        break

      // Textprome //
      case 'blackpink':
			if (args.length == 0) return await reply(`Example: ${prefix + command} LoL Human`)
				text = args.join(" ")
			result = await textapi.textpro("https://textpro.me/create-blackpink-logo-style-online-1001.html",
				"bujank"
			)
			await lol.replyWithPhoto({ url: result })
			
        break
      case 'neon':
      case 'greenneon':
      case 'advanceglow':
      case 'futureneon':
      case 'sandwriting':
      case 'sandsummer':
      case 'sandengraved':
      case 'metaldark':
      case 'neonlight':
      case 'holographic':
      case 'text1917':
      case 'minion':
      case 'deluxesilver':
      case 'newyearcard':
      case 'bloodfrosted':
      case 'halloween':
      case 'jokerlogo':
      case 'fireworksparkle':
      case 'natureleaves':
      case 'bokeh':
      case 'toxic':
      case 'strawberry':
      case 'box3d':
      case 'roadwarning':
      case 'breakwall':
      case 'icecold':
      case 'luxury':
      case 'cloud':
      case 'summersand':
      case 'horrorblood':
      case 'thunder':
        if (args.length == 0) return await reply(`Example: ${prefix + command} LoL Human`)
        text = args.join(" ")

        result = await fetchJson(`https://yuzzu-api.herokuapp.com/api/textpro/${command}?text=${text}`)

        tod = result.result
        await lol.replyWithPhoto({ url: tod })
        break
      case 'thunder':
        if (args.length == 0) return await reply(`Example: ${prefix + command} LoL Human`)
        text = args.join(" ")

        result = await fetchJson(`https://yuzzu-api.herokuapp.com/api/textpro/thunder?text=${text}`)

        await lol.replyWithPhoto({ url: result.result })
        break
      case 'pornhub':
      case 'glitch':
      case 'avenger':
      case 'space':
      case 'ninjalogo':
      case 'marvelstudio':
      case 'lionlogo':
      case 'wolflogo':
      case 'steel3d':
      case 'wallgravity':
        if (args.length == 0) return await reply(`Example: ${prefix + command} LoL Human`)
        await lol.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/textprome2/${command}?apikey=${apikey}&text1=${args[0]}&text2=${args[1]}` })
        break

      // Photo Oxy //
      case 'shadow':
      case 'cup':
      case 'cup1':
      case 'romance':
      case 'smoke':
      case 'burnpaper':
      case 'lovemessage':
      case 'undergrass':
      case 'love':
      case 'coffe':
      case 'woodheart':
      case 'woodenboard':
      case 'summer3d':
      case 'wolfmetal':
      case 'nature3d':
      case 'underwater':
      case 'golderrose':
      case 'summernature':
      case 'letterleaves':
      case 'glowingneon':
      case 'fallleaves':
      case 'flamming':
      case 'harrypotter':
      case 'carvedwood':
        if (args.length == 0) return await reply(`Example: ${prefix + command} LoL Human`)
        await lol.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/photooxy1/${command}?apikey=${apikey}&text=${args.join(" ")}` })
        break
      case 'tiktok':
      case 'arcade8bit':
      case 'battlefield4':
      case 'pubg':
        if (args.length == 0) return await reply(`Example: ${prefix + command} LoL Human`)
        await lol.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/photooxy2/${command}?apikey=${apikey}&text1=${args[0]}&text2=${args[1]}` })
        break

      // Ephoto 360 //
      case 'wetglass':
      case 'multicolor3d':
      case 'watercolor':
      case 'luxurygold':
      case 'galaxywallpaper':
      case 'lighttext':
      case 'beautifulflower':
      case 'puppycute':
      case 'royaltext':
      case 'heartshaped':
      case 'birthdaycake':
      case 'galaxystyle':
      case 'hologram3d':
      case 'greenneon':
      case 'glossychrome':
      case 'greenbush':
      case 'metallogo':
      case 'noeltext':
      case 'glittergold':
      case 'textcake':
      case 'starsnight':
      case 'wooden3d':
      case 'textbyname':
      case 'writegalacy':
      case 'galaxybat':
      case 'snow3d':
      case 'birthdayday':
      case 'goldplaybutton':
      case 'silverplaybutton':
      case 'freefire':
      case 'cartoongravity':
      case 'anonymhacker':
      case 'anonymhacker':
      case 'mlwall':
      case 'pubgmaskot':
      case 'aovwall':
      case 'logogaming':
      case 'fpslogo':
      case 'avatarlolnew':
      case 'lolbanner':
      case 'avatardota':
        if (args.length == 0) return await reply(`Example: ${prefix + command} LoL Human`)
        await lol.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/ephoto1/${command}?apikey=${apikey}&text=${args.join(" ")}` })
        break
      case 'test':
        test = await bot.telegram.getChatMembersCount(lol.message.chat.id)
		teks = 'Jumlah member dalam chat ini ada ' + test + ' orang'
        await reply(teks)
        break

      default:
        if (!isGroup && !isCmd && !isMedia) {
          await lol.replyWithChatAction("typing")
          simi = await fetchJson(`https://api.simsimi.net/v2/?text=${body}&lc=id`)
          sami = simi.success
          await reply(sami)
        }
		if (isGroup && !isCmd && !isMedia && isSimi) {
          await lol.replyWithChatAction("typing")
          simi = await fetchJson(`https://api.simsimi.net/v2/?text=${body}&lc=id`)
          sami = simi.success
          await reply(sami)
        }
    }
  } catch (e) {
    console.log(chalk.whiteBright("├"), chalk.cyanBright("[  ERROR  ]"), chalk.redBright(e))
  }
})

bot.launch()
bot.telegram.getMe().then((getme) => {
  itsPrefix = (prefix != "") ? prefix : "No Prefix"
  console.log(chalk.greenBright(' ===================================================='))
  console.log(chalk.greenBright(" │ + Owner    : " + owner || ""))
  console.log(chalk.greenBright(" │ + Bot Name : " + getme.first_name || ""))
  console.log(chalk.greenBright(" │ + Version  : " + version || ""))
  console.log(chalk.greenBright(" │ + Host     : " + os.hostname() || ""))
  console.log(chalk.greenBright(" │ + Platfrom : " + os.platform() || ""))
  console.log(chalk.greenBright(" │ + Prefix   : " + itsPrefix))
  console.log(chalk.greenBright(' ===================================================='))
  console.log(chalk.whiteBright('╭─── [ LOG ]'))
})
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))