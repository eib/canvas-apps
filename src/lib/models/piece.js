var extend = require('extend');

function Piece(props) {
    if (!(this instanceof Piece)) {
        return new Piece(props);
    }
    extend(this, props);
}

Piece.prototype.position = { x: 0, y: 0 };
Piece.prototype.fillColor = 'red';
Piece.prototype.radius = 5; //maybe an image instead? (or some kind of "shape" geometry?)

Piece.prototype.render = function (ctx, tick) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.fillStyle = this.fillColor;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
};

Piece.prototype.getSelectionRadius = function () {
    return this.radius * 2.0;
};

module.exports = Piece;
