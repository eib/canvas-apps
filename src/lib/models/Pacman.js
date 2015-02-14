var extend = require('../util/extend');

function Pacman(props) {
    if (!(this instanceof Pacman)) {
        return new Pacman(props);
    }
    this.mouthOpening = false;
    this.mouthAngle = Pacman.prototype.maxMouthAngle; //in degrees
    extend(this, props);
}

Pacman.prototype.chompSpeed = 2; //chomps per second? (one chomp == open + close)
Pacman.prototype.maxMouthAngle = 60; //in degrees
Pacman.prototype.radius = 5;
Pacman.prototype.fillColor = 'yellow';
Pacman.prototype.position = { x: 0, y: 0 };

Pacman.prototype.update = function (tick) {
    var angleVelocity = 2 * this.maxMouthAngle * this.chompSpeed;
    var deltaAngle = angleVelocity * tick.deltaMillis / 1000;
    if (!this.mouthOpening) {
        deltaAngle = -deltaAngle;
    }
    this.mouthAngle = this.mouthAngle + deltaAngle;
    if (this.mouthAngle > this.maxMouthAngle) {
        this.mouthOpening = false;
    } else if (this.mouthAngle < 0) {
        this.mouthOpening = true;
    }
};

Pacman.prototype.render = function (ctx, tick) {
    var overflowAngle = 10 * 2 * Math.PI / 360;
    var mouthAngle = this.mouthAngle * 2 * Math.PI / 360;
    ctx.fillStyle = this.fillColor;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, mouthAngle, Math.PI + mouthAngle + overflowAngle);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, -mouthAngle, Math.PI - mouthAngle - overflowAngle, true);
    ctx.fill();
};

module.exports = Pacman;