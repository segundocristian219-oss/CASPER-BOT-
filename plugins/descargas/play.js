import fetch from 'node-fetch'
import yts from 'yt-search'

const API_KEY = optigei

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    const text = args.join(' ').trim()

    if (!text) {
      return m.reply(`🪐 Ingresa un enlace o texto de YouTube.\nEjemplo: *${usedPrefix + command} autos edits*`)
    }

    const isLink = text.includes('youtube.com') || text.includes('youtu.be')
    let video

    if (isLink) {
      const id = text.includes('v=')
        ? text.split('v=')[1].split('&')[0]
        : text.split('/').pop()

      const search = await yts({ videoId: id })
      video = search.videos?.[0]
    } else {
      const search = await yts(text)
      video = search.videos?.[0]
    }

    if (!video) {
      return m.reply('🪐 Video no encontrado.')
    }

    m.react(rwait)

    const apiUrl = `https://optishield.uk/api/?type=youtubedl&apikey=${API_KEY}&url=${encodeURIComponent(video.url)}`
    const res = await fetch(apiUrl)
    const json = await res.json()

    const checkUrl = json?.check_result
    if (!checkUrl) throw new Error('No se recibió check_result')

    const intervaloMs = 5000
    const maxWaitMs = 1200000
    const maxIntentos = Math.ceil(maxWaitMs / intervaloMs)

    let finalData = null

    for (let i = 0; i < maxIntentos; i++) {
      await new Promise(resolve => setTimeout(resolve, intervaloMs))

      const checkRes = await fetch(checkUrl)
      const checkJson = await checkRes.json()

      if (checkJson?.status === 'ok' && checkJson?.processed === true) {
        finalData = checkJson?.result?.data || null
        break
      }
    }

    if (!finalData) throw new Error('La API tardó demasiado en procesar')

    let downloadUrl =
      finalData?.selected?.audio ||
      pickFromArray(finalData?.available?.audio)

    if (!downloadUrl) throw new Error('No se encontró enlace de audio disponible')

    const fileRes = await fetch(downloadUrl)
    if (!fileRes.ok) throw new Error('No se pudo descargar el audio')

    const buffer = await fileRes.buffer()

    await conn.sendMessage(
      m.chat,
      {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${video.title}.mp3`
      },
      { quoted: m }
    )

    m.react(done)
  } catch (e) {
    m.reply(`⛅ Error: ${e.message}`)
  }
}

function pickFromArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null
  for (const it of arr) {
    const u = it?.download_url || it?.url || it?.link
    if (u) return u
  }
  return null
}

handler.help = ['ytmp3']
handler.tags = ['descargas']
handler.command = ['play', 'mp3']

export default handler