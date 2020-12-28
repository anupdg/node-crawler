const express = require('express');
const { config } = require('./config');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const domain = require('./da/domain');
const { getDetails, getContactUs } = require('./da/details');
const path = require('path');

app.use(express.static(path.join(__dirname, 'ui')));

process.on('uncaughtException', (err) => {
    console.log('whoops! there was an error');
});
app.use((err, req, res, next) => {
    console.log('whoops! there was an error');
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.post('/crawler', async (req, res, next) => {
    const crawler = require('./ba/crawler');
    let websiteDomain = req.body.domain;
    websiteDomain = websiteDomain.trim();
    if(websiteDomain.endsWith('/')){
        websiteDomain = websiteDomain.substring(0, websiteDomain.length-1);
    }
    let dbDomain = await domain.getDomainByName(websiteDomain);
    if (!dbDomain) {
        const inserted = await domain.insertDomain(websiteDomain);
        dbDomain = { domainId: inserted.insertId, domainName: websiteDomain };
    }
    const crawlData = await crawler.crawlInfo(dbDomain.domainName);
    const insertedInfo = await crawler.insertData(dbDomain.domainId, crawlData);
    await domain.setUpdatedDate(dbDomain.domainId);
    res.send({ domain: { ...dbDomain }, crawlData });
});

app.get('/domains', async function (req, res, next) {
    const data = await domain.getDomains();
    res.send(data);
});

app.post('/domains/:domainId/delete', async function (req, res, next) {
    const domainId = req.params.domainId;
    const data = await domain.deleteDomain(domainId);
    res.send(data);
});

app.get('/domains/:domainName', async function (req, res, next) {
    let dbDomain = await domain.getDomainByName(req.params.domainName);
    if(dbDomain && dbDomain.domainId){
    const data = await getDetails(dbDomain.domainId);
    res.send(data);
    }
});

app.get('/domains/:domainName/contact', async function (req, res, next) {
    let dbDomain = await domain.getDomainByName(req.params.domainName);
    if(dbDomain && dbDomain.domainId){
        const data = await getContactUs(dbDomain.domainId);
        res.send(data);
    }
});
app.get('/*', async (req, res) => {
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`)
})