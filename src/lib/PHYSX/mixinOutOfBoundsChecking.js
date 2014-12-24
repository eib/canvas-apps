var mixinTerminator = require('./mixinTerminator'),
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
    var boundsChecker = function () {
        return !intersectsBounds(obj, obj.inBounds);
    };
    obj.inBounds = obj.inBounds || inBounds;
    mixinBoundingBox(obj, objDimensions, objBoundsOffset);
    mixinTerminator(obj, boundsChecker);
};