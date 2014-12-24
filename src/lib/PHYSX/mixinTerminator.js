var mixinUpdater = require('./mixinUpdater');

module.exports = function mixinTerminator(obj, terminationFilter) {
    var terminationUpdater = function (tick) {
        if (terminationFilter(obj, tick)) {
            obj.isTerminated = true;
        }
    };
    mixinUpdater(obj, terminationUpdater);
};