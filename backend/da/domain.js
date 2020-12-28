const con = require('./pool');
const { deleteAll } = require('./common');

module.exports = {
    getDomains: async function () {
        const queryStr = "select domain_id, domain from domain order by updateddate desc";
        const query = con.query(queryStr, []);
        const data = await query;
        return data;
    },
    insertDomain: async function (domain) {
        const queryStr = "INSERT INTO `domain` (`domain`) VALUES(?)";
        const query = con.query(queryStr, [domain]);
        let result = await query;
        return result;
    },
    deleteDomain: async function (domainId) {
        await deleteAll('geo_info', domainId);
        await deleteAll('ssl_info', domainId);
        await deleteAll('links', domainId);
        await deleteAll('contactus', domainId);
        await deleteAll('social', domainId);
        await deleteAll('log', domainId);
        await deleteAll('domain', domainId);
        return true;
    },
    getDomainByName: async function (domain) {
        const queryStr = "select domain_id, domain from  `domain` where domain like (?)";
        const query = con.query(queryStr, [`%${domain}%`]);
        let result = await query;
        if (Array.isArray(result) && result.length > 0) {
            return {
                domainId: result[0].domain_id,
                domainName: result[0].domain
            }
        } else {
            return null;
        }
    },
    setUpdatedDate: async function (domainId) {
        const queryStr = "UPDATE `domain` SET updateddate = ? WHERE `domain_id` = ?";
        const query = con.query(queryStr, [new Date(), domainId]);
        let result = await query;
        return result;
    },
}