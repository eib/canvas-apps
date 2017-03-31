var FX = require('FX'),
    PHYSX = require('PHYSX'),
    Board = require('./models/board');

module.exports = function (canvas) {
    var ctx = canvas.getContext('2d'),
        fx = FX(ctx),
        board = new Board(fx);

    var onWindowLoad = function () {
        fx.addObject(board);
        fx.clearCanvas = true;
        fx.backgroundColor = 'black';

        fx.start();
    };

    //left: 37
    //up: 38
    //right: 39
    //down: 40
    var keysPressed = {};
    var onKeyDown = function (keyCode) {
        console.log("Key Down: " + keyCode);
        keysPressed[keyCode] = true;
    };
    var onKeyUp = function (keyCode) {
        console.log("Key Up: " + keyCode);
        keysPressed[keyCode] = false;
    };

    var onSingleClick = function (location) {
        console.log("Touch event:", location);
        if (!board.handleSingleClick(location)) {
            fx.toggle();
        }
    };

    return {
        windowLoad: onWindowLoad,
        keyDown: onKeyDown,
        keyUp: onKeyUp,
        singleClick: onSingleClick,
    };
};
