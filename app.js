const AnyProxy = require('anyproxy');
const Interceptor = require('./interceptor.js');

const interceptor = new Interceptor({lat: 0, lon: 0, alt: 0});

const options = {
    port: 8001,
    rule: interceptor,
    webInterface: {
        enable: true,
        webPort: 8002
    },
    wsIntercept: true
};

const proxyServer = new AnyProxy.ProxyServer(options);

proxyServer.on('ready', () => { console.log('Proxy Server Ready') });
proxyServer.on('error', (e) => { console.error('Proxy Server Error', e) });
proxyServer.start();



//exit cause ctrl+c
process.on('SIGINT', () => {
    try {
        proxyServer && proxyServer.close();
    } catch (e) {
        console.error(e);
    }
    process.exit();
});