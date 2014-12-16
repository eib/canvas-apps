module.exports = function (obj, updater) {
    var oldUpdater = obj.update,
        composite;
    if (typeof obj.update === 'function') {
        composite = function () {
            oldUpdater.apply(this, arguments);
            updater.apply(this, arguments);
        };
    } else {
        composite = updater;
    }
    obj.update = composite;
};