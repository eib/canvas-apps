function Card(props) {
    if (!(this instanceof Card)) {
        return new Card(props);
    }
    //duck-typed cards:
    // you either get a "null" card (without color) or a "creature" card (that has a color)
    this.isNull = props.isNull;
    this.creatureType = props.creatureType;
    this.color = props.color;
}

module.exports = Card;
