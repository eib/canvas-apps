var FX = require('./lib/FX'),
    PHYSX = require('./lib/PHYSX'),
    Dot = require('./lib/Dot'),
    canvas = document.getElementById('canvas');

function sizeCanvasToDocument() {
    if (canvas) {
        canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth, document.width || 0);
        canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight, document.height || 0);
        FX.prototype.canvasSize = { width: canvas.width, height: canvas.height };
    }
}

window.addEventListener('resize', sizeCanvasToDocument, false);

sizeCanvasToDocument();

window.onload = function () {
    var ctx = canvas.getContext('2d'),
        fx = FX(ctx),
        playing = true;

    var dot = new Dot(20,
        function (tick) {
            var hue = (tick.totalMillis / 1000 * 60) % 360;
            return 'hsl(' + hue + ', 75%, 50%)';
        });
    PHYSX.addAcceleration(dot, { x: 0.0002, y: 0.0002 });
    fx.addObject(dot);

    fx.start();
    canvas.addEventListener('click', function () {
        if (playing) {
            fx.stop();
        } else {
            fx.start();
        }
        playing = !playing;
    }, false);
};
