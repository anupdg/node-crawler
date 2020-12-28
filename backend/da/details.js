const { getByTableAndDomainId } = require('./common');

module.exports = {
    getData: async function(tableName, domain_id, dataKey, fieldKeys){
        const data = await getByTableAndDomainId(tableName, domain_id);
        let result = {};
        if(data && data.length > 0){
            result[dataKey] = {};
            let first = data[0];
            fieldKeys.forEach(d=>{
                if(first[d]){
                    result[dataKey][d] = first[d];
                }
            });
        } 
        return result;
    },
    getKeyValueData: async function(tableName, domain_id, key, valueKey){
        const data = await getByTableAndDomainId(tableName, domain_id);
        let result = {};
        if(data && data.length > 0){
            data.forEach(d=>{
                if(d.message){
                    result['nodata'] = d.message;
                }else{
                    result[d[key]] = d[valueKey];
                }
            });
        } 
        return result;
    },
    getDetails: async function (domain_id) {
        let geo = await module.exports.getData('geo_info', domain_id, 'geoData', ['registrar', 'asn', 'city', 'region', 'country', 'ip', 'name_server', 'creation_date', 'updated_date']);
        const ssl = await module.exports.getData('ssl_info', domain_id, 'sslData', ['ocsp_uri', 'ca_issuers_uri', 'valid_from', 'valid_to']);
        const who = await module.exports.getData('geo_info', domain_id, 'whoData', ['registrant_organization', 'creation_date', 'updated_date']);
        const socialData = await module.exports.getKeyValueData('social', domain_id, 'type', 'link');
        const links = await module.exports.getData('links', domain_id, 'linksData', ['privacy', 'terms']);
        return {...geo, ...ssl, ...who, socialData, ...links};    
    },
    getContactUs: async function (domain_id) {
        const data = await getByTableAndDomainId('contactus', domain_id);
        if(data && data.length > 0){
            let contactUs = data[0].contact_us;
            if(contactUs){
                contactUs = contactUs.split('\n').filter(c=>c.trim() != '')
                return{contact_us : contactUs};
            } 
            else{
                return {};
            }
        }
        else{
            return {};
        }
        
    }
}