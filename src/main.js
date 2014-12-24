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
    var sineFreq = rand(300, 1000),
        sineMagnitude = rand(3, 10),
        velocity = { x: rand(-0.05, 0.05), y: rand(-0.03, -0.6) },
        dot = new Dot({
            radius: rand(1, 2),
            position: { x: canvas.width / 2, y: canvas.height - rand(20, 40) },
            hsl: {
                hue: rand(20, 30),
                saturation: 85,
                lightness: 65,
            }
        }),
        inBounds = { left: 0, right: canvas.width, top: canvas.height, bottom: 0 };

    PHYSX.addVelocity(dot, velocity);
    PHYSX.addBoundsChecking(dot, inBounds, { width: dot.radius * 2, height: dot.radius * 2 });
    PHYSX.mixin(dot, function (tick) {
        dot.hsl.hue = (dot.hsl.hue - tick.deltaMillis / 1000 * 20) % 360;
    });
    PHYSX.mixin(dot, function (tick) {
        dot.hsl.lightness = Math.max(0, dot.hsl.lightness - tick.deltaMillis / 1000 * 50);
    });
    PHYSX.mixinTerminator(dot, function (dot, tick) {
        return dot.hsl.lightness < 1;
    });
    PHYSX.addHSL(dot, 'hsl', 'fillColor');
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
        fx = FX(ctx),
        dotsPerFrame = 5;

    fx.onTick(function (tick) {
        if (tick.frames) {
            for (var ii = 0; ii < dotsPerFrame; ii++) {
                fx.addObject(dotFactory());
            }
        }
    });

    fx.start();
    canvas.addEventListener('click', function () {
        fx.toggle();
    }, false);
};
