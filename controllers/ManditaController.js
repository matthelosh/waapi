const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

const apiUrl = process.env.APP_ENV == 'local' ? process.env.DEV_API_URL : process.env.PROD_API_URL;

const Info = {
  sekolah: async(message) => {
    let msg = message.body.split(" ")

      let sekolah = await prisma.$queryRaw`SELECT * FROM Sekolah LIMIT 1`;
  
      if(msg[0] == "info") {
        let balasan = "";
        // let sekolah = await prisma.sekolah.findFirst({where: {id: 'd&$890er'}})
        // switch(msg[1]) {
        //   default:
        //     msg = "Mau tanya info apa?";
        //     break;
        // }
        // console.log(typeof msg[1] === 'undefined')
        // let sekolah = await prisma.$queryRaw`SELECT * FROM Sekolah LIMIT 1`;
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
        // let sekolah = await prisma.$queryRaw`SELECT * FROM Sekolah LIMIT 1`;
        let result = await axios.get(apiUrl+'/sekolah', {headers: {token: 'mandita'}})
        let sekolah = result.data.sekolah
        console.log(sekolah[msg[1]])
            //console.log(sekolah, msg[1])
            balasan = sekolah[msg[1]] 
          }
          // message.reply(balasan)
      return balasan;
          // console.log(sekolah.npsn)

      }

  }
}

module.exports = {Info}
