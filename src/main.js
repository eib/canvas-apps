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

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function dotFactory() {
    var radius = rand(2, 7),
        hueOffset = rand(0, 80),
        sineFreq = rand(300, 1000),
        sineMagnitude = rand(3, 8),
        position = { x: rand(3, canvas.width), y: canvas.height },
        velocity = { x: rand(-0.05, 0.05), y: rand(-0.03, -0.4) },
        dot = new Dot(radius,
        function (tick) {
            var hue = (tick.totalMillis / 1000 * 60 + hueOffset) % 360;
            return 'hsl(' + hue + ', 75%, 50%)';
        }),
        inBounds = { left: 0, right: canvas.width, top: canvas.height, bottom: 0 };

    dot.position = position;

    PHYSX.addVelocity(dot, velocity);
    PHYSX.addBoundsChecking(dot, inBounds, { width: dot.radius * 2, height: dot.radius * 2 });
    PHYSX.mixin(dot, function (tick) {
        var lastSine = this.lastSine || 0,
            sine = Math.sin(tick.totalMillis / sineFreq) * sineMagnitude;
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

    for (var ii = 0; ii < 400; ii++) {
        fx.addObject(dotFactory());
    }

    fx.start();
    canvas.addEventListener('click', function () {
        fx.toggle();
    }, false);
};
