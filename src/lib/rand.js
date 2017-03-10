module.exports = function rand(min, max) {
    return Math.random() * (max - min) + min;
};