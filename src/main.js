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

canvas.addEventListener('click', function (evt) {
    var event = window.event ? window.event : evt,
        location = getEventLocation(canvas, evt);
    events.singleClick(location);
}, false);

window.onload = events.windowLoad;

function getEventLocation(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}

//document.body.style.backgroundImage = "url('resources/forest-bg.jpg')";
//document.body.style.backgroundRepeat = 'no-repeat';
//document.body.style.backgroundSize = 'cover'; //'100% 100vh';

