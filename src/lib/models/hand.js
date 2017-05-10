function Hand() {
    if (!(this instanceof Hand)) {
        return new Hand();
    }
    this.cards = [];
}

Hand.prototype.refill = function (deck) {
    //TODO: drawOne? refill to handSize? etc
};

Hand.prototype.handSize = 1;

module.exports = Hand;
