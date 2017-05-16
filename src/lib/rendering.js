var Board = require('./models/board'),
    Card = require('./models/card'),
    Deck = require('./models/deck'),
    DiscardPile = require('./models/discardPile'),
    Game = require('./models/game'),
    Hand = require('./models/hand'),
    Player = require('./models/player'),
    Town = require('./models/town');

Game.prototype.render = function (ctx) {
    this.drawDeck(ctx);
    this.drawBoard(ctx);
    this.drawPlayers(ctx);
};

Game.prototype.drawDeck = function (ctx) {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.translate(800, 60);
    ctx.fillRect(-30, -50, 60, 100);
    ctx.restore();
};

Game.prototype.drawBoard = function (ctx) {
    this.board.render(ctx);
};

Game.prototype.drawPlayers = function (ctx) {
    this.players.forEach(function (player) {
        ctx.font = '24px serif';
        ctx.fillStyle = player.color;
        ctx.fillText(player.name, 780, 200 + player.index * 200);
    });
};
