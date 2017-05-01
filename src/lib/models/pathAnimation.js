
function PathAnimation(renderable, path) {
    if (!(this instanceof PathAnimation)) {
        return new PathAnimation(renderable, path);
    }
    this.renderable = renderable;
    this.path = path;
    this.elapsedMillis = 0;
    this.hasStarted = false;
    switch (path.pathOrder) {
        case 2:
            this.calculatePosition = this.calculatePositionCubic;
            break;
        case 1:
            this.calculatePosition = this.calculatePositionQuadratic;
            break;
        default:
            this.calculatePosition = this.calculatePositionLinear;
    }
    this.onComplete = function () {}; //TODO: .on('complete', ...);
}

PathAnimation.prototype.animationDuration = 1000; //ms

PathAnimation.prototype.update = function (tick) {
    if (this.hasStarted) {
        this.elapsedMillis += tick.deltaMillis;
    }
    this.hasStarted = true;
    var percentElapsed = this.calculatePercentElapsed();

    this.renderable.position = this.calculatePosition(percentElapsed);
    var isComplete = this.elapsedMillis >= this.animationDuration;
    if (isComplete && this.onComplete) {
        this.onComplete();
    }
    return !isComplete;
};

PathAnimation.prototype.calculatePercentElapsed = function () {
    return Math.min(1, Math.max(0, this.elapsedMillis / this.animationDuration));
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
        p2x = this.path.controlPoints[0].x,
        p2y = this.path.controlPoints[0].y,
        p3x = this.path.end.x,
        p3y = this.path.end.y,
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
        p2x = this.path.controlPoints[0].x,
        p2y = this.path.controlPoints[0].y,
        p3x = this.path.controlPoints[1].x,
        p3y = this.path.controlPoints[1].y,
        p4x = this.path.end.x,
        p4y = this.path.end.y,
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
