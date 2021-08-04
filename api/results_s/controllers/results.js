/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  findLast: async (ctx) => {
    const { user } = ctx.params;
    const last = await strapi.query('results').find({ Owner: user, _limit: 1, _sort: 'published_at:desc' });
    return last;
  },
};
