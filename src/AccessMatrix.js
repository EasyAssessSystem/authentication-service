var Class = require('./Clazz');
var FileStream= require('fs');

var AccessMatrix = Class.create();

AccessMatrix.prototype = {
    initialize: function () {
        FileStream.readFile('data/api.json','utf-8',(function(err, apiSet){
            if(err){
                console.log(err);
            }else{
                this._apiSet = JSON.parse(apiSet);
            }
        }).bind(this));

        FileStream.exists('data/permission.json', (function(exists) {
            if (exists) {
                FileStream.readFile('data/permission.json','utf-8',(function(err, permission){
                    this._permission = JSON.parse(permission);
                }).bind(this));
            } else {
                FileStream.writeFile("data/permission.json", "{\"roles\": []}", {encoding: 'utf8'}, (function() {
                    FileStream.readFile('data/permission.json','utf-8',(function(err, permission){
                        this._permission = JSON.parse(permission);
                    }).bind(this));
                }).bind(this));
            }
        }).bind(this));
    },

    getAccessPermissions: function() {
        return this._permission;
    },

    updatePermission: function (permission, callback) {
        var isExisting = false;
        for (var i=0;i<this._permission.roles.length;i++) {
            var role = this._permission.roles[i];
            if (role.role == permission.role) {
                this._permission.roles[i] = permission;
                isExisting = true;
                break;
            }
        }

        if (!isExisting) {
            this._permission.roles.push(permission);
        }

        FileStream.writeFile("data/permission.json", JSON.stringify(this._permission, null, 2), {encoding: 'utf8'}, function() {
            try {
                callback();
            } catch (e) {
                console.log(e.message);
            }
        });
    },
    
    getPermission: function (roleId) {
        var permission = {
            "role": roleId,
            "permissions": []
        };

        for (var i=0;i<this._apiSet.restAPI.length;i++) {
            var api = this._apiSet.restAPI[i];
            var access = Class.extend({}, api);
            access.GET = false;
            access.PUT = false;
            access.POST = false;
            access.DELETE = false;
            permission.permissions.push(access);
        }

        for (var i=0;i<this._permission.roles.length;i++) {
            var role = this._permission.roles[i];
            if (role.role == roleId) {
                var perms = this._permission.roles[i].permissions;
                for (var j=0;j<perms.length;j++) {
                    permission.permissions[j].GET = perms[j].GET;
                    permission.permissions[j].PUT = perms[j].PUT;
                    permission.permissions[j].POST = perms[j].POST;
                    permission.permissions[j].DELETE = perms[j].DELETE;
                }
                break;
            }
        }


        return permission;
    }
};

module.exports = AccessMatrix;