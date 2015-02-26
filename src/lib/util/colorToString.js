var Color = require('color');

module.exports = function colorToString(color) {
    return Color(color).hslString();
};