module.exports = async function (domain) {
    const dns = require('dns');
    const dnsPromises = dns.promises;
    const options = {all: true};
    return dnsPromises.lookup(domain, options).then((result) => result);
}