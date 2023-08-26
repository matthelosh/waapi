const axios = require('axios')
const cheerio = require('cheerio')
const math = require('mathjs')
const {translate} = require('@vitalets/google-translate-api');

const cse =  {
    jawab: async(q = 'SD Negeri 1 Bedalisodo') => {
        let results = await axios.get(process.env.GOOGLE_CSE_URL, {
            params: {
              key: process.env.GOOGLE_CSE_API,
              cx: process.env.GOOGLE_CSE_ID,
              q: q
            }
          })
        
          let response = '';
        // res.send(results.data.items)
        // return results.data = {searchInformation, items[]}
        let info = results.data.searchInformation
        let items = results.data.items
          response += `
Berikut beberapa tulisan terkait ${q}:
          `;
        items.forEach(item => {
            response += `
${item.title}
${item.link}
${item.snippet}
========================
            `
        });
        // res.send(response)
        return response;
    },
    math: async(string) => {
        expression = string.replace(/[^x0-9:/+/-]/g, "").replace("x","*").replace(":","/").replace(" ","")
        result = math.evaluate(expression)
        return (typeof result === 'undefined') ? "Maaf, untuk saat ini saya hanya bisa menjawab operasi matematika sederhana." : `Hasil ${string} adalah: ${result}`
    },
    translate: async(string, lang='id') => {
        const { text } = await translate(string, {to: lang})
        return text
    }

}

module.exports = cse