var Hand = require('./hand');

function Player(opts = {}) {
    if (!(this instanceof Player)) {
        return new Player(opts);
    }
    this.index = opts.index || 0;
    this.name = opts.name || 'Player ' + this.index;
    this.hand = new Hand(opts.handSize);
}

module.exports = Player;
