const handler = async (m, { conn, text, command }) => {

  await conn.sendMessage(m.chat, {
    react: { text: "🔥", key: m.key }
  }).catch(() => {})

  if (!text) throw `Ejemplo:\n${command} yan block`

  try {

    const url = `https://api.ryuzei.xyz/api/play?q=${encodeURIComponent(text)}`
    await conn.reply(m.chat, `DEBUG\nURL:\n${url}`, m)

    const res = await fetch(url)

    await conn.reply(m.chat, `DEBUG\nHTTP STATUS: ${res.status}`, m)

    if (!res.ok) throw `HTTP ERROR ${res.status}`

    const json = await res.json()

    await conn.reply(m.chat, `DEBUG\nAPI STATUS: ${json.status}`, m)

    if (!json.status) throw "API devolvió status false"

    if (!json.data) throw "API no tiene data"

    if (!json.download) throw "API no tiene download"

    if (!json.download.url) throw "API no tiene URL de audio"

    const { title, duration, views, ago, thumbnail } = json.data
    const audio = json.download.url

    await conn.reply(m.chat, `DEBUG\nAudio URL detectada`, m)

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `🎵 ${title}
⏱ ${duration}
👁 ${views}
📅 ${ago}`
    }, { quoted: m })

    await conn.reply(m.chat, `DEBUG\nImagen enviada`, m)

    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`
    }, { quoted: m })

    await conn.reply(m.chat, `DEBUG\nAudio enviado`, m)

  } catch (err) {

    await conn.reply(m.chat, `❌ ERROR\n${err}`, m)

  }
}

handler.command = ['play','mp3']

export default handler