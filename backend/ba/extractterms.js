const {extractLinkByText} = require('../common');
const { config } = require('../config');

module.exports = async function(domain, html){
    const searchKey =  config.terms;
    const termsData = await extractLinkByText(domain, searchKey, html);
    return termsData;
}