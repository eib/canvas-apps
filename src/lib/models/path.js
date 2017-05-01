function Path(start, end, controlPoints) {
    if (!(this instanceof Path)) {
        return new Path(start, end, controlPoints);
    }
    this.start = start;
    this.end = end;
    this.controlPoints = controlPoints;
    this.flattenedControlPoints = this.flattenControlPoints();
    this.pathOrder = this.controlPoints.length;
    this.strokeMethod = this.getStrokeMethod(this.pathOrder);
}

Path.prototype.flattenControlPoints = function () {
    var array = [];
    for (var ii = 0; ii < this.controlPoints.length; ii++) {
        array.push(this.controlPoints[ii].x);
        array.push(this.controlPoints[ii].y);
    }
    array.push(this.end.x);
    array.push(this.end.y);
    return array;
};

Path.prototype.flip = function () {
    var flipped = this.controlPoints.slice();
    flipped.reverse();
    return new Path(this.end, this.start, flipped);
};

Path.prototype.getStrokeMethod = function (pathOrder) {
    var methods = {
        0: CanvasRenderingContext2D.prototype.lineTo,
        1: CanvasRenderingContext2D.prototype.quadraticCurveTo,
        2: CanvasRenderingContext2D.prototype.bezierCurveTo,
    };
    return methods[pathOrder];
};

module.exports = Path;
