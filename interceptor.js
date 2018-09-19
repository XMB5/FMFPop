const EventEmitter = require('events');

const locationRegex = /https:\/\/p51-fmf\.icloud\.com\/fmipservice\/fmf\/\d+\/[a-z0-9]+\/currentLocation/;

class Interceptor extends EventEmitter {

    constructor (opts) {
        super();
        Object.assign(this, opts);
    }

    // intercept before sending a request
    *beforeSendRequest(requestDetail) {
        if (locationRegex.test(requestDetail.url)) {
            let data = JSON.parse(requestDetail.requestData);
            data['latitude'] = this.lat;
            data['longitude'] = this.lon;
            data['alt'] = this.alt;
            return {
                requestData: JSON.stringify(data)
            };
        }
    }

    //whether or not to decrypt an https request
    *beforeDealHttpsRequest(requestDetail) {
        return requestDetail.host === 'p51-fmf.icloud.com:443';
    }

    // error happened when dealing requests
    *onError(requestDetail, error) {
        this.emit('error', requestDetail, error);
    }

    // error happened when connect to https server
    *onConnectError(requestDetail, error) {
        this.emit('error', requestDetail, error);
    }

}

module.exports = Interceptor;