# luster-consul-config

An extension for [luster](https://www.npmjs.com/package/luster) that provides support for getting
configuration from [Consul](https://www.consul.io/) K/V storage.

## Usage

Install extension module to application:

~~~
$ npm install --save luster-consul-config
~~~

Add `luster-consul-config` to the list of your luster extensions:

~~~
// luster.conf.json

{
  "app": "worker.js",
  ···
  "extensions": {
    "luster-consul-config": {
      "namespace": "settings/example/",
      "connection": {
        "host": "127.0.0.1",
        "port": 8500
      }
    }
  }
}
~~~

In your `worker.js` use `luster.consulConfig(observer)` method to subscribe to configuration data:

~~~javascript
// worker.js

var luster = require('luster');

const config = {
  foo: 'bar',
};

if (typeof luster.consulConfig === 'function') {
  luster.consulConfig(newCfg => Object.assign(config, newCfg));
}
~~~

See `example/` for complete example.

## Configuration

- `namespace` - prefix of keys; this prefix will be stripped from config;
- `connection` - Consul agent connection details; see [node-consul](https://www.npmjs.com/package/consul).

## Contribution and Feedback

Contributing is more than welcome. Create an issue if you see any problem in the code or send a PR with
fixes if you'd like.

## License

MIT
