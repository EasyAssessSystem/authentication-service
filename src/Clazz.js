var Class = {
    create: function () {
        return function () {
            this.initialize.apply(this, arguments);
        }
    }
}

Class.extend = function (destination, source) {
    for (property in source) {
        if (property.toString().indexOf("super_") != -1) continue;
        if (destination[property] != null) {
            destination["super_" + property] = source[property];
            continue;
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
}

module.exports = Class;