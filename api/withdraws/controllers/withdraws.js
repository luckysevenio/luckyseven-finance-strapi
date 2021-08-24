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
          r.push({ ...movement });
        }
        return r;
      }, [],
    );
    return filteredMovements;
  },
  findByUser: async (ctx) => {
    const { user } = ctx.params;
    const bancoChileLink = await client.getLink(FINTOC_BANCO_CHILE_LINK);
    const bancoChileAccount = bancoChileLink.find({ type_: 'checking_account' });
    const movements = await bancoChileAccount.getMovements({ per_page: 300 });
    const regexes = await strapi.query('deposit-regex').find({ owner: user } || undefined);
    const filteredMovements = movements.reduce(
      (r, movement) => {
        regexes.map((regex) => {
          if (movement.description === regex.regex) {
            r.push({ ...movement });
          }
        })
        return r;
      }, [],
    );
    return filteredMovements;
  },
  resultByUser: async (ctx) => {
    const { user } = ctx.params;
    const bancoChileLink = await client.getLink(FINTOC_BANCO_CHILE_LINK);
    const bancoChileAccount = bancoChileLink.find({ type_: 'checking_account' });
    const movements = await bancoChileAccount.getMovements({ per_page: 300 });
    const regexes = await strapi.query('deposit-regex').find({ owner: user } || undefined);
    const trans = movements.reduce(
      (r, movement) => {
        regexes.map((regex) => {
          if (movement.description === regex.regex) {
            r.push({ ...movement });
          }
        })
        return r;
      }, [],
    );
    const payment = await strapi.query('payments').find({ Owner: user, _sort: 'Year:desc' });
    payment.sort((a, b) => {
      if ((a.Month <= b.Month) && (a.Year <= b.Year)) {
        return 1
      } else {
        return -1
      }
    })
    var res = trans.reduce((a, b) => {
      a[(new Date(b.transactionDate).getFullYear() + '/' + (new Date(b.transactionDate).getMonth() + 1))] = (a[(new Date(b.transactionDate).getFullYear() + '/' + (new Date(b.transactionDate).getMonth() + 1))] || 0) + b.amount
      return a;
    }, {})
    const array_results = new Array;
    const array_global = [0,0,0];
    const keys = Object.keys(res);
    keys.forEach((key, index) => {
      payment.map((pay) => {
        if ((pay.Year).toString() + "/" + (pay.Month).toString() === key) {
          array_results[index] = {"fecha":key,"retiros": res[key], "sueldos": parseInt(pay.Amount), "resultado": parseInt(pay.Amount) - res[key] }
          array_global[0]+=res[key];
          array_global[1]+=parseInt(pay.Amount);
          array_global[2]+=parseInt(pay.Amount) - res[key];
        }
      })
    });
    const obj_global={"retiros":array_global[0],"sueldos":array_global[1],"resultados":array_global[2]}
    const obj_final={"detalle":array_results,"global":obj_global}
    return obj_final;
  }
};
