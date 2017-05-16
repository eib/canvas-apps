var Deck = require('./deck'),
    DiscardPile = require('./discardPile');

function Game() {
    if (!(this instanceof Game)) {
        return new Game();
    }
    this.board = null;
    this.players = [];
    this.deck = new Deck();
    this.discardPile = new DiscardPile();
}

module.exports = Game;
