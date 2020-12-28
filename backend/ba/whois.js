const whois = require('whois-json')

module.exports = async function (domain) {
    var results = await whois(domain);
    
    try{
        results.creation_date = new Date(results.creationDate);
        results.updated_date = new Date(results.updatedDate);
    }catch(er){}
    results.name_server = results.nameServer;
    results.registrant_organization = results.registrantOrganization;
    
    return results;
}
