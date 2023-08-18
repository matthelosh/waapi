const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const apiUrl = process.env.APP_ENV == 'local' ? process.env.DEV_API_URL : process.env.PROD_API_URL;

const Info = {
  sekolah: async(message) => {
    let balasan = '';
    let result = await axios.get(apiUrl+'/sekolah', {headers: {token: 'mandita'}})
    let sekolah = result.data.sekolah
    // console.log(sekolah[msg[1]])
    balasan = `
NPSN: ${sekolah.npsn},\n
NSS: ${sekolah.nss},\n
Nama: ${sekolah.nama},\n
Alamat: ${sekolah.alamat},\n
Desa: ${sekolah.desa},\n
Kode Pos: ${sekolah.kode_pos},\n
Telp: ${sekolah.telp},\n
Email: ${sekolah.email},\n
Website: ${sekolah.website}
Kepala Sekolah: ${sekolah.ks.nama},\n
NIP Kepala Sekolah: ${sekolah.ks.nip}
`        
    return balasan
  },
  siswa: async(message) => {
    let balasan = '';
    let keywords = message.body.split(" ")
    // let kelas = (typeof keywords[2] === 'undefined') ? 'all' : keywords[2];
    if (typeof keywords[2] === 'undefined') {
      let result = await axios.get(apiUrl+'/siswa?kelas=all', {headers: {token: 'mandita'}})
      balasan = result.data.siswas;
    } else {
      let keyword = keywords[2].split(":")
      switch(keyword[0]) {
        default:
          balasan = "Maaf, kata kunci belum saya ketahui";
          break;
        case "kelas":
          if(typeof keyword[1] === 'undefined') {
            balasan = "Maaf! Anda harus sertakan kode kelasnya setelah tanda : Contoh =\n info siswa kelas:5"
          } else {
            let result = await axios.get(apiUrl+'/siswa?kelas='+keyword[1], {headers: {token: 'mandita'}})
            balasan = result.data.siswas;
          }
          break;
        case "nama":
           if(typeof keyword[1] === 'undefined') {
            balasan = "Maaf! Anda harus sertakan kode kelasnya setelah tanda : Contoh =\n info siswa nama:Jono"
          } else {
            let result = await axios.get(apiUrl+'/siswa?nama='+keyword[1], {headers: {token: 'mandita'}})
            balasan = result.data.siswas;
          }
          break;

      }
    }
    return balasan; 
  }
}

module.exports = {Info}
