/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const Fintoc = require('fintoc');
const moment = require('moment');

const { FINTOC_API_KEY, FINTOC_BANCO_CHILE_LINK } = process.env;
const client = new Fintoc(FINTOC_API_KEY);

module.exports = {
  findByDate: async (ctx) => {
    const { year, month } = ctx.params;
    const { organization } = ctx.query;
    const since = moment().set({ year, month }).startOf('month').toISOString();
    const until = moment().set({ year, month }).endOf('month').toISOString();
    const bancoChileLink = await client.getLink(FINTOC_BANCO_CHILE_LINK);
    const bancoChileAccount = bancoChileLink.find({ type_: 'checking_account' });
    const movements = await bancoChileAccount.getMovements({ since, until, per_page: 300 });
    const regexes = await strapi.query('deposit-regex').find((organization && { organization }) || undefined);
    const filteredMovements = movements.reduce(
      (r, movement) => {
        if (regexes.map((regex) => regex.regex).includes(movement.description)) {
          r.push(
            {
              ...movement,
              organization: organization || regexes.find(
                (regex) => regex.regex === movement.description,
              ).organization,
            },
          );
        }
        return r;
      }, [],
    );
    return filteredMovements;
  },
  getMonthResult: async (ctx) => {
    const filteredMovements = await strapi.controllers.withdraws.findByDate(ctx);
    return filteredMovements.reduce((r, movement) => ({
      amount: r.amount + movement.amount,
    }), { amount: null });
  },
  findByRegex: async (ctx) => {
    const { regex } = ctx.params;
    const bancoChileLink = await client.getLink(FINTOC_BANCO_CHILE_LINK);
    const bancoChileAccount = bancoChileLink.find({ type_: 'checking_account' });
    const movements = await bancoChileAccount.getMovements({ per_page: 300 });
    const filteredMovements = movements.reduce(
      (r, movement) => {
        if (movement.description === regex) {
          r.push({...movement});
        }
        return r;
      }, [],
    );
    return filteredMovements;
  }
};
