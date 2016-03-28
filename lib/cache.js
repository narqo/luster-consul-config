var fs = require('fs'),
    path = require('path'),
    logger = require('./logger');

function noop() {
    var cb;
    if (arguments.length === 1) {
        cb = typeof arguments[0] === 'function' ? arguments[0] : function() {};
    } else {
        cb = arguments[arguments.length - 1];
    }
    cb();
}

function doJSON(err, data, fn, cb) {
    if (err) return cb(err);

    try {
        cb(null, JSON[fn](data));
    } catch (jsonErr) {
        cb(jsonErr);
    }
}

module.exports = function cacher(file) {
    if (!file) {
        return {
            read: noop,
            write: noop,
        };
    }

    const cacheFile = path.resolve(file);

    function read(cb) {
        logger.debug('cache read: file=%s', cacheFile);

        if (!cb) return;

        fs.readFile(cacheFile, function(err, data) {
            doJSON(err, data, 'parse', cb);
        });
    }

    function write(data, cb) {
        logger.debug('cache write: file=%s data=%j', cacheFile, data);

        if (!cb) {
            cb = noop;
        }

        doJSON(null, data, 'stringify', function(err, data) {
            if (err) {
                cb(err);
            } else {
                fs.writeFile(cacheFile, data, cb);
            }
        });
    }

    return {
        read: read,
        write: write,
    };
};
