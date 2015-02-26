var FX = require('FX'),
    PHYSX = require('PHYSX'),
    extend = require('extend'),
    Dot = require('./lib/models/Dot'),
    Pacman = require('./lib/models/Pacman'),
    canvas = document.getElementById('canvas'),
    colorToString = require('./lib/util/colorToString');

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

function dotFactory() {
    var sineFreq = rand(300, 1000),
        sineMagnitude = rand(3, 10),
        velocity = { x: rand(-0.1, 0.1), y: rand(-0.1, -1) },
        acceleration = { x: 0, y: 0.0005 },
        dot = new Dot({
            radius: rand(1, 2),
            position: { x: canvas.width / 2, y: canvas.height - rand(20, 40) },
            hsl: {
                hue: rand(20, 30),
                saturation: 85,
                lightness: 65,
            },
            hueFallOff: 20,
            lightnessFallOff: 40,
        }),
        inBounds = { left: 0, right: canvas.width, top: canvas.height, bottom: 0 };

    PHYSX.addAcceleration(dot, acceleration, velocity);
    PHYSX.mixin(dot, function (tick) {
        var lastSine = dot.lastSine || 0,
            sine = Math.sin(tick.totalMillis / sineFreq) * sineMagnitude;
        dot.position.x += sine - lastSine;
        dot.lastSine = sine;
    });
    PHYSX.addBoundsChecking(dot, inBounds, { width: dot.radius * 2, height: dot.radius * 2 });

    PHYSX.mixin(dot, function (tick) {
        dot.hsl.hue = (dot.hsl.hue - tick.deltaMillis / 1000 * dot.hueFallOff) % 360;
        dot.hsl.lightness = Math.max(0, dot.hsl.lightness - tick.deltaMillis / 1000 * dot.lightnessFallOff);
        dot.fillColor = colorToString(dot.hsl);
    });
    PHYSX.mixinTerminator(dot, function (dot, tick) {
        return dot.hsl.lightness < 1;
    });
    return dot;
}

window.addEventListener('resize', sizeCanvasToDocument, false);

sizeCanvasToDocument();

window.onload = function () {
    var ctx = canvas.getContext('2d'),
        fx = FX(ctx),
        dotDefaults = {
            fillColor: 'white',
            radius: 10,
        },
        pacman = new Pacman({
            radius: 30,
            position: { x: 300, y: 200 },
        });

    fx.addObject(new Dot(extend({ position: { x: 380, y: 200 } }, dotDefaults)));
    fx.addObject(new Dot(extend({ position: { x: 460, y: 200 } }, dotDefaults)));
    fx.addObject(new Dot(extend({ position: { x: 540, y: 200 } }, dotDefaults)));

    fx.addObject(pacman);

//    PHYSX.mixin(pacman, function (tick) {
//
//    });

    fx.start();
    canvas.addEventListener('click', function () {
        fx.toggle();
    }, false);
};
