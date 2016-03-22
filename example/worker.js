var assert = require('assert'),
    luster = require('luster'),
    config = require('./config');

if (typeof luster.consulConfig === 'function') {
    luster.consulConfig(function(cfgData) {
        console.log('got new data: %j', cfgData);
        config.merge(cfgData);
    });
}

const port = process.env.port || process.env.PORT;
assert.ok(port, '"port" environment variable was not set or empty');

var app = require('./app');

app(port, function(err) {
    if (err) {
        return console.error('server start fail', { error: err });
    }
    console.log('server started', { port: port });
});
