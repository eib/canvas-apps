function DiscardPile() {
    if (!(this instanceof DiscardPile)) {
        return new DiscardPile();
    }
    this.cards = [];
}

DiscardPile.prototype.add = function (card) {
    this.cards.push(card);
};

DiscardPile.prototype.drain = function () {
    var cards = this.cards;
    this.cards = [];
    return cards;
};

//TODO: possibly need to "drawTopX", or "pick whatever cards you want"

module.exports = DiscardPile;
