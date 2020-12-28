const { insertRow } = require('./common');

module.exports = {
    logErrorInfo: async function (data) {
        const dbFields = ['message', 'body',  'domain_id', 'type'];
        result = await insertRow('log', data, dbFields);
        return result;
    }
}