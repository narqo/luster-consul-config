var fs = require('fs'),
    util = require('util'),
    ConsulClient = require('./consul'),
    cacher = require('./cache'),
    logger = require('./logger'),
    observable = require('./observable');

const RPC_GOT_CONFIG = 'extension_consul_got_config',
    DEFAULT_TIMEOUT = 2000;

function ConsulConfig() {
    this._proc = null;
    this._config = null;
}

ConsulConfig.prototype.configure = function(config, proc, done) {
    this._config = config;
    this._proc = proc;

    if (proc.isMaster) {
        this.setupMaster(done);
    } else {
        this.setupWorker();
        done();
    }
};

function setProcConfig(proc, config) {
    proc.remoteCall(RPC_GOT_CONFIG, config);
}

ConsulConfig.prototype.setupMaster = function(done) {
    logger.log('setup master');

    var client = new ConsulClient({
            namespace: this._config.get('namespace'),
            connection: this._config.get('connection'),
        }),
        cache = cacher(this._config.get('cacheFile')),
        configData = null,
        timeout;

    function onGotData(err, data) {
        if (err) {
            logger.error(err);
        }
        configData = data;
        done();
    }

    function onData(err, data) {
        if (timeout === true) return;
        clearTimeout(timeout);

        if (err) {
            logger.error(err);
            cache.read(onGotData);
        } else {
            cache.write(data, function(err) {
                if (err) {
                    logger.error(err);
                }
            });
            onGotData(err, data);
        }
    }

    client.getData(onData);

    timeout = setTimeout(function() {
        timeout = true;
        logger.error(new Error('setup master timeout'));
        cache.read(onGotData);
    }, this._config.get('timeout', DEFAULT_TIMEOUT));

    this._proc.on('worker initialized', function(worker) {
        if (configData !== null) {
            setProcConfig(worker, configData);
        }
    });
};

ConsulConfig.prototype.setupWorker = function() {
    logger.log('setup worker');

    var consulConfig = observable(null);

    this._proc.registerRemoteCommand(RPC_GOT_CONFIG, function(proc, data) {
        consulConfig.set(data);
    });

    this._proc.consulConfig = consulConfig;
};

module.exports = ConsulConfig;
