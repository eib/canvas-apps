var mixinUpdater = require('./mixinUpdater'),
    mixinBoundingBox = require('./mixinBoundingBox');

function intersectsBounds(obj, inBounds) {
    var boundingBox = obj.bounds,
        left = boundingBox.x,
        right = boundingBox.x + boundingBox.width,
        bottom = boundingBox.y,
        top = boundingBox.y + boundingBox.height;
    return right >= inBounds.left && left <= inBounds.right &&
        bottom <= inBounds.top && top >= inBounds.bottom;
}

module.exports = function mixinOutOfBoundsChecking(obj, inBounds, objDimensions, objBoundsOffset) {
    var boundsChecker = function (tick) {
        if (!intersectsBounds(obj, inBounds)) {
            obj.isTerminated = true;
        }
    };
    obj.inBounds = obj.inBounds || inBounds;
    mixinBoundingBox(obj, objDimensions, objBoundsOffset);
    mixinUpdater(obj, boundsChecker);
};