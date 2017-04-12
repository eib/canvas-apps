
function PathAnimation(object, path) {
    if (!(this instanceof PathAnimation)) {
        return new PathAnimation(object, path);
    }
    this.currentPosition = path.start;
    this.elapsedMillis = 0;
    this.hasStarted = false;
    this.calculatePosition = this.calculatePositionLinear; //TODO: based on # control points?
}

PathAnimation.prototype.animationDuration = 4000; //ms

PathAnimation.prototype.render = function (tick) {
    if (this.hasStarted) {
        this.elapsedMillis += tick.deltaMillis;
    }
    this.hasStarted = true;
    var percentElapsed = this.elapsedMillis / this.animationDuration;
};

PathAnimation.prototype.calculatePositionLinear = function () {

};
PathAnimation.prototype.calculatePositionQuadratic = function () {

};
PathAnimation.prototype.calculatePositionCubic = function () {

};

module.exports = PathAnimation;
