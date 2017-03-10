var FX = require('FX'),
    PHYSX = require('PHYSX'),
    Dot = require('./models/Dot'),
    rand = require('./rand');

module.exports = function (canvas) {
    return function () {
        var ctx = canvas.getContext('2d'),
            fx = FX(ctx);

        var numTowns = 15;

        var towns = [];
        for (var ii = 0; ii < numTowns; ii++) {
            var x = Math.floor(ii / 3) * 100 + 100,
                y = (ii % 3) * 100 + 100,
                position = { x: x, y: y},
                piece = new Dot({ position: position });
            towns.push(piece);
        }

        towns.forEach(function (dot) {
            fx.addObject(dot);
        });

        var edges = Array(numTowns); //2D edge matrix (numTowns x numTowns)
        for (var ii = 0; ii < numTowns; ii++) {
            edges[ii] = new Array(numTowns).fill(false);
        }
        edges[0][4] = true;
        edges[4][6] = true;
        edges[6][14] = true;

        function drawEdge(town1, town2, ctx) {
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#EEEEAA';
            ctx.beginPath();
            ctx.moveTo(town1.position.x, town1.position.y);
            ctx.lineTo(town2.position.x, town2.position.y);
            ctx.stroke();
        }

        fx.addObject({
            render: function drawAllEdges(ctx) {
                for (var ii = 0; ii < edges.length; ii++) {
                    var row = edges[ii];
                    for (var jj = 0; jj < row.length; jj++) {
                        if (row[jj]) {
                            drawEdge(towns[ii], towns[jj], ctx);
                        }
                    }
                }
            }
        });

        //document.body.style.backgroundImage = "url('resources/forest-bg.jpg')";
        //document.body.style.backgroundRepeat = 'no-repeat';
        //document.body.style.backgroundSize = 'cover'; //'100% 100vh';

        fx.clearCanvas = true;
        fx.backgroundColor = 'black';

        fx.start();

        //left: 37
        //up: 38
        //right: 39
        //down: 40
        var keysPressed = {};
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
};
