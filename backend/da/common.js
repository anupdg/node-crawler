const con = require('./pool');
const { getInsertFields, getInsertPlaceholders, getInsertArray } = require('../common');

module.exports = {
    getByTableAndDomainId: async function (table, domain_id) {
        const queryStr = `select * from ${table} where domain_id = ?`;
        const query = con.query(queryStr, [domain_id]);
        const data = await query;
        return data;
    },
    insertRow: async function (table, data, dbFields) {
        await module.exports.deleteAll(table, data.domain_id);
        let queryStr = "INSERT INTO `" + table + "` (fields) VALUES(values)";
        queryStr = queryStr.replace('fields', getInsertFields(dbFields));
        queryStr = queryStr.replace('values', getInsertPlaceholders(dbFields));
        const insertValueArray = getInsertArray(dbFields, data);
        const query = con.query(queryStr, insertValueArray);
        let result = await query;
        return result;
    },
    deleteAll: async function (table, domain_id) {
        const queryStr = "DELETE FROM `" + table + "` WHERE `domain_id`=?";
        const query = con.query(queryStr, [domain_id]);
        let result = await query;
        return result;
    },
    insertMultiRow: async function (table, data, dbFields) {
        await module.exports.deleteAll(table, data[0].domain_id);
        let queryStr = "INSERT INTO `" + table + "` (fields) VALUES ?";
        queryStr = queryStr.replace('fields', getInsertFields(dbFields));
        let values = [];
        data.forEach(d => {
            let row = [];
            dbFields.forEach(f=> row.push(d[f]));
            values.push(row);
        });
        result = await con.query({
            sql: queryStr,
            values: [values]
        });
        return result;
    },
    insertNoData: async function (table, message, domain_id) {
        await module.exports.deleteAll(table, domain_id);
        let queryStr = "INSERT INTO `" + table + "` (`domain_id`, `message`) VALUES(?, ?)";
        const query = con.query(queryStr,  [domain_id, message]);
        let result = await query;
        return result;
    },
}