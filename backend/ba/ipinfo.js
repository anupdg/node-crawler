const {getAPI} = require('../common')

module.exports = async function(domain) {
    const info = await getAPI(`https://ipapi.co/${ip4}/json/`);
    
}
