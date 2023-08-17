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
  if (chat.isGroup) {
    // Chat ID Production //
    // if (chat.id._serialized == '628563580593-1487811497@g.us') {
      // if(msg[0] == "info") {
    // Chat Id Local //
    if (chat.id._serialized == '120363149742466007@g.us') {
      // message.reply("Maaf Bpk/Ibu, ini adalah pesan otomatis untuk eksperimen fitur kirim WA Otomatis. Ngapunten nggih, yang balas komputer bukan pak soleh. :)")
      // let msg = message.body.split(" ")

      // let sekolah = await prisma.$queryRaw`SELECT * FROM Sekolah LIMIT 1`;
  
      // if(msg[0] == "info") {
        // let balasan = "";
        // let sekolah = await prisma.$queryRaw`SELECT * FROM Sekolah LIMIT 1`;
        // if (typeof msg[1] === 'undefined') {
            // balasan = `
      // Mau informasi apa?\n
      // NPSN: "info npsn"\n,
      // NSS: "info nss"\n,
      // Nama Sekolah: "info nama"\n
      // Alamat: "info alamat"\n
      // Telepon: "info telp"\n
      // Email: "info email"\n
      // Website: "info website"\n
      // Terima kasih
                // `;
          // } else {
            // balasan = sekolah[0][msg[1]]
          // }
        let balasan = await Info.sekolah(message);
          message.reply(balasan)
          // console.log(sekolah.npsn)

      // }
    }
    let saveChat = await prisma.Chat.upsert({
      where: {chatId: chat.id._serialized},
      update: {chatId: chat.id._serialized, name: chat.name},
      create: {chatId: chat.id._serialized, name: chat.name}
    });
    // client.sendMessage(message.from, "Halo")
    // console.log(chat)
    
  } else {
    // Private msg
    
      let button = new Buttons('Button body', [{body: 'Terima'}, {body: 'Tolak'}], 'footer');
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
