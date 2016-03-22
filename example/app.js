var http = require('http'),
    config = require('./config');

const server = http.createServer(function(req, res) {
    res.end('Welcome to "' + config.get('application.title') + '" application');
});

module.exports = function listen(port, fn) {
    server.listen(port, fn);
};
