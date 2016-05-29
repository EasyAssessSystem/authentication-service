var Class = require('./Clazz');
var FileStream= require('fs');
var Http = require('http');

var RemoteObserverProxy = Class.create();

RemoteObserverProxy.prototype = {
    initialize: function () {

    },

    load: function(callback) {
        FileStream.readFile('data/observers.json','utf-8',(function(err, observers){
            try {
                if(err){
                    console.log(err);
                }else{
                    this._observers = JSON.parse(observers);
                    if (callback) {
                        callback(this._observers);
                    }

                }
            } catch (e) {
                console.log(e.message);
            }
        }).bind(this));
    },

    getObservers: function () {
        return this._observers;
    },

    register: function (observer, callback) {
        if (!this._observers[observer.name]) {
            this._observers[observer.name] = observer;
            FileStream.writeFile("data/observers.json", JSON.stringify(this._observers, null, 2), {encoding: 'utf8'}, (function() {
                this.load(callback);
            }).bind(this));
        } else {
            callback(this._observers);
        }
    },

    notifyAllObserver: function() {
        for (var key in this.getObservers()) {
            var observer = this.getObservers()[key];
            this.notify(observer);
        }
    },

    notify: function(observer) {
        var options = {
            hostname: observer.host,
            port: observer.port,
            path: observer.updatePath,
            method: 'GET'
        };

        var req = Http.request(options, (function (res) {
            console.log('Notified host http://' + this.host + ':' + this.port + this.updatePath);
            // res.on('data', function (chunk) {
            //     console.log('BODY: ' + chunk);
            // });
        }).bind(observer));

        req.end();
    }
};

module.exports = RemoteObserverProxy;