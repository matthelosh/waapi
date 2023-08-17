const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { PrismaClient } = require('@prisma/client');
const { Info } = require("./ManditaController");
const { Buttons, GroupChat } = require('whatsapp-web.js/src/structures');

const prisma = new PrismaClient()

const client = new Client({
  authStrategy: new LocalAuth(),
})

client.on('qr', (qr) => {
  // console.log('QR RECEIVED', qr);
  qrcode.generate(qr, {small: true});
})

client.on('ready', async() => {
  console.log('Client Siap');
});


client.on('message', async(message) => {
  let chat = await message.getChat();
  let group = process.env.APP_ENV == 'local' ? '120363149742466007@g.us' : '628563580593-1487811497@g.us';
  if (chat.isGroup) {
    if (chat.id._serialized == group ) {
      let balasan = '';
        // let balasan = await Info.sekolah(message);
        let keywords = message.body.split(" ");
        if (keywords[0].toLowerCase() == 'info') {
          if (typeof keywords[1] === 'undefined') {
            balasan = 'Info apa yang Anda butuhkan?';  
          } else {
            // balasan = await Info[keywords[1]](message);
            switch(keywords[1]) {
              default:
                balasan = "Maaf, Saya belum memiliki info tentang "+keywords[1];
                break;
              case "sekolah":
                balasan = await Info.sekolah(message);
                break;
              case "siswa" :
                balasan = await Info.siswa(message);
              break;
            }
          }
        }

      message.reply(balasan)
    }
    


    await prisma.Chat.upsert({
      where: {chatId: chat.id._serialized},
      update: {chatId: chat.id._serialized, name: chat.name},
      create: {chatId: chat.id._serialized, name: chat.name}
    });
  } else {
    // Private msg
    
      // let button = new Buttons('Button body', [{body: 'Terima'}, {body: 'Tolak'}], 'footer');
    message.reply("tes");
  }
})

client.initialize();

const wa = {
  send : async(req, res) => {
    // console.log(req.body.chatId)
    try {
      if(req.body.isGroup == '1') {
        let sent = await client.sendMessage(req.body.chatId, req.body.pesan)
        // console.log(sent)
        res.json({status: 'ok', msg: 'Pesan terkirim ke grup.'})
      } else {
        const isRegistered = await client.isRegisteredUser(req.body.chatId+'@c.us')
        if (isRegistered) {
          let sent = await client.sendMessage(req.body.chatId+'@c.us', req.body.pesan)
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
