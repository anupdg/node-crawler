const { extractLinkByText, concateUrl, getPageContent, getTextFromHTML } = require('../common');
const { config } = require('../config');

module.exports = async function (domain, html) {
    const searchKey = config.contact;
    let contactUsData = await extractLinkByText(domain, searchKey, html);
    if (contactUsData.error) {
        return contactUsData;
    } else if (contactUsData && contactUsData.length > 0) {
        let contactUsLink = contactUsData[0].link;
        if (contactUsLink) {
            if (contactUsLink.indexOf('//') == 0){
                contactUsLink = `https:${contactUsLink}`;
            }else if (!(contactUsLink.indexOf('http://') == 0 || contactUsLink.indexOf('https://') == 0)) {
                contactUsLink = concateUrl(domain, contactUsLink);
            }

            contactUsData = await getPageContent(`${contactUsLink}`);
            contactUsData = await getTextFromHTML(contactUsData);
            contactUsData = contactUsData.replace(/[\ud800-\udfff]/g, "");
            return contactUsData;
        }
    } else {
        return '';
    }
}