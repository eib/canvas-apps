var animitter = require('animitter');

function FX(ctx) {
    if (!(this instanceof FX)) {
        return new FX(ctx);
    }
    var self = this;
    this.ctx = ctx;
    this.elapsedTime = 0;
    this.renderables = [];
    this.updatables = [];

    this.loop = animitter(function(frameCount, deltaTime) {
        var tick = {
            frames: frameCount,
            deltaMillis: deltaTime,
            totalMillis: self.elapsedTime + deltaTime
        };
        self.clear(ctx);
        self.updateAll(tick);
        self.renderAll(ctx, tick);
        self.elapsedTime += deltaTime;
    });
}

FX.prototype.canvasSize = { x: 1000, y: 1000 };

FX.prototype.backgroundColor = 'black';

FX.prototype.addObject = function (obj) {
    if (typeof obj.render === 'function') {
        this.renderables.push(obj);
    }
    if (typeof obj.update === 'function') {
        this.updatables.push(obj);
    }
    //TODO: resume
};

FX.prototype.updateAll = function (tick) {
    var terminatedObjects = [];
    this.updatables.forEach(function (obj) {
        if (!obj.isTerminated) {
            obj.isTerminated = obj.update(tick) === false;
        }
    });
};

FX.prototype.clear = function (ctx) {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);
};

FX.prototype.renderAll = function (ctx, tick) {
    this.renderables.forEach(function (obj) {
        if (!obj.isTerminated) {
            obj.render(ctx, tick);
        }
    });
};

//TODO: prune terminated objects every X (ticks, ms, or # new objects?)
//TODO: and pause if there are no un-terminated objects

FX.prototype.start = function () {
    console.log('Starting animation loop...');
    this.loop.start();
};

FX.prototype.stop = function () {
    this.loop.stop();
    console.log('Stopped.');
};

module.exports = FX;