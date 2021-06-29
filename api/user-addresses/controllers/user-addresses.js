/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  findOneUser: async (ctx) => {
    const { user } = ctx.params;
    const info = await strapi.query('user-addresses').findOne({ email: user });
    return info;
  },
  updateUserAddress: async (ctx) => {
    const { user } = ctx.params;
  },
};
