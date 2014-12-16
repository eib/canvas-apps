function Dot(radius, colorFn) {
    this.radius = radius;
    this.getFillColor = colorFn;
}

Dot.prototype.position = { x: 0, y: 0 };

Dot.prototype.update = function (tick) {
    this.fillColor = this.getFillColor(tick);
};

Dot.prototype.render = function (ctx, tick) {
    ctx.fillStyle = this.fillColor;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
};

module.exports = Dot;