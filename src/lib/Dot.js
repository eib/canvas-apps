var extend = require('./util/extend');

function Dot(props) {
    if (!(this instanceof Dot)) {
        return new Dot(props);
    }
    extend(this, props);
}

Dot.prototype.radius = 5;
Dot.prototype.fillColor = 'red';
Dot.prototype.position = { x: 0, y: 0 };

Dot.prototype.render = function (ctx, tick) {
    ctx.fillStyle = this.fillColor;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
};

module.exports = Dot;