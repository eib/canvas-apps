var FX = require('FX'),
    PHYSX = require('PHYSX'),
    Board = require('./models/board'),
    Game = require('./models/game'),
    Player = require('./models/player'),
    keyCodes = require('./keyCodes');

require('./rendering');

module.exports = function (canvas) {
    var ctx = canvas.getContext('2d'),
        fx = FX(ctx),
        board = new Board(fx),
        game = new Game();

    global.board = board;
    global.game = game;

    var onWindowLoad = function () {
        game.board = board;
        game.players = [
            new Player({ color: 'red' }),
            new Player({ color: 'green' }),
            new Player({ color: 'blue' }),
        ];
        fx.addObject(game);
        fx.clearCanvas = true;
        fx.backgroundColor = 'black';

        fx.start();
    };

    var keysPressed = {};
    var onKeyDown = function (keyCode) {
        console.log("Key Down: " + keyCode);
        keysPressed[keyCode] = true;
    };
    var onKeyUp = function (keyCode) {
        console.log("Key Up: " + keyCode);
        keysPressed[keyCode] = false;
        if (keyCode == keyCodes.delete) {
            board.onDelete();
        }
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
