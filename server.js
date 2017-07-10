const express = require('express');
const requestLib = require('request');
const mcache = require('memory-cache');
const cheerio = require('cheerio');
const moment = require('moment');

// cache helper pas to endpont handler on line 42 as middleware that prevent parsing if cache isn't expire
const cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = mcache.get(key);
        if (cachedBody) {
            console.log('cachedBody');
            res.send(cachedBody);
            return
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            };
            next(); // run callback function with parsing
        }
    }
};

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

app.get('/allEvents', cache(3600), function (request, response) {
    console.log('do request');
    run().then((data) => {
        response.send(data)
    });

});

//parser logic start

function run() {
    const doRequests = [
        parseContent('http://runukraine.org/',
            el => {
                return {
                    title: el.find('h2').text(),
                    img: el.find('img').attr('src'),
                    date: moment(el.find('.date').text(), "DD.MM.YYYY").toDate().toISOString(),
                    link: el.attr('href'),
                    type: el.find('c-type').children().length == 3 ? 'triathlon' : 'run'
                }
            }, '.main-events-list .event'),
        parseContent('https://athletic-events.com/en/events',
            el => {
                return {
                    title: el.find('h2.thin').eq(0).text(),
                    img: el.find('img').attr('src'),
                    date: el.find('.muted.small').html().substring(1,el.find('.muted.small').html().indexOf('<')-1),
                    link: 'https://athletic-events.com/' + el.find('a').attr('href'),
                    description: el.find('.description').text(),
                    type: el.attr('class').replace('row ', '')
                }
            }, '.hidden-tablet .events .row'),
        parseContent('https://sportevent.com.ua/events',
            el => {
                const monthArr=[
                    'Янв',
                    'Фев',
                    'Мар',
                    'Апр',
                    'Май',
                    'Июн',
                    'Июл',
                    'Авг',
                    'Сен',
                    'Ноя',
                    'Дек',
                ];
                return {
                    title: el.find('.event-name').children().remove().end().text(),
                    img: 'https://sportevent.com.ua/' + el.find('img').attr('src'),
                    date: (monthArr.indexOf(el.find('.event-date').eq(1).find('.calendar .month').eq(0).text().substring(0,3)) + 1) + ' ' + el.find('.event-date').eq(1).find('.calendar .day').text(),
                    link: 'https://sportevent.com.ua/' + el.attr('onclick').replace("location.href='", '').replace("';", ''),
                    description: el.find('.event-stext').text(),
                }
            }, '.event-holder')
    ];
    return Promise.all(doRequests).then((siteDataArray) => {
        return [].concat.apply([], siteDataArray);
    })
}

//parser logic end


//helpers

function getPageContent(url) {
    return new Promise(resolve => {
        requestLib.get(url, {}, (err, res, body) => {
            if (err) {
                console.log(err);
            }
            if (res.statusCode === 200) {
                resolve(body)
            }
        });
    })
}

function parseContent(url, parseMap, eventsSelector) {
    return getPageContent(url).then((data) => {
        const $ = cheerio.load(data);
        const events = $(eventsSelector);
        const dataFromPage = [];
        events.each((i, el) => {
            el = $(el);
            const event = parseMap(el);
            dataFromPage.push(event);
        });
        return dataFromPage;
    })
}
