var canvas = document.getElementById('canvas'),
    onLoad = require('./lib/onWindowLoad')(canvas),
    sizeCanvasToDocument = require('./lib/sizeCanvasToDocument')(canvas);

window.addEventListener('resize', sizeCanvasToDocument, false);
sizeCanvasToDocument();

window.onload = onLoad;
