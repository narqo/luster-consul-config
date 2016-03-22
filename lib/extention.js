var ConsulClient = require('./consul'),
    observable = require('./observable');

const RPC_GOT_CONFIG = 'extension_consul_got_config';
const DEFAULT_TIMEOUT = 2000;

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
    console.log('setup master');

    var client = new ConsulClient({
            namespace: this._config.get('namespace'),
            connection: this._config.get('connection'),
        }),
        configData = null,
        timeout;

    client.getData(function(err, data) {
        clearTimeout(timeout);
        configData = data;
        done();
    });

    timeout = setTimeout(function() {
        console.error('master setup timeout');
        done();
    }, this._config.get('timeout', DEFAULT_TIMEOUT));

    this._proc.on('worker initialized', function(worker) {
        if (configData !== null) {
            setProcConfig(worker, configData);
        }
    });
};

ConsulConfig.prototype.setupWorker = function() {
    console.log('setup worker');

    var consulConfig = observable(null);

    this._proc.registerRemoteCommand(RPC_GOT_CONFIG, function(proc, data) {
        consulConfig.set(data);
    });

    this._proc.consulConfig = consulConfig;
};

module.exports = ConsulConfig;
