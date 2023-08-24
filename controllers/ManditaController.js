const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const apiUrl = process.env.APP_ENV == 'local' ? process.env.DEV_API_URL : process.env.PROD_API_URL;

const Info = {
  sekolah: async(message) => {
    let balasan = '';
    let result = await axios.get(apiUrl+'/sekolah', {headers: {token: 'mandita'}})
    let sekolah = result.data.sekolah
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
  siswa: async(keyword) => {
    let balasan = '';
    let qry = keyword.split(":");

    if(qry.length < 2 || qry[1] == '') {
      let result = await axios.get(apiUrl+'/siswa?kelas=all', {headers: {token: 'mandita'}})
      balasan = result.data.siswas;
    } else {
      let result = await axios.get(apiUrl+'/siswa?nama='+qry[1], {headers: {token: 'mandita'}})
            balasan = result.data.siswas;
    }

    return balasan; 
  },
  guru: async(keyword) => {
    let balasan = '';
    // let qry = keyword.split(":");
    let q = ( !keyword.includes(":") || keyword.split(":")[1] == '' ) ? 'all' : keyword.split(":")[1];
    let result = await axios.get(apiUrl+'/guru?nama='+q, {headers: {token: 'mandita'}})
    balasan = result.data.gurus;

    return balasan; 
  },
  agenda: async(keyword) => {
    let balasan = '';
    // let qry = keyword.split(":");
    let q = ( !keyword.includes(":") || keyword.split(":")[1] == '' ) ? 'all' : keyword.split(":")[1];
    let result = await axios.get(apiUrl+'/agenda?bulan='+q, {headers: {token: 'mandita'}})
    balasan = result.data.agendas;
    return balasan; 
    
  },
}

const Bos = {
  anggaran: async(keyword) => {
    // bos anggaran:tersedia | terlaksana | null
    let balasan = "";
    let q = ( !keyword.includes(":") || keyword.split(":")[1] == '' ) ? 'all' : keyword.split(":")[1];
    let result = await axios.get(apiUrl+'/bos/rkas?q='+q, { headers: {token: 'mandita'}})
    

    balasan = result.data.rkas;
    // console.log(balasan);
    return balasan;
  }

}

module.exports = {Info, Bos}
