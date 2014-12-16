var mixinUpdater = require('./mixinUpdater');

module.exports = function mixinBoundingBox(obj, dimensions, boundsOffset) {
    var boundsUpdater = function () {
        var position = this.position;
        this.bounds = {
            x: position.x - boundsOffset.x,
            y: position.y - boundsOffset.y,
            width: dimensions.width,
            height: dimensions.height
        };
    };
    boundsOffset = boundsOffset || { x: 0, y: 0 };
    mixinUpdater(obj, boundsUpdater);
};