const { insertRow } = require('./common');

module.exports = {
    insertLinks: async function (linksData) {
        const dbFields = ['privacy',  'domain_id', 'terms'];
        result = await insertRow('links', linksData, dbFields);
        return result;
    }
}