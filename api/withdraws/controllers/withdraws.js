/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  getAll: async (ctx) => {
    console.log(ctx);
    console.log('hola');
  },
};
