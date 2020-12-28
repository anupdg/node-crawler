const whois = require('./whois');
const geoInfo = require('./geoinfo');
const dnslookup = require('./dnslookup');
const sslInfo = require('./sslInfo');
const extractPrivacy = require('./extractprivacy');
const extractTerms = require('./extractterms');
const extractContactUs = require('./extractcontactus');
const social = require('./social');
const { concateUrl, logMessage, getHtml, saveFile } = require('../common');
const { insertNoData } = require('../da/common');


module.exports = {
    domain: '',
    crawlInfo: async function (domain) {
        module.exports.domain = domain;

        logMessage("Information: Getting homepage html");
        let html = await getHtml(domain);

        //Uncomment the line below to log homepage content for the domain
        await saveFile(`${domain}.html`, html);

        logMessage("Information: Extracting whois data");
        const whoisData = await whois(domain);

        logMessage("Information: Extracting dns data");
        let dns = await dnslookup(domain);
        let ip = '';
        if (Array.isArray(dns) && dns.length > 0) {
            ip = dns[0].address;
        }

        let geoData = {};
        try {
            logMessage("Information: Extracting geo data");
            geoData = await geoInfo(ip);
        } catch (err) {
            logMessage("Error in extracting geo Data", err);
        }

        let sslData = {};
        try {
            logMessage("Information: Extracting ssl data");
            sslData = await sslInfo(domain);
        } catch (err) {
            logMessage("Error in extracting ssl Data", err);
        }


        let privacyLinks = {};
        try {
            logMessage("Information: Extracting privacy data");
            privacyLinks = await extractPrivacy(domain, html);
        } catch (err) {
            logMessage("Error in extracting privacy Data", err);
        }

        let termsLinks = {}
        try {
            logMessage("Information: Extracting terms data");
            termsLinks = await extractTerms(domain, html);
        } catch (err) {
            logMessage("Error in extracting terms Data", err);
        }

        let socialData = {};
        try {
            logMessage("Information: Extracting social media links");
            socialData = await social(domain, html);
        } catch (err) {
            logMessage("Error in extracting social Data", err);
        }

        let contactUs = {};
        try {
            logMessage("Information: Extracting contact us data");
            contactUs = await extractContactUs(domain, html);
        } catch (err) {
            logMessage("Error in extracting contact us Data", err);
        }

        return { whois: whoisData, dns: { ip }, geoData, sslData, privacyLinks, termsLinks, ...{ contact_us: contactUs }, socialData };
    },
    prepareSSLInfo: function (sslData) {
        if (sslData) {
            if (sslData.infoAccess) {
                const infoAccess = sslData.infoAccess;
                if (infoAccess['CA Issuers - URI'] && infoAccess['CA Issuers - URI'].length > 0) {
                    sslData.ca_issuers_uri = sslData.infoAccess['CA Issuers - URI'][0];
                }
                if (infoAccess['OCSP - URI'] && infoAccess['OCSP - URI'].length > 0) {
                    sslData.ocsp_uri = infoAccess['OCSP - URI'][0];
                }
            }
            if (sslData.valid_from) {
                sslData.valid_from = new Date(sslData.valid_from);
            }
            if (sslData.valid_to) {
                sslData.valid_to = new Date(sslData.valid_to);
            }
        }

        return sslData;
    },
    // prepareLinksInfo: function (data) {
    //     var links = { privacy: '' };
    //     if (data && data.privacyLinks && Array.isArray(data.privacyLinks) && data.privacyLinks.length > 0) {
    //         links.privacy = data.privacyLinks[0].link;
    //         if (links.privacy.indexOf('http') == -1) {
    //             links.privacy = concateUrl(module.exports.domain, links.privacy);
    //         }
    //     }
    //     if (data && data.termsLinks && Array.isArray(data.termsLinks) && data.termsLinks.length > 0) {
    //         links.terms = data.termsLinks[0].link;
    //         if (links.terms.indexOf('http') == -1) {
    //             links.terms = concateUrl(module.exports.domain, links.terms);
    //         }
    //     }
    //     return links;
    // },
    prepareLinksInfo: function (data, arrayKey, dataKey) {
        var links = { [dataKey]: '' };
        if (data && data[arrayKey] && Array.isArray(data[arrayKey]) && data[arrayKey].length > 0) {
            links[dataKey] = data[arrayKey][0].link;
            if (links[dataKey].indexOf('http') == -1) {
                links[dataKey] = concateUrl(module.exports.domain, links[dataKey]);
            }
        }
        return links;
    },
    prepareSocialInfo: function (domainId, data) {
        if (data) {
            data.forEach(e => {
                e.domain_id = domainId
            });
        }
        return data;
    },
    insertData: async function (domainId, data) {
        let result = {};
        try {
            const geoDa = require('../da/geo');
            logMessage("Information: Saving geo data");
            const geoInserted = await geoDa.insertGeo({ domain_id: domainId, ...data.whois, ...data.dns, ...data.geoData });
        } catch (err) {
            logMessage("Error in saving geo Data", err);
        }

        try {
            const sslData = module.exports.prepareSSLInfo(data.sslData);
            const sslDa = require('../da/ssl');
            logMessage("Information: Saving ssl data");
            const sslInserted = await sslDa.insertSsl({ domain_id: domainId, ...sslData });
        } catch (err) {
            logMessage("Error in saving ssl Data", err);
        }

        try {
            let linksData = {};
            const linksDa = require('../da/links');
            if (data.privacyLinks && data.privacyLinks.error) {
                let error = data.privacyLinks.error;
                error.type = 'privacy';
                log(err);
            } else {
                linksData = module.exports.prepareLinksInfo(data, 'privacyLinks', 'privacy');
            }

            if (data.termsLinks && data.termsLinks.error) {
                let error = data.termsLinks.error;
                error.type = 'term';
                log(err);
            } else {
                const termsData = module.exports.prepareLinksInfo(data, 'termsLinks', 'terms');
                linksData = {...linksData, ...termsData};
            }
            logMessage("Information: Saving terms and privacy links");
            const linksInserted = await linksDa.insertLinks({ domain_id: domainId, ...linksData });
        } catch (err) {
            logMessage("Error in saving link Data", err);
        }

        try {
            if (data.contact_us && data.contact_us.error) {
                let error = data.contact_us.error;
                error.type = 'contactus';
                log(error);
            } else {
                const contactusDa = require('../da/contactus');
                logMessage("Information: Saving contact us data");
                const contactusInserted = await contactusDa.insertContactUs({ domain_id: domainId, ...data });
            }
        } catch (err) {
            logMessage("Error in saving contact us Data", err);
        }

        try {
            const socialDa = require('../da/social');
            const socialData = module.exports.prepareSocialInfo(domainId, data.socialData);
            if (socialData.length == 0) {
                insertNoData('social', 'Could not find any social data', domainId);
            } else {
                logMessage("Information: Saving social links");
                const socialInserted = await socialDa.insertSocial(socialData);
            }


        } catch (err) {
            logMessage("Error in saving social Data", err);
        }
        return result;
    }
}