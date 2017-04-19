
function PathAnimation(renderable, path) {
    if (!(this instanceof PathAnimation)) {
        return new PathAnimation(renderable, path);
    }
    this.renderable = renderable;
    this.path = path;
    this.elapsedMillis = 0;
    this.hasStarted = false;
    this.calculatePosition = this.calculatePositionLinear; //TODO: based on # control points?
    this.onComplete = function () {}; //TODO: .on('complete', ...);
}

PathAnimation.prototype.animationDuration = 4000; //ms

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
    return this.path.start;
};
PathAnimation.prototype.calculatePositionCubic = function (percentElapsed) {
    return this.path.start;
};

module.exports = PathAnimation;
