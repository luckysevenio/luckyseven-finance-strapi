'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    findByOwner: async (ctx)=>{
        const { owner } = ctx.params;
        const regexes = await strapi.query('deposit-regex').find({owner: owner, _sort: 'published_at:desc'})
        return regexes;
    }
};
