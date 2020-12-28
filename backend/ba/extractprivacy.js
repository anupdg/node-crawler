const {extractLinkByText} = require('../common');
const { config } = require('../config');

module.exports = async function(domain, html){
    const searchKey =  config.privacy;
    const privacyData = await extractLinkByText(domain, searchKey, html);
    return privacyData;
}