var extend = require('extend');

function Pacman(props) {
    if (!(this instanceof Pacman)) {
        return new Pacman(props);
    }
    this.mouthOpening = false;
    this.mouthAngle = Pacman.prototype.maxMouthAngle; //in degrees
    extend(this, props);
}

Pacman.prototype.chompSpeed = 3.5; //chomps per second (one chomp == open + close)
Pacman.prototype.maxMouthAngle = 60; //in degrees
Pacman.prototype.radius = 5;
Pacman.prototype.fillColor = 'yellow';
Pacman.prototype.position = { x: 0, y: 0 };
Pacman.prototype.velocity = { x: 0, y: 0 }; //px per second

Pacman.prototype.update = function (tick) {
    var angleVelocity = 2 * this.maxMouthAngle * this.chompSpeed;
    var deltaAngle = angleVelocity * tick.deltaMillis / 1000;
    if (!this.mouthOpening) {
        deltaAngle = -deltaAngle;
    }
    this.mouthAngle = this.mouthAngle + deltaAngle;
    if (this.mouthAngle > this.maxMouthAngle) {
        this.mouthOpening = false;
    } else if (this.mouthAngle <= 0) {
        this.mouthOpening = true;
    }
    this.position.x += tick.deltaMillis / 1000 * this.velocity.x;
    this.position.y += tick.deltaMillis / 1000 * this.velocity.y;
};

Pacman.prototype.render = function drawPacman(ctx, tick) {
    var mouthAngle = this.mouthAngle * 2 * Math.PI / 360,
        isMouthClosed = mouthAngle <= 0,
        startAngle = isMouthClosed ? 0 : mouthAngle,
        endAngle = isMouthClosed ? 2 * Math.PI : -mouthAngle,
        isFacingLeft = (this.velocity.x < 0),
        xScale = isFacingLeft ? -1 : 1;

    ctx.save();

    ctx.fillStyle = this.fillColor;
    ctx.translate(this.position.x, this.position.y);
    ctx.scale(xScale, 1);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this.radius, startAngle, endAngle, false);
    ctx.lineTo(0, 0);

    ctx.closePath();
    ctx.fill();
    ctx.restore();
};

module.exports = Pacman;

















