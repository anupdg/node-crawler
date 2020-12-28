const axios = require('axios');
var jsdom = require('jsdom');
var dom = new jsdom.JSDOM();
var window = dom.window;
var $ = require('jquery')(window);


const dnsLookup = async function (domain) {
    try{
        const dns = require('dns');
        const dnsPromises = dns.promises;
        const options = { all: true };
        result = await dnsPromises.lookup(domain, options).then((result) => result);
    }catch(err){
        console.log(err)
    }

    
}

const getAPI = async function (url) {
    console.log(url);
    return new Promise((resolve, reject) =>
        axios.get(url)
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    resolve(data);
                }
            }, (error) =>
                console.log(error))
    );
}

const getPageContent = async function (url) {
    return new Promise((resolve, reject) =>
        axios.get(url)
            .then((response) => {
                if (response.status === 200) {
                    const html = response.data;
                    resolve(html);
                }
            })
            .catch((error) =>
                console.log(error)
            ));
}

const getPageText = async function (url) {
    return new Promise((resolve, reject) =>
        getPageContent(url)
            .then(html => {
                const $ = require('jquery-jsdom');
                resolve($(html).text());
            }))
}

const concateUrl = function (domain, link) {
    if (domain.endsWith('/') && link.startsWith('/')) {
        link = `https://${domain}${link.substring(1)}`;
    } else if (domain.endsWith('/') || link.startsWith('/')) {
        link = `https://${domain}${link}`;
    } else {
        link = `https://${domain}/${link}`;
    }
    return link;
}

const getInsertFields = function (dbFields) {
    const fieldData = dbFields.join("`, `");
    return "`" + fieldData + "`";
}

const getInsertPlaceholders = function (fields) {
    let fieldString = '';
    fields.forEach(e => {
        fieldString += '?,';
    });
    return fieldString.substring(0, fieldString.length - 1);
}

const getInsertArray = function (fields, data) {
    let valueArray = [];
    fields.forEach(e => {
        if (Array.isArray(data[e])) {
            let str = data[e].join(',').replace(/'/g, '"');
            valueArray.push(str);
        } else {
            valueArray.push(data[e] && isNaN(data[e])?data[e].replace(/'/g, '"') : data[e]);
        }
    });
    return valueArray;
}
const getTextFromHTML = async function (html) {
    let text = $(html).text();
    try{
        text = $(text).text();
    }catch(er){}
    return text;
}

const getHtml = async function (domain) {
    domain = `https://${domain}`;
    let html = '';
    try {
        const got = require("got");
        let res = await got.get(domain);
        if (res && res.body) {
            html = res.body;
        }
    } catch (error) {
    }
    return html;
}

const extractLinkByText = async function (domain, config, inputHtml) {
    const searchText = config.keys;
    if(!searchText || (searchText && searchText.length == 0)){
        return [];
    }
    domain = `https://${domain}`;
    let html = '';
    if (inputHtml) {
        html = inputHtml;
    } else {
        try {
            const got = require("got");
            let res = await got.get(domain);
            if (res && res.body) {
                html = res.body;
            }
        } catch (error) {
            console.log(error.response.body);
            return { error: { message: error.message, body: error.response.body } };
        }
    }

    let links = [];
    if (html) {

        //var cheerio = require('cheerio');

        //$ = cheerio.load(html);

        
        var as = $(html).find('a');

        searchText.forEach(c => {
            for(let i=0; i< as.length; i++){
                if($(as[i]).text().toLowerCase().indexOf(c) >= 0){
                    links.push({ "link": $(as[i]).attr('href') });
                    break;
                }
            }

            // let allLinks = $('a');
            // allLinks.each(function () {
            //     var linkText = $(this).text().trim().toLowerCase();
            //     if (config.exact && linkText == c) {
            //         links.push({ "link": $(this).attr('href') });
            //     } else if (linkText.indexOf(c) >= 0) {
            //         links.push({ "link": $(this).attr('href') });
            //     }
            // })
        });
    }
    return links;
}
const extractLinkByUrl = async function (domain, config, inputHtml) {
    domain = `https://${domain}`;
    let html = '';
    if (inputHtml) {
        html = inputHtml;
    } else {
        try {
            const got = require("got");
            let res = await got.get(domain);
            if (res && res.body) {
                html = res.body;
            }
        } catch (error) {
            console.log(error.response.body);
            return { error: { message: error.message, body: error.response.body } };
        }
    }

    let links = [];
    if (html) {
        var cheerio = require('cheerio');
        $ = cheerio.load(html);
        const searchText = config.keys;
        searchText.forEach(c => {
            let allLinks = $('a');
            allLinks.each(function () {
                let href = $(this).attr('href');
                if (href) {
                    var linkUrl = href.trim().toLowerCase();
                    if (linkUrl.indexOf(c) >= 0) {
                        links.push({ "link": $(this).attr('href') });
                    }
                }
            })
        })
    };
    return links;
}
const logMessage = async function (message, data = {}) {
    console.log(message, data ? JSON.stringify(data) : '');
}

const saveFile = async function (fileName, data) {
    const path = require('path');
    const fs = require('fs');
    await fs.writeFile(path.join(__dirname, 'logs', fileName), data, function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });
}
module.exports = {
    getPageContent, getPageText, concateUrl, getAPI, dnsLookup,
    getInsertFields, getInsertPlaceholders, getInsertArray, extractLinkByText, getTextFromHTML,
    extractLinkByUrl, logMessage, getHtml, saveFile
}