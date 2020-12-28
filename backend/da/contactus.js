const { insertRow } = require('./common');

module.exports = {
    insertContactUs: async function (data) {
        const dbFields = ['contact_us',  'domain_id'];
        result = await insertRow('contactus', data, dbFields);
        return result;
    }
}