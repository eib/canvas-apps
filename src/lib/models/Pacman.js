var extend = require('../util/extend');

function Pacman(props) {
    if (!(this instanceof Pacman)) {
        return new Pacman(props);
    }
    extend(this, props);
}

Pacman.prototype.mouthAngle = 30;
Pacman.prototype.radius = 5;
Pacman.prototype.fillColor = 'yellow';
Pacman.prototype.position = { x: 0, y: 0 };

Pacman.prototype.render = function (ctx, tick) {
    var mouthAngle = this.mouthAngle * 2 * Math.PI / 360;
    ctx.fillStyle = this.fillColor;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, mouthAngle, Math.PI + mouthAngle);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, -mouthAngle, Math.PI - mouthAngle, true);
    ctx.fill();
};

module.exports = Pacman;