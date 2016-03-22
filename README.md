# luster-consul-config

## Usage

Add `luster-consul-config` to list of your luster extensions:

~~~
// luster.conf.json
{
  "app": "worker.js",
  ···
  "extensions": {
    "luster-consul-config": {
      "namespace": "settings/example/",
      "connection": {
        "host": "192.168.99.100",
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

- `namespace String`
- `connection Object`

## License

MIT
