const express = require('express');
const requestLib = require('request');
const mcache = require('memory-cache');
const cheerio = require('cheerio');

var cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url
        let cachedBody = mcache.get(key)
        if (cachedBody) {
            console.log('cachedBody');
            res.send(cachedBody)
            return
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }
            next()
        }
    }
}

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

app.get('/allEvents', cache(100), function (request, response) {
    console.log('do request');
    run().then((data) => {
        response.send(data)
    });

});

function run() {
    const doRequests = [
        parseContent('http://runukraine.org/',
            el => {
                return {
                    title: el.find('h2').text(),
                    img: el.find('img').attr('src'),
                    date: el.find('.date').text(),
                    link: el.attr('href'),
                }
            }, '.main-events-list .event'),
        parseContent('https://athletic-events.com/calendar',
            el => {
                return {
                    title: el.find('h2').text(),
                    img: el.find('img').attr('src'),
                    date: el.find('.span2.text-center strong').text(),
                    link: 'https://athletic-events.com/' + el.find('a').attr('href'),
                }
            }, '.events .row'),
        parseContent('https://sportevent.com.ua/events',
            el => {
                return {
                    title: el.find('.event-name').text(),
                    img: el.find('img').attr('src'),
                    date: el.find('.day').text() + ' ' + el.find('.month').text(),
                    link: el.attr('onclick').replace("location.href='", '').replace("'", ''),
                }
            }, '.event-holder')
    ];
    return Promise.all(doRequests).then((siteDataArray) => {
        return [].concat.apply([], siteDataArray);
    })
}

function getPageContent(url) {
    return new Promise(resolve => {
        requestLib.get(url, {}, (err, res, body) => {
            if (err) {
                console.log('errrr');
                console.log(err);
            }
            if (res.statusCode === 200) {
                resolve(body)
            }
        });
    })
}

function parseContent(url, parseMap, eventsSelecot) {
    return getPageContent(url).then((data) => {
        const $ = cheerio.load(data);
        const events = $(eventsSelecot);
        const dataFromPage = [];
        events.each((i, el) => {
            el = $(el);
            const event = parseMap(el);
            dataFromPage.push(event);
        });
        return dataFromPage;
    })
}
