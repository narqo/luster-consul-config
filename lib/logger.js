var util = require('util'),
    DEBUG = require('debug-flags')('yandex:nodules:luster:consul:cache');

const LOG_PREFIX = 'luster-consul-config:';

exports.log = function log() {
    var msg = util.format.apply(util, arguments);
    console.log(LOG_PREFIX + ' ' + msg);
};

exports.debug = function logDebug() {
    if (DEBUG) {
        exports.log.apply(null, arguments);
    }
};

exports.error = function logError(err) {
    console.error(LOG_PREFIX + ' ' + err.message);
};
