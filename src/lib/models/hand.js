function Hand() {
    if (!(this instanceof Hand)) {
        return new Hand();
    }
    this.cards = [];
}

Hand.prototype.refill = function (deck) {
    while (this.cards.length < this.handSize) {
        this.cards.push(deck.drawOne());
    }
};

Hand.prototype.discard = function (discardPile, card) {
    this.cards.splice(this.cards.indexOf(card), 1);
    discardPile.add(card);
};

Hand.prototype.handSize = 1;

module.exports = Hand;
