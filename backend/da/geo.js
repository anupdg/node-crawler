const { insertRow } = require('./common');

module.exports = {
    insertGeo: async function (geoData) {
        const dbFields = ['registrar', 'creation_date', 'updated_date', 'domain_id', 'name_server',
            'ip', 'city', 'region', 'region_code', 'country', 'country_code', 'postal', 'asn', 'registrant_organization'];
        result = await insertRow('geo_info', geoData, dbFields);
        return result;
    }
}