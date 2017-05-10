var arrays = require('../util/arrays');

function Deck() {
    if (!(this instanceof Deck)) {
        return new Deck();
    }
    this.cards = [];
}

Deck.prototype.shuffle = function () {
    arrays.shuffle(this.cards);
};

Deck.prototype.drawOne = function () {
    var firstCards = this.cards.splice(0, 1); //HINT: firstCards will be empty when this.cards is empty
    return firstCards[0];
    //TODO: "empty" event!
    //TODO: throw "out of cards" error?
};

Deck.prototype.reshuffle = function (discardPile) {
    var cards = discardPile.drain();
    arrays.shuffle(cards);
    cards.forEach((card) => this.cards.push(card));
};

module.exports = Deck;
