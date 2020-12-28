const { extractLinkByUrl } = require('../common');

module.exports = async function (domain, html) {
    const searchKey = { keys: ['facebook.com', 'twitter.com', 'instagram.com'] };
    let socialDataTemp= [];
    let socialData = await extractLinkByUrl(domain, searchKey, html);
    if (socialData && socialData.length > 0) {
        searchKey.keys.forEach(e => {
            let social = socialData.find(s => s.link.indexOf(e) >= 0);
            if (social) {
                social.type = e.substring(0, e.indexOf('.'));
                if(social.link.startsWith('//')){
                    social.link = `https:${social.link}`;
                }
                socialDataTemp.push(social);
            }
        });
    }
    return socialDataTemp;
}
