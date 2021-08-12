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
    const url = `${URL_B_ZAP}?${url_addresses}network=ethereum&api_key=${ZAPPER_API_KEY}`
    const balances = await axios.get(url)     
    const totalbalance=()=>{
      let total= 0;
      for (let index = 0; index < Object.keys(balances.data).length; index++) {
        total+=Object.entries(balances.data)[index][1]['meta'][0]['value'];
      }
      return total
    }
    return totalbalance();
  }
};
