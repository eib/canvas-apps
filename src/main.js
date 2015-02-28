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
            velocity: { x: 0, y: 0 },
        });

    fx.addObject(new Dot(extend({ position: { x: 380, y: 200 } }, dotDefaults)));
    fx.addObject(new Dot(extend({ position: { x: 460, y: 200 } }, dotDefaults)));
    fx.addObject(new Dot(extend({ position: { x: 540, y: 200 } }, dotDefaults)));

    fx.addObject(pacman);

    var keysPressed = {};
    var speed = 300;

    PHYSX.mixin(pacman, function (tick) {
        var x = 0;
        var y = 0;
        if (keysPressed[37]) { //left
            x = x - speed;
        }
        if (keysPressed[38]) { //up
            y = y - speed;
        }
        if (keysPressed[39]) { //right
            x = x + speed;
        }
        if (keysPressed[40]) { //down
            y = y + speed;
        }
        pacman.velocity = { x: x, y: y };
    });

    //left: 37
    //up: 38
    //right: 39
    //down: 40

    fx.start();
    document.onkeydown = function (evt) {
        var event = window.event ? window.event : evt;
        console.log("Down: " + event.keyCode);
        keysPressed[event.keyCode] = true;
    };

    document.onkeyup = function (evt) {
        var event = window.event ? window.event : evt;
        console.log("Up: " + event.keyCode);
        keysPressed[event.keyCode] = false;
    };

    canvas.addEventListener('click', function () {
        fx.toggle();
    }, false);
};
