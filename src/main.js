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

function dotFactory(position) {
    var dot = new Dot({
        position: position,
        fillColor: 'white',
        radius: 10,
    });
    return dot;
}

window.onload = function () {
    var ctx = canvas.getContext('2d'),
        fx = FX(ctx),
        pacman = new Pacman({
            radius: 30,
            position: { x: 300, y: 200 },
            velocity: { x: 0, y: 0 },
        });

    var dots = [];
    var numDots = 30;
    var keysPressed = {};
    var speed = 300;
    var ii;
    var dotDistance = 80;

    for (ii = 0; ii < numDots; ii = ii + 1) {
        var position = { x: ii * dotDistance + 50, y: 200 };
        var dot = dotFactory(position);
        dots.push(dot);
    }

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

    dots.forEach(function (dot) {
        PHYSX.mixinTerminator(dot, function (tick) {
            var dx = pacman.position.x - dot.position.x;
            var dy = pacman.position.y - dot.position.y;
            var distance = Math.sqrt((dx * dx) + (dy * dy));
            var isEaten = distance < pacman.radius - dot.radius;
            return isEaten;
        });
        fx.addObject(dot);
    });

    fx.addObject(pacman);

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
