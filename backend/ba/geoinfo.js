const { getAPI } = require('../common');

module.exports = async function(ip){
    const info = await getAPI(`https://ipapi.co/${ip}/json/`);
    return info;
}