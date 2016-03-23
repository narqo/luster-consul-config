var consul = require('consul'),
    set = require('lodash').set;

function Consul(options) {
    this._namespace = options.namespace;
    this._client = consul(options.connection);
}

Consul.prototype.getData = function(fn) {
    var namespace = this._namespace;
    this._client.kv.get({ key: namespace, recurse: true }, function(err, pairs) {
        if (err) {
            return fn(err);
        }
        if (!Array.isArray(pairs)) {
            return fn(new Error('no data'));
        }
        var data = pairs.reduce(function(data, key) {
            var keyTail;
            if (key.Value !== null) {
                keyTail = key.Key.replace(namespace, '');
                set(data, keyTail.split('/'), key.Value);
            }
            return data;
        }, {});
        return fn(null, data);
    });
};

module.exports = Consul;
