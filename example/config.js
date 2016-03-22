var _ = require('lodash');

const config = {
    application: {
        title: 'My Node.js Cloud App'
    }
};

exports.get = function(p, def) {
    return _.get(config, p, def);
};

exports.merge = function(src) {
    return _.merge(config, src);
};
