const express = require('express');
const requestLib = require('request');
var mcache = require('memory-cache');

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

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

app.get('/give-me-page', cache(10), function (request, response) {
    console.log('do request');
    requestLib.get(request.query.page, {}, (err, res, body) => {
        if (err) {
            console.log(err);
        }
        if (res.statusCode === 200) {
            response.send(body)
        }
    });
});


