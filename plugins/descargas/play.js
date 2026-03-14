const handler = async (m, { conn, text }) => {

  if (!text) throw 'Escribe el nombre de la canción'

  try {

    const res = await fetch(`https://api.ryuzei.xyz/api/play?q=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.status) throw 'No se encontró la canción'

    const { title, duration, views, ago, thumbnail } = json.data
    const audio = json.download.url

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption:
`🎵 ${title}
⏱ ${duration}
👁 ${views}
📅 ${ago}`
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m })

  } catch {
    throw 'Error al obtener la música'
  }
}

handler.command = ['play', 'mp3']
export default handler