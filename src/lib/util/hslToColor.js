module.exports = function hslToColor(hsl) {
//    Hue is a degree on the color wheel (from 0 to 360) - 0 (or 360) is red, 120 is green, 240 is blue.
//    Saturation is a percentage value; 0% means a shade of gray and 100% is the full color.
//    Lightness is also a percentage; 0% is black, 100% is white.
    return 'hsl(' + hsl.hue + ', ' + hsl.saturation + '%, ' + hsl.lightness + '%)';
};