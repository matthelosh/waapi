const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { PrismaClient } = require('@prisma/client');
// import { PrismaClient } from '@prisma/client';
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
    if (chat.id._serialized == '628563580593-1487811497@g.us') {
      // message.reply("Maaf Bpk/Ibu, ini adalah pesan otomatis untuk eksperimen fitur kirim WA Otomatis. Ngapunten nggih, yang balas komputer bukan pak soleh. :)")
    }
    prisma.chat.upsert({
      where: {chatId: chat.id._serialized},
      update: {chatId: chat.id._serialized, name: chat.name},
      create: {chatId: chat.id._serialized, name: chat.name}
    });
    // console.log("Grup "+chat.name+" disimpan.")
    let msg = message.body.split(" ")

    let sekolah = await prisma.$queryRaw`SELECT * FROM sekolah LIMIT 1`;
 
    if(msg[0] == "info") {
      let balasan = "";
      // let sekolah = await prisma.sekolah.findFirst({where: {id: 'd&$890er'}})
      // switch(msg[1]) {
      //   default:
      //     msg = "Mau tanya info apa?";
      //     break;
      // }
      console.log(typeof msg[1] === 'undefined')
      let sekolah = await prisma.$queryRaw`SELECT * FROM sekolah LIMIT 1`;
      if (typeof msg[1] === 'undefined') {
        balasan = `
  Mau informasi apa?\n
  NPSN: "info npsn"\n,
  NSS: "info nss"\n,
  Nama Sekolah: "info nama"\n
  Alamat: "info alamat"\n
  Telepon: "info telp"\n
  Email: "info email"\n
  Website: "info website"\n
  Terima kasih
            `;
      } else {
        balasan = sekolah[0][msg[1]]
      }
      message.reply(balasan)
      // console.log(sekolah.npsn)

    }
  } else {
    // Private msg
    let button = new Buttons('Button body', [{body: 'Terima'}, {body: 'Tolak'}], 'footer');
    message.reply("tes");
  }
})

client.initialize();

const wa = {
  send : async(req, res) => {
    const chatId = req.body?.isGroup == '1' ? req.body.chatId : req.body.chatId+'@c.us';
    const pesan = req.body.pesan;
    // console.log(req.body);
    // return false;
    if(!chatId || !pesan) {res.json({ status:'Mana No HP dan Pesannya?'})}
    else {
      if (client.isRegisteredUser(chatId)) {
        if (req.body.isGroup == '1') {
          // await client.sendMessage('628563580593-1487811497@g.us', pesan)
          // let group = await client.getChatById('628563580593-1487811497');
          client.sendMessage('628563580593-1487811497@g.us', pesan);
          // console.log(group);
        } else {
          await client.sendMessage(chatId, pesan);
        }

        res.json({status: "Pesan terkirim", pesan });

      } else {
        res.json({status: "gagal", msg: "No Hp Belum terdaftar"});
      }
    }
  },
  groupIndex: async(req, res) => {
    try {
      const groups = await prisma.chat.findMany()
      res.json({status: 'ok', groups: groups})
      // console.log(groups)
    } catch (error) {
      console.log(err)
    }
    
  }
}
module.exports = wa
