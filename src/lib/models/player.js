var Hand = require('./hand'),
    nextPlayerIndex = 0;

function Player(opts = {}) {
    if (!(this instanceof Player)) {
        return new Player(opts);
    }
    this.index = nextPlayerIndex++;
    this.name = opts.name || 'Player ' + this.index;
    this.color = opts.color || 'white';
    this.hand = new Hand();
}

module.exports = Player;
