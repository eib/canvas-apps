var extend = require('extend');

function Town(props) {
    if (!(this instanceof Town)) {
        return new Town(props);
    }
    extend(this, props);
    this.pieces = [];
}

Town.prototype.name = 'Unassigned';
Town.prototype.index = -1;
Town.prototype.magic = false;

Town.prototype.radius = 5;
Town.prototype.fillColor = 'gray';
Town.prototype.position = { x: 0, y: 0 };
Town.prototype.font = '24px serif';
Town.prototype.fontColor = 'gray';
Town.prototype.selectionRadiusMultipler = 1.3;
Town.prototype.magicSelectionRadiusMultipler = 1.75;

Town.prototype.getSelectionRadius = function () {
    var multiplier = this.magic ? this.magicSelectionRadiusMultipler : this.selectionRadiusMultipler;
    return this.radius * multiplier;
};

Town.prototype.render = function (ctx, tick) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.fillStyle = this.fillColor;
    if (this.magic) {
        ctx.rotate(45 * Math.PI / 180);
        ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.clearRect(-this.radius/2, -this.radius/2, this.radius, this.radius);
    } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.restore();

    ctx.font = this.font;
    ctx.fillStyle = this.fontColor;
    ctx.fillText(this.name, this.position.x + this.radius, this.position.y);
};

Town.prototype.layoutPieces = function () {
    var angle = 0,
        deltaAngle = Math.PI * 2 / this.pieces.length,
        radius = this.radius,
        position = this.position;
    this.pieces.forEach(function (piece, ii) {
        var offsetX = Math.cos(angle) * radius,
            offsetY = Math.sin(angle) * radius;
        piece.position = {
            x: position.x + offsetX,
            y: position.y + offsetY,
        };
        angle += deltaAngle;
    });
};

Town.prototype.addPiece = function (piece) {
    this.pieces.push(piece);
    this.layoutPieces();
};

Town.prototype.removePiece = function (piece) {
    this.pieces.splice(this.pieces.indexOf(piece), 1);
    this.layoutPieces();
};

module.exports = Town;