const handler = async (m, { conn, text, command }) => {

  await conn.sendMessage(m.chat, {
    react: { text: "🔥", key: m.key }
  }).catch(() => {})

  if (!text) throw `Ejemplo:\n${command} karma police`

  try {

    const search = await fetch(`https://api.ryuzei.xyz/search/yts?q=${encodeURIComponent(text)}`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    })

    const sjson = await search.json()

    if (!sjson.status || !sjson.results?.length)
      throw "No encontré resultados"

    const video = sjson.results[0]

    const dl = await fetch(
      `https://api.ryuzei.xyz/dl/ytmp3?url=${encodeURIComponent(video.url)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    )

    const raw = await dl.text()

    if (raw.startsWith("<!DOCTYPE") || raw.startsWith("<html"))
      throw "La API devolvió HTML (bloqueo o endpoint incorrecto)"

    const json = JSON.parse(raw)

    if (!json.status)
      throw "API status false"

    const info = json.data
    const audio = json.download?.url

    if (!audio)
      throw "No se encontró audio"

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

  } catch (err) {

    await conn.reply(
      m.chat,
      `❌ ERROR PLAY

${err}`,
      m
    )

  }
}

handler.command = ['play','mp3']
export default handler