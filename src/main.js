var FX = require('./lib/FX'),
    PHYSX = require('./lib/PHYSX'),
    Dot = require('./lib/Dot'),
    canvas = document.getElementById('canvas'),
    hslToColor = require('./lib/util/hslToColor');

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
        dot.fillColor = hslToColor(dot.hsl);
    });
    PHYSX.mixinTerminator(dot, function (dot, tick) {
        return dot.hsl.lightness < 1;
    });
    return dot;
}

window.addEventListener('resize', sizeCanvasToDocument, false);

sizeCanvasToDocument();

var stats = {
    startTime: 0,
    currentTime: 0,
    reset: function () {
        this.maxDelta = 0;
        this.minDelta = 999999999;
        this.frames = 0;
        this.startTime = this.currentTime;
    },
    tick: function (tick) {
        this.maxDelta = Math.max(this.maxDelta, tick.deltaMillis);
        this.minDelta = Math.min(this.minDelta, tick.deltaMillis);
        this.frames++;
        this.currentTime = tick.totalMillis;
    },
    log: function () {
        var totalTime = this.currentTime - this.startTime;
        console.log('FPS: ', this.frames / totalTime * 1000 + '(start=' + this.startTime + ', end=' + this.currentTime + ', frames=' + this.frames + ')');
        this.reset();
    },
};

window.onload = function () {
    var ctx = canvas.getContext('2d'),
        fx = FX(ctx),
        dotsPerFrame = 30;

    fx.onTick(function (tick) {
        if (tick.frames) {
            for (var ii = 0; ii < dotsPerFrame; ii++) {
                fx.addObject(dotFactory());
            }
        }
    });

    fx.onTick(function (tick) {
        stats.tick(tick);
        if ((stats.frames % 50) === 0) {
            stats.log();
        }
    });

    stats.reset();
    fx.start();
    canvas.addEventListener('click', function () {
        stats.log();
        fx.toggle();
    }, false);
};
