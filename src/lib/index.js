var FX = require('FX'),
    PHYSX = require('PHYSX'),
    Dot = require('./models/Dot'),
    rand = require('./rand'),
    canvas = document.getElementById('canvas'),
    sizeCanvasToDocument = require('./sizeCanvasToDocument')(canvas);

window.addEventListener('resize', sizeCanvasToDocument, false);
sizeCanvasToDocument();

window.onload = function () {
    var ctx = canvas.getContext('2d'),
        fx = FX(ctx);

    fx.backgroundColor = 'white';

    var pieces = [];
    var numPieces = 15;

    //left: 37
    //up: 38
    //right: 39
    //down: 40
    var keysPressed = {};

    var speed = 300;
    var ii;
    var dotDistance = 80;

    for (ii = 0; ii < numPieces; ii = ii + 1) {
        var position = { x: ii * dotDistance + 50, y: 200 };
        var piece = new Dot({ position: position });
        pieces.push(piece);
    }

    pieces.forEach(function (dot) {
        fx.addObject(dot);
    });
    //document.body.style.backgroundImage = "url('resources/forest-bg.jpg')";
    //document.body.style.backgroundRepeat = 'no-repeat';
    //document.body.style.backgroundSize = 'cover'; //'100% 100vh';

    fx.clearCanvas = false;

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

    //canvas.addEventListener('click', function () {
    //    fx.toggle();
    //}, false);
};
