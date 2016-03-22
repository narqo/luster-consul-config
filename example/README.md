# Example

Docker is a nice way to try everything locally.

~~~
$ docker run --rm --name test_consul -p 8400:8400 -p 8500:8500 -p 8600:53/udp -h node1 progrium/consul -server -bootstrap -ui-dir /ui
~~~

See [docs for `progrium/consul`](https://hub.docker.com/r/progrium/consul/) for details.

After you have local [Consul](https://consul.io) agent running, start Node.js server by running:

~~~
$ npm install
$ npm start
~~~

The command above will install required dependencies and start local Node.js server on the port `:10080`.
