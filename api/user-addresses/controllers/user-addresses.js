/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { default: axios } = require("axios");

const { URL_B_ZAP , ZAPPER_API_KEY } = process.env;

module.exports = {
  findOneUser: async (ctx) => {
    const { user } = ctx.params;
    const info = await strapi.query('user-addresses').findOne({ Owner: user });
    return info;
  },
  updateUserAddress: async (ctx) => {
    const { user } = ctx.params;
  },
  getBalances: async (ctx) =>{
    const { user } = ctx.params;
    const info = await strapi.query('user-addresses').findOne({ Owner: user });
    let url_addresses = '';
    info.Addresses.forEach(element => {
      url_addresses+=`addresses%5B%5D=${element}&`
    });
    const url = `${URL_B_ZAP}protocols/balances/supported?${url_addresses}&api_key=${ZAPPER_API_KEY}`
    const balances = await axios.get(url)
    const promises = (balances.data).map((bal,i)=>{
      const {network,protocols}  = bal
      for (let index = 0; index < protocols.length; index++) {
        const element = protocols[index];
        //for protocol in protocols
        promises.push(`${URL_B_ZAP}protocols/${element.protocol}/balances/?${url_addresses}network=${network}&api_key=${ZAPPER_API_KEY}`)
        console.log(promises);
        return promises 
        // console.log(i+1+"-"+bal.network+":"+prot.protocol+"\n");
        console.log(element);
      }
    })
    console.log(promises);

    const response = await Promise.all(promises)
    return balances.data;
  }
};
