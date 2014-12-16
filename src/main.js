var FX = require('./lib/FX'),
    PHYSX = require('./lib/PHYSX'),
    Dot = require('./lib/Dot'),
    canvas = document.getElementById('canvas');

function sizeCanvasToDocument() {
    if (canvas) {
        canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth, document.width || 0);
        canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight, document.height || 0);
        FX.prototype.canvasSize = { width: canvas.width, height: canvas.height };
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function dotFactory() {
    var dot = new Dot(25,
        function (tick) {
            var hue = (tick.totalMillis / 1000 * 60) % 360;
            return 'hsl(' + hue + ', 75%, 50%)';
        });

    PHYSX.addVelocity(dot);
    PHYSX.addBoundsChecking(dot, { left: 0, right: canvas.width, top: canvas.height, bottom: 0 }, { width: dot.radius * 2, height: dot.radius * 2 });
    PHYSX.mixin(dot, function (tick) {
        var lastSine = this.lastSine || 0,
            sine = Math.sin(tick.totalMillis / 100) * 5;
        dot.position.x += sine - lastSine;
        this.lastSine = sine;
    });
    return dot;
}

window.addEventListener('resize', sizeCanvasToDocument, false);

sizeCanvasToDocument();

window.onload = function () {
    var ctx = canvas.getContext('2d'),
        fx = FX(ctx);

    Dot.prototype.position = { x: canvas.width / 2, y: canvas.height };
    Dot.prototype.velocity = { x: 0, y: -0.3 };

    fx.addObject(dotFactory());

    fx.start();
    canvas.addEventListener('click', function () {
        fx.toggle();
    }, false);
};
