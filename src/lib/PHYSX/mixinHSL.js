var mixinUpdater = require('./mixinUpdater'),
    hslToColor = require('../util/hslToColor');

module.exports = function mixinHSL(obj, huePropName, colorPropName) {
    var colorFormatter = function (tick) {
        var hue = obj[huePropName],
            color = hslToColor(hue);
        obj[colorPropName] = color;
    };
    mixinUpdater(obj, colorFormatter);
};