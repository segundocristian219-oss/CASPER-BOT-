import fetch from 'node-fetch'
import yts from 'yt-search'

const APIKEY = 'c50919b9828c357cd81e753f03d4c000'

const handler = async (m, { conn, args }) => {

  const text = args.join(' ')

  if (!text)
    return m.reply(`🪐 Ingresa un texto o link de YouTube
Ejemplo: *play autos edits*`)

  let video
  const isLink = text.includes('youtube.com') || text.includes('youtu.be')

  try {

    if (isLink) {

      const id =
        text.split('v=')[1]?.split('&')[0] ||
        text.split('/').pop()

      const res = await yts({ videoId:id })
      video = res

    } else {

      const res = await yts(text)
      video = res.videos[0]

    }

    if (!video)
      throw 'Video no encontrado'

    await conn.sendMessage(
      m.chat,
      { text:`🪐 Descargando audio de *${video.title}*...` },
      { quoted:m }
    )

    const apiURL =
      `https://optishield.uk/api/?type=youtubedl` +
      `&apikey=${APIKEY}` +
      `&url=${encodeURIComponent(video.url)}` +
      `&video=0`

    const apiRes = await fetch(apiURL)
    const json = await apiRes.json()

    if (!json?.result?.download)
      throw 'No se pudo obtener el audio'

    await conn.sendMessage(
      m.chat,
      {
        audio:{ url:json.result.download },
        mimetype:'audio/mpeg',
        fileName:`${video.title}.mp3`
      },
      { quoted:m }
    )

  } catch (e) {

    await conn.sendMessage(
      m.chat,
      { text:`🌱 Error\n${e}` },
      { quoted:m }
    )

  }

}

handler.command = ['play','musicdl']
handler.help = ['play <texto|url>']
handler.tags = ['descargas']

export default handler