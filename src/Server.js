var Config = require('../conf/' + process.argv[2]);
var Http = require('http');
var Url = require('url')
var PostData = '';
var AccessMatrix = require('./AccessMatrix');
var RemoteObserverProxy = require('./RemoteObserverProxy');
var Authenication = new AccessMatrix();
var ObserverProxy = new RemoteObserverProxy();

process.on('uncaughtException', function (err) {
    console.log(err);
    console.log(err.stack);
});

ObserverProxy.load(startServer);

function allowed(remote) {
    if (!Config.secureMode) return true;

    for (var i=0;i<Config.allowed.length;i++) {
        if (remote == Config.allowed[i]) return true;
    }

    return false;
}

function startServer() {
    var Server = Http.createServer(function (request, response) {
        function getPermission(roleId) {
            var responseJSON = Authenication.getPermission(roleId);
            response.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8'});
            response.end(JSON.stringify(responseJSON));
        }

        function loadPermissions() {
            var responseJSON = Authenication.getAccessPermissions();
            response.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8'});
            response.end(JSON.stringify(responseJSON));
        }

        function savePermission(rolePermission) {
            Authenication.updatePermission(rolePermission, function(){
                ObserverProxy.notifyAllObserver();
                response.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8'});
                response.end(JSON.stringify(rolePermission));
            });
        }

        request.addListener("data", function (postDataChunk) {
            console.log('Receiving data...');
            PostData += postDataChunk;
        });

        request.addListener("end", function () {
            var remotePort = request.connection.remotePort;
            var remoteHost = request.connection.remoteAddress;
            if (allowed(request.connection.remoteAddress)) {
                try {
                    var pathname = Url.parse(request.url).pathname.toString();
                    var method = request.method;
                    console.log('Proceeding [' + method + '] ' + pathname + ' for host ' + remoteHost + ':' + remotePort + '...');

                    if (/^\/get\/\d/gi.test(pathname) && method == 'GET') {
                        var roleId = Number(pathname.replace('/get/',''));
                        getPermission(roleId);
                    } else if (pathname == "/save" && method == 'PUT') {
                        var rolePermission = JSON.parse(PostData);
                        savePermission(rolePermission);
                    } else if (pathname == "/register" && method == 'PUT') {
                        var observer = JSON.parse(PostData);
                        observer.host = remoteHost;
                        ObserverProxy.register(observer, loadPermissions)
                    } else {
                        response.writeHead(404, { 'Content-Type': 'text/plain;charset:utf-8'});
                        response.end();
                    }
                } catch (e) {
                    console.log(e.message);
                    console.log(e.stack);
                    response.writeHead(500, { 'Content-Type': 'text/plain;charset:utf-8'});
                    response.end();
                }
            } else {
                response.writeHead(401, { 'Content-Type': 'text/plain;charset:utf-8'});
                response.end();
            }
            PostData = '';
        });
    });

    Server.listen(1337, Config.host);

    console.log('Server running at http://' + Config.host + ':' + Config.port + '/');
}
