

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    List: async (ctx) => {
        const { user } = ctx.params;
        const List = await strapi.query('payments').find({Mail: user, _sort: 'Year:desc' });
        List.sort((a, b) => {
            if ((a.Month <= b.Month)&&(a.Year <= b.Year)){
                return 1
            } else{
                return -1
            }
})
console.log(typeof (List));
return List;
    }
};
