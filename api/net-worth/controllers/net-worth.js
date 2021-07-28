'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

 module.exports = {
    findLast: async () => {
      const last = await strapi.query('net-worth').search({ _q: 'my search query', _limit: 1, _sort: 'published_at:desc' });
      return last;
    },
  };
