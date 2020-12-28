const util = require('util');
const mysql = require('mysql');
const config = {
    host: 'localhost',
    user: 'root',
    password: 'dgmysql123',
    database: 'webchecker',
    connectionLimit: 5,
    connectTimeout: 10000,
    acquireTimeout: 10000, 
    waitForConnections: true, 
    queueLimit: 0
};
const pool = mysql.createPool(config);
pool.query = util.promisify(pool.query)
module.exports = pool