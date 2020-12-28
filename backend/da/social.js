const { insertMultiRow } = require('./common');

module.exports = {
    insertSocial: async function (socialData) {
        const dbFields = ['link', 'type', 'domain_id'];
        result = await insertMultiRow('social', socialData, dbFields);
        return result;
    }
}