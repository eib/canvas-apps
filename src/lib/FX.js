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
    this.isPlaying = false;
    this.isPaused = false;

    this.loop = animitter(function(frameCount, deltaTime) {
        var tick = {
            frames: frameCount,
            deltaMillis: deltaTime,
            totalMillis: self.elapsedTime + deltaTime
        };
        self.update(tick);
        self.render(self.ctx, tick);
        self.elapsedTime += deltaTime;
    });
}

FX.prototype.canvasSize = { x: 1000, y: 1000 };
FX.prototype.backgroundColor = 'black';
FX.prototype.framesBeforePruning = 100;

FX.prototype.update = function (tick) {
    this.updateAll(tick);
    if ((tick.frames % this.framesBeforePruning) === 0) {
        this.pruneTerminatedObjects();
    }
};

FX.prototype.addObjects = function (objects) {
    objects.forEach(this.addObject, this);
};

FX.prototype.addObject = function (obj) {
    if (typeof obj.render === 'function') {
        this.renderables.push(obj);
    }
    if (typeof obj.update === 'function') {
        this.updatables.push(obj);
    }
    if (this.isPaused) {
        this.resume();
    }
};

FX.prototype.render = function (ctx, tick) {
    this.clear(ctx);
    this.renderAll(ctx, tick);
};

FX.prototype.updateAll = function (tick) {
    var terminatedObjects = [];
    this.updatables.forEach(function (obj) {
        if (!obj.isTerminated) {
            if (obj.update(tick) === false) {
                obj.isTerminated = true;
            }
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

FX.prototype.pruneTerminatedObjects = function () {
    [ this.renderables, this.updatables ].forEach(function (collection, ii) {
        var ii,
            obj;
        for (ii = collection.length - 1; ii >= 0; ii--) {
            obj = collection[ii];
            if (obj.isTerminated) {
                if (!obj.foo) {
//                    console.log('Pruned: ', obj);
                    obj.foo = true;
                }
                collection.splice(ii, 1);
            }
        }
    });
    if (this.renderables.length === 0 && this.updatables.length === 0) {
        this.pause();
    }
};

FX.prototype.start = function () {
    console.log('Starting animation loop...');
    this.loop.start();
    this.isPlaying = true;
};

FX.prototype.stop = function () {
    this.loop.stop();
    this.isPlaying = false;
    console.log('Stopped.');
};

FX.prototype.toggle = function () {
    if (this.isPlaying) {
        this.stop();
    } else {
        this.start();
    }
};

FX.prototype.pause = function () {
    if (this.isPlaying) {
        console.log('Pausing...');
        this.stop();
        this.isPaused = true;
    }
};

FX.prototype.resume = function () {
    if (this.isPaused) {
        console.log('Resumed.');
        this.start();
        this.isPaused = false;
    }
};

FX.prototype.onTick = function (callback) {
    var self = this;
    this.loop.on('update', function(frameCount, deltaTime) {
        var tick = {
            frames: frameCount,
            deltaMillis: deltaTime,
            totalMillis: self.elapsedTime + deltaTime
        };
        callback(tick);
    });
};

module.exports = FX;