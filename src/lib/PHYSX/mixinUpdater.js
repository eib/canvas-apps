module.exports = function (obj, updater) {
    var updaters = obj.updaters;
    if (!updaters) {
        updaters = [];
        Object.defineProperty(obj, 'updaters', {
            value: updaters,
            enumerable: false,
        });
        obj.update = function () {
            for (var ii = 0; ii < updaters.length; ii++) {
                updaters[ii].apply(obj, arguments);
            }
        };
    }
    updaters.push(updater);

//    var oldUpdater = obj.update,
//        composite;
//    if (typeof obj.update === 'function') {
//        composite = function () {
//            oldUpdater.apply(this, arguments);
//            updater.apply(this, arguments);
//        };
//    } else {
//        composite = updater;
//    }
//    obj.update = composite;
};