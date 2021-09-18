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
    const {data}= balances
    const promises = new Array
    for (let dex = 0; dex < data.length; dex++){
      const {network,protocols}  = data[dex]
      for (let index = 0; index < protocols.length; index++){
        const element = protocols[index];
        //for protocol in protocols
        const url =`${URL_B_ZAP}protocols/${element.protocol}/balances/?${url_addresses}network=${network}&api_key=${ZAPPER_API_KEY}`
        promises.push(url)
      }
    }
    const response = await Promise.all(promises)
    return response;
  }
};
