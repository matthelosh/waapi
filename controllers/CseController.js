const axios = require('axios')
const cheerio = require('cheerio')

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
    }
}

module.exports = cse