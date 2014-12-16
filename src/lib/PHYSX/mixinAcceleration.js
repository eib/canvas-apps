var mixinUpdater = require('./mixinUpdater'),
    mixinVelocity = require('./mixinVelocity');

module.exports = function mixinAcceleration(obj, acceleration, startingVelocity, startingPosition) {
    var accelerationUpdater = function (tick) {
        var velocityDeltaX = this.acceleration.x * tick.deltaMillis,
            velocityDeltaY = this.acceleration.y * tick.deltaMillis,
            oldVelocity = this.velocity;
        this.velocity = { x: oldVelocity.x + velocityDeltaX, y: oldVelocity.y + velocityDeltaY };
    };
    obj.acceleration = obj.acceleration || acceleration || { x: 0, y: 0 };
    mixinUpdater(obj, accelerationUpdater);
    mixinVelocity(obj, startingVelocity, startingPosition);
};