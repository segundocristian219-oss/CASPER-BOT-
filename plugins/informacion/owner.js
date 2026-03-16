import pkg from '@whiskeysockets/baileys'
const { generateWAMessageContent, generateWAMessageFromContent, proto } = pkg

let handler = async (m, { conn }) => {
  const proses = `✨\n *Obteniendo información de mis creadores...*`
  await conn.sendMessage(m.chat, { text: proses }, { quoted: m })

  async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent(
      { image: { url } },
      { upload: conn.waUploadToServer }
    )
    return imageMessage
  }

  const owners = [
    {
      name: '𝖧𝖾𝗋𝗇𝖺𝗇𝖽𝖾𝗌.𝗑𝗒𝗓',
      desc: `👑 Creador Principal de 𝐍𝐀𝐆𝐈 𝐁𝐎𝐓`,
      image: 'https://cdn.russellxz.click/af65870a.jpeg',
      footer: '𝗄𝗄',
      buttons: [
        { name: 'WhatsApp', url: 'https://wa.me/5212213479743' }

      ]
    },
    {
      name: 'Cxsper.𝗑𝗒𝗓',
      desc: 'tester oficial 🏞️',
      image: 'https://cdn.russellxz.click/60c40448.jpeg',
      footer: '𝖭𝗂𝖼𝖾 𝖣𝗈 𝖸𝗈𝗎',
      buttons: [
        { name: 'WhatsApp', url: 'https://wa.me/5218110030725' }

      ]
    }
  ]

  let cards = []
  for (let owner of owners) {
    const imageMsg = await createImage(owner.image)

    let formattedButtons = owner.buttons.map(btn => ({
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({
        display_text: btn.name,
        url: btn.url
      })
    }))

    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `*${owner.name}*\n${owner.desc}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: owner.footer
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        hasMediaAttachment: true,
        imageMessage: imageMsg
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: formattedButtons
      })
    })
  }

  const slideMessage = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `👑 Creadores de 𝐍𝐀𝐆𝐈 𝐁𝐎𝐓`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: 'Conoce a los desarrolladores del bot'
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards
            })
          })
        }
      }
    },
    {}
  )

  await conn.relayMessage(m.chat, slideMessage.message, { messageId: slideMessage.key.id })
}

handler.tags = ['main']
handler.command = handler.help = ['donar', 'owner', 'cuentasoficiales', 'creador', 'cuentas']

export default handler