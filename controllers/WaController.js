const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { PrismaClient } = require('@prisma/client');
const { Info ,Bos} = require("./ManditaController");
const util = require('util');
const schedule = require('node-schedule');
const fs = require('fs');

const Remind = require('./Remainder');
const prisma = new PrismaClient()

const client = new Client({
  puppeteer: {
    executablePath: process.env.APP_ENV == 'local' ? 'C:\\Users\\matts\\AppData\\Local\\Google\\Chrome\\Application\\Chrome.exe' : "/usr/bin/google-chrome"
  },
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

const remindSeragam = async() => {
  let chat = client.getChatById("6285173303784@c.us");
  let pgri = await MessageMedia.fromUrl("https://is3.cloudhost.id/sdn1bedalisodo/images/pgri.png");
  let korpri = await MessageMedia.fromUrl("https://is3.cloudhost.id/sdn1bedalisodo/images/Korpri.gif");

  schedule.scheduleJob("50 15 6 25 * *", () => {
    client.sendMessage("628563580593-1487811497@g.us", pgri, {caption: "Jangan lupa pakai PGRI ya"});
   });

  schedule.scheduleJob("30 15 6 17 * *", () => {
    client.sendMessage("628563580593-1487811497@g.us", korpri, {caption: "Jangan lupa pakai Korpri ya"});
  });
}


client.on('message', async(message) => {
  let chat = await message.getChat();
  let group = process.env.APP_ENV == 'local' ? '120363149742466007@g.us' : '628563580593-1487811497@g.us';
  if (chat.isGroup) {
    if (chat.id._serialized == group ) {
      let balasan = '';
      let keywords = ['info', 'bos'];
      let teks = message.body.split(" ");
      if(keywords.includes(teks[0].toLocaleLowerCase())) {
        if (teks.length > 2 ) {
          balasan = "Maaf! untuk saat ini saya hanya dapat menjawab 2 kata kunci. Misalnya \'info siswa\'";
        } else {
          if (teks[0].toLowerCase() == 'info') {
            if (typeof teks[1] === 'undefined') {
              balasan = 'Info apa yang Anda butuhkan?';  
            } else {
              if(/^sekolah/gi.test(teks[1])) {
                balasan = await Info.sekolah(message);
              } else if(/^siswa/gi.test(teks[1])) {
                balasan = await Info.siswa(teks[1]);
              } else if(/^guru/gi.test(teks[1])) {
                balasan = await Info.guru(teks[1]);
              } else if(/^agenda/gi.test(teks[1])) {
                balasan = await Info.agenda(teks[1]);
              } else {
                balasan = "Maaf, Saya belum memiliki info tentang "+teks[1];
              }
  
            }
          } else if (teks[0].toLowerCase() == 'bos') {
              if (typeof teks[1] === 'undefined') {
                balasan = 'Informasi BOS apa yang ingin Anda ketahui?';
              } else {
                if(/^anggaran/gi.test(teks[1])) {
                  balasan = await Bos.anggaran(teks[1]);
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
