
function PathAnimation(renderable, path) {
    if (!(this instanceof PathAnimation)) {
        return new PathAnimation(renderable, path);
    }
    this.renderable = renderable;
    this.path = path;
    this.elapsedMillis = 0;
    this.hasStarted = false;
    switch (path.controlPoints.length) {
        case 6:
            this.calculatePosition = this.calculatePositionCubic;
            break;
        case 4:
            this.calculatePosition = this.calculatePositionQuadratic;
            break;
        default:
            this.calculatePosition = this.calculatePositionLinear;
    }
    this.onComplete = function () {}; //TODO: .on('complete', ...);
}

PathAnimation.prototype.animationDuration = 2500; //ms

PathAnimation.prototype.update = function (tick) {
    if (this.hasStarted) {
        this.elapsedMillis += tick.deltaMillis;
    }
    this.hasStarted = true;
    var percentElapsed = Math.min(100, Math.max(0, this.elapsedMillis / this.animationDuration));

    this.renderable.position = this.calculatePosition(percentElapsed);
    var isComplete = this.elapsedMillis >= this.animationDuration;
    if (isComplete && this.onComplete) {
        this.onComplete();
    }
    return !isComplete;
};

PathAnimation.prototype.calculatePositionLinear = function (percentElapsed) {
    var start = this.path.start,
        end = this.path.end,
        dX = end.x - start.x,
        dY = end.y - start.y;
    return {
        x: start.x + (dX * percentElapsed),
        y: start.y + (dY * percentElapsed),
    };
};
PathAnimation.prototype.calculatePositionQuadratic = function (percentElapsed) {
    var p1x = this.path.start.x,
        p1y = this.path.start.y,
        p2x = this.path.controlPoints[0],
        p2y = this.path.controlPoints[1],
        p3x = this.path.controlPoints[2],
        p3y = this.path.controlPoints[3],
        percentRemaining = 1 - percentElapsed;

    return {
        x: percentRemaining * percentRemaining * p1x +
            2 * percentRemaining * percentElapsed * p2x +
            percentElapsed * percentElapsed * p3x,
        y: percentRemaining * percentRemaining * p1y +
            2 * percentRemaining * percentElapsed * p2y +
            percentElapsed * percentElapsed * p3y,
    };
};
PathAnimation.prototype.calculatePositionCubic = function (percentElapsed) {
    var p1x = this.path.start.x,
        p1y = this.path.start.y,
        p2x = this.path.controlPoints[0],
        p2y = this.path.controlPoints[1],
        p3x = this.path.controlPoints[2],
        p3y = this.path.controlPoints[3],
        p4x = this.path.controlPoints[4],
        p4y = this.path.controlPoints[5],
        percentRemaining = 1 - percentElapsed;

    return {
        x: percentRemaining * percentRemaining * percentRemaining * p1x +
            3 * percentRemaining * percentRemaining * percentElapsed * p2x +
            3 * percentRemaining * percentElapsed * percentElapsed * p3x +
            percentElapsed * percentElapsed * percentElapsed * p4x,
        y: percentRemaining * percentRemaining * percentRemaining * p1y +
            3 * percentRemaining * percentRemaining * percentElapsed * p2y +
            3 * percentRemaining * percentElapsed * percentElapsed * p3y +
            percentElapsed * percentElapsed * percentElapsed * p4y,
    };
};

module.exports = PathAnimation;
