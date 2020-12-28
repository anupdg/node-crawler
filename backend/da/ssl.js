const { insertRow } = require('./common');

module.exports = {
    insertSsl: async function (sslData) {
        const dbFields = ['domain_id', 'ocsp_uri', 'ca_issuers_uri', 'valid_from', 'valid_to'];
        result = await insertRow('ssl_info', sslData, dbFields);
        return result;
    }
}