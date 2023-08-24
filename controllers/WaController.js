const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { PrismaClient } = require('@prisma/client');
const { Info ,Bos} = require("./ManditaController");
const util = require('util');
const schedule = require('node-schedule');

const Remind = require('./Remainder');
const prisma = new PrismaClient()

const client = new Client({
  authStrategy: new LocalAuth(),
})



client.on('qr', (qr) => {
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, {small: true});
})

// client.on('authenticated', (session) => {
  // console.log(util.format(session));
// });

// client.on('auth_failure', (err) => {
  // console.log(err);
// });

client.on('ready', async() => {
  console.log('Client Siap');
  // Remind.seragam();
  remindSeragam();
});

const remindSeragam = () => {
  let chat = client.getChatById("6285173303784@c.us");
  let pgri = MessageMedia.fromUrl("https://is3.cloudhost.id/sdn1bedalisodo/images/pgri.png");

  schedule.scheduleJob("* 13 21 24 * *", () => {
    // chat.sendStateTyping().then(() => chat.sendMessage("Halo"))
    // console.log(chat)
    client.sendMessage("6285173303784@c.us", new MessageMedia.fromUrl("https://is3.cloudhost.id/sdn1bedalisodo/images/pgri.png", {filename: "Jangan lupa Besok Pakai Seragam PGRI, ya.."}))
    
  })
}


client.on('message', async(message) => {
  let chat = await message.getChat();
  let group = process.env.APP_ENV == 'local' ? '120363149742466007@g.us' : '628563580593-1487811497@g.us';
  if (chat.isGroup) {
    if (chat.id._serialized == group ) {
      let balasan = '';
        let keywords = message.body.split(" ");
        if(keywords.length > 2) {
          balasan = "Saat ini saya hanya bisa menjawab 2 (dua) buah kata kunci saja.\n Seperti \'info siswa\'"
        }
        if (keywords[0].toLowerCase() == 'info') {
          if (typeof keywords[1] === 'undefined') {
            balasan = 'Info apa yang Anda butuhkan?';  
          } else {
            if(/^sekolah/gi.test(keywords[1])) {
              balasan = await Info.sekolah(message);
            } else if(/^siswa/gi.test(keywords[1])) {
              balasan = await Info.siswa(keywords[1]);
            } else if(/^guru/gi.test(keywords[1])) {
              balasan = await Info.guru(keywords[1]);
            } else if(/^agenda/gi.test(keywords[1])) {
              balasan = await Info.agenda(keywords[1]);
            } else {
              balasan = "Maaf, Saya belum memiliki info tentang "+keywords[1];
            }

          }
        } else {
          // return false
          if (keywords[0].toLowerCase() == 'bos') {
            if (typeof keywords[1] === 'undefined') {
            balasan = 'Informasi BOS apa yang ingin Anda ketahui?';
          } else {
            if(/^anggaran/gi.test(keywords[1])) {
              balasan = await Bos.anggaran(keywords[1]);
            } else {
              balasan = "Maaf, saya belum tahu jawabannya. :)"
            }
          }
        }
        }
      await chat.sendStateTyping()
                .then(() => {
                    setTimeout(() => {
                     message.reply(balasan)
                    }, 1000);
      })
                

    }
    


    await prisma.Chat.upsert({
      where: {chatId: chat.id._serialized},
      update: {chatId: chat.id._serialized, name: chat.name},
      create: {chatId: chat.id._serialized, name: chat.name}
    });
  } else {
    // Private msg
    await chat.sendStateTyping()
              .then(() => message.reply('Sebentar ya..'))
      // let button = new Buttons('Button body', [{body: 'Terima'}, {body: 'Tolak'}], 'footer');
    // message.reply("tes");
  }
})

client.initialize();

const wa = {
  info : async(req, res) => {
    // res.send(client);
    res.send(client.info);
  },
  send : async(req, res) => {
    // console.log(req.body.chatId)
    try {
      if(req.body.isGroup == '1') {

          let pesan = !req.body.media ? req.body.pesan : new MessageMedia(req.body.media.type, req.body.media.file, req.body.media.name);
        
          let caption = req.body.media ? {caption: req.body.pesan} : {};
        // let pesan = req.body.media ? new MessageMedia('image/png', req.body.media) : req.body.pesan;
        await client.sendMessage(req.body.chatId, pesan, caption)
        // console.log(sent)
        res.json({status: 'ok', msg: 'Pesan terkirim ke grup.'})
      } else {
        const isRegistered = await client.isRegisteredUser(req.body.chatId+'@c.us')
        if (isRegistered) {
          // console.log(req.body.media)
          let pesan = !req.body.media ? req.body.pesan : new MessageMedia(req.body.media.type, req.body.media.file, req.body.media.name);
          // console.log(pesan)
          let caption = req.body.media ? {caption: req.body.pesan} : {};
          let sent = await client.sendMessage(req.body.chatId+'@c.us', pesan, caption)
          // console.log(sent)
          res.json({status: 'ok', msg: 'Pesan terkirim.'})
        } else {
          res.json({status: 'fail', msg: 'Nomor belum terdaftar di Whatsapp.'})
        }
        // console.log(isRegistered)
      }
    } catch (err) {
      res.json({status: err})
    }
    // console.log(req.body.isGroup == '1')
  },
  groupIndex: async(req, res) => {
    try {
      const groups = await prisma.Chat.findMany()
      res.json({status: 'ok', groups: groups})
      // console.log(groups)
    } catch (error) {
      console.log(error)
    }
    
  }
}
module.exports = wa
