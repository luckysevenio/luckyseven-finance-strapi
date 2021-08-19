'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const Fintoc = require('fintoc');

const { FINTOC_API_KEY, FINTOC_BANCO_CHILE_LINK } = process.env;
const client = new Fintoc(FINTOC_API_KEY);


module.exports = {
    findByOwner: async (ctx) => {
        const { owner } = ctx.params;
        const regexes = await strapi.query('deposit-regex').find({ owner: owner, _sort: 'published_at:desc' })
        return regexes;
    },
    findByRegex: async (ctx) => {
        const { regex } = ctx.params;
        const bancoChileLink = await client.getLink(FINTOC_BANCO_CHILE_LINK);
        const bancoChileAccount = bancoChileLink.find({ type_: 'checking_account' });
        const movements = await bancoChileAccount.getMovements({ since, until, per_page: 300 });
        const filteredMovements = movements.reduce(
            (r, movement) => {
                if (movement.description === regex) {
                    r.push(movement);
                }
                return r;
            }, [],
        );
        return movements;
    }
};
