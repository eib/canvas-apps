var FX = require('FX');

module.exports = function thunk(canvas) {
    return function sizeCanvasToDocument() {
        if (canvas) {
            canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth, document.width || 0);
            canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight, document.height || 0);
            FX.prototype.canvasSize = { width: canvas.width, height: canvas.height };
        }
    };
};
