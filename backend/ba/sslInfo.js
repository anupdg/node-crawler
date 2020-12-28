const sslCertificate = require('get-ssl-certificate');

module.exports = async function (domain) {
    const sslInfo = await sslCertificate.get(domain);
    return sslInfo;
}