var FX = require('FX'),
    PHYSX = require('PHYSX'),
    extend = require('extend'),
    Dot = require('./lib/models/Dot'),
    Pacman = require('./lib/models/Pacman'),
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
