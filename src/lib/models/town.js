var extend = require('extend'),
    Dot = require('./Dot');

function Town(props) {
    if (!(this instanceof Town)) {
        return new Town(props);
    }
    extend(this, props);
    if (this.magic) {

    }

}
//TODO: extend Dot (but I don't remember how the syntax goes offhand)

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

Town.prototype.render = function drawADot(ctx, tick) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.fillStyle = this.fillColor;
    if (this.magic) {
        ctx.rotate(45 * Math.PI / 180);
        ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.clearRect(-this.radius/2, -this.radius/2, this.radius, this.radius);
        //ctx.clearRect(45, 45, 60, 60);
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

module.exports = Town;