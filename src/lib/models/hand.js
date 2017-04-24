function Hand(cards) {
    if (!(this instanceof Hand)) {
        return new Hand(cards);
    }
}

module.exports = Hand;
