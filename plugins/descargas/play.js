const handler = async (m, { conn, text, command }) => {

  await conn.sendMessage(m.chat, {
    react: { text: "🔥", key: m.key }
  }).catch(() => {})

  if (!text) throw `Ejemplo:\n${command} karma police`

  try {

    const searchURL = `https://api.ryuzei.xyz/search/yts?q=${encodeURIComponent(text)}`

    const search = await fetch(searchURL, {
      headers: { "User-Agent": "Mozilla/5.0" }
    })

    const sjson = await search.json()

    if (!sjson.status || !sjson.results?.length)
      throw "No encontré resultados"

    const video = sjson.results[0]
    const videoUrl = video.url

    await conn.reply(m.chat, `🎵 ${video.title}\n⏱ ${video.duration}`, m)

    const dlURL = `https://api.ryuzei.xyz/dl/ytmp3?url=${encodeURIComponent(videoUrl)}`

    const dl = await fetch(dlURL, {
      headers: { "User-Agent": "Mozilla/5.0" }
    })

    const json = await dl.json()

    if (!json.status) throw "Error al convertir a MP3"

    const audio = json.download?.url
    const info = json.data

    if (!audio) throw "No se obtuvo el audio"

    await conn.sendMessage(m.chat, {
      image: { url: info.thumbnail },
      caption:
`🎵 ${info.title}
⏱ ${info.duration}
👁 ${info.views}`
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: "audio/mpeg",
      fileName: `${info.title}.mp3`
    }, { quoted: m })

  } catch (e) {
    await conn.reply(m.chat, `❌ ERROR\n${e}`, m)
  }
}

handler.command = ['play','mp3']
export default handler