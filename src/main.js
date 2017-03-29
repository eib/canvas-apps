var canvas = document.getElementById('canvas'),
    events = require('./lib/events')(canvas),
    sizeCanvasToDocument = require('./lib/sizeCanvasToDocument')(canvas);

window.addEventListener('resize', sizeCanvasToDocument, false);
sizeCanvasToDocument();

document.onkeydown = function (evt) {
    var event = window.event ? window.event : evt;
    events.keyDown(event.keyCode);
};
document.onkeyup = function (evt) {
    var event = window.event ? window.event : evt;
    events.keyUp(event.keyCode);
};

canvas.addEventListener('click', function () {
    events.singleClick();
}, false);

window.onload = events.windowLoad;

//document.body.style.backgroundImage = "url('resources/forest-bg.jpg')";
//document.body.style.backgroundRepeat = 'no-repeat';
//document.body.style.backgroundSize = 'cover'; //'100% 100vh';

