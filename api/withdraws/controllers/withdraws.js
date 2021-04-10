/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const Fintoc = require('fintoc');

const client = new Fintoc('api_key');

module.exports = {
  getAll: async (ctx) => {
    console.log(ctx);
    console.log(process.env.MONGO_URI);
  },
};
