import fetch from 'node-fetch'

const handler = async (m, { conn, text, command }) => {

  await conn.sendMessage(m.chat, {
    react: { text: '🔥', key: m.key }
  }).catch(() => {})

  if (!text) throw `Ejemplo:\n${command} yan block`

  try {

    const res = await fetch(`https://api.ryuzei.xyz/api/play?q=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json || !json.status) throw 'No se encontró la canción'

    const info = json.data
    const audio = json.download?.url

    if (!audio) throw 'No se pudo obtener el audio'

    const caption = `🎵 ${info.title}
⏱ ${info.duration}
👁 ${info.views}
📅 ${info.ago}`

    await conn.sendMessage(m.chat, {
      image: { url: info.thumbnail },
      caption
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mpeg',
      fileName: `${info.title}.mp3`
    }, { quoted: m })

  } catch (e) {
    throw 'Error al obtener la música'
  }
}

handler.help = ['play <texto>']
handler.tags = ['downloader']
handler.command = ['play','mp3']

export default handler