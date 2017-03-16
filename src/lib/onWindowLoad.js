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

        var paths = Array(numTowns); //2D edge matrix (numTowns x numTowns)
        for (var ii = 0; ii < numTowns; ii++) {
            paths[ii] = new Array(numTowns).fill(false);
        }
        paths[0][3] = { controlPoints: [100, 200, 200, 200] };
        paths[4][6] = { controlPoints: [] };
        paths[6][14] = { controlPoints: [350, 250] };

        paths.forEach(function (row, ii) {
            row.forEach(function (path, jj) {
                var startTown = towns[ii],
                    endTown = towns[jj],
                    controlPoints = path && path.controlPoints || [],
                    strokeMethods = {
                        2: ctx.lineTo,
                        4: ctx.quadraticCurveTo,
                        6: ctx.bezierCurveTo,
                    };
                controlPoints.push(endTown.position.x);
                controlPoints.push(endTown.position.y);
                if (path) {
                    path.start = startTown.position;
                    path.pathMethod = strokeMethods[controlPoints.length] || ctx.lineTo;
                    path.controlPoints = controlPoints;
                }
            });
        });

        function drawPath(path, ctx) {
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#EEEEAA';
            ctx.beginPath();
            ctx.moveTo(path.start.x, path.start.y);
            path.pathMethod.apply(ctx, path.controlPoints);
            ctx.stroke();
        }

        fx.addObject({
            render: function drawAllPaths(ctx) {
                var row, path;
                for (var ii = 0; ii < paths.length; ii++) {
                    row = paths[ii];
                    for (var jj = 0; jj < row.length; jj++) {
                        path = row[jj];
                        if (path) {
                            drawPath(path, ctx);
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
