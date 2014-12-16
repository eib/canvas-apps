var mixinUpdater = require('./mixinUpdater');

module.exports = function mixinVelocity(obj, velocity, startingPosition) {
    var velocityUpdater = function (tick) {
        var deltaX = this.velocity.x * tick.deltaMillis,
            deltaY = this.velocity.y * tick.deltaMillis,
            oldPosition = obj.position;
        obj.position = { x: oldPosition.x + deltaX, y: oldPosition.y + deltaY };
    };
    obj.position = obj.position || startingPosition || { x: 0, y: 0 };
    obj.velocity = obj.velocity || velocity || { x: 0, y: 0 };
    mixinUpdater(obj, velocityUpdater);
};
