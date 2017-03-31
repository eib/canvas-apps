var Town = require('./town'),
//Piece = require('./models/piece'), //Want a "piece factory"?
    rand = require('../rand');

function Board(fx) {
    if (!(this instanceof Board)) {
        return new Board(fx);
    }
    this.fx = fx;
    this.towns = this.generateTowns();
    this.paths = this.generatePaths(this.towns, fx.ctx); //2D edge matrix (numTowns x numTowns), only top-right half of the matrix is populated
}

/* Events */

Board.prototype.handleSingleClick = function (location) {
    var selectedTown = this.towns.find(function (town) {
        var distX = town.position.x - location.x,
            distY = town.position.y - location.y;
        return Math.sqrt(distX * distX + distY * distY) < town.getSelectionRadius();
    }, this);
    if (selectedTown) {
        console.log("Town selected: ", selectedTown);
    }
    return !!selectedTown;
};

/* Rendering */

Board.prototype.render = function (ctx) {
    this.drawAllPaths(ctx);
    this.drawTowns(ctx);
};

Board.prototype.drawTowns = function (ctx) {
    this.towns.forEach(function (town) {
        town.render(ctx);
    });
};

Board.prototype.drawAllPaths = function (ctx) {
    var row, path;
    for (var ii = 0; ii < this.paths.length; ii++) {
        row = this.paths[ii];
        for (var jj = ii; jj < row.length; jj++) {
            path = row[jj];
            if (path) {
                this.drawPath(path, ctx);
            }
        }
    }
};

Board.prototype.drawPath = function (path, ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#EEEEAA';
    ctx.beginPath();
    ctx.moveTo(path.start.x, path.start.y);
    path.pathMethod.apply(ctx, path.controlPoints);
    ctx.stroke();
};

/* Board Generation */

Board.prototype.generateTowns = function () {
    var numTowns = 15;
    var towns = [];
    for (var ii = 0; ii < numTowns; ii++) {
        var x = Math.floor(ii / 3) * 200 + 200,
            y = (ii % 3) * 200 + 200,
            position = { x: x, y: y},
            town = new Town({
                radius: 25,
                fillColor: '#EEEEAA',
                position: position,
                name: 'Town' + ii,
                magic: (ii % 2) === 0,
                index: ii,
            });
        towns.push(town);
    }
    return towns;
};

Board.prototype.generatePaths = function (towns, ctx) {
    var numTowns = towns.length;
    var paths = Array(numTowns);
    for (var ii = 0; ii < numTowns; ii++) {
        paths[ii] = new Array(numTowns).fill(false);
    }
    paths[0][3] = { controlPoints: [200, 400, 400, 400] };
    paths[4][6] = { };
    paths[6][14] = { controlPoints: [700, 500] };

    paths.forEach(function (row, ii) {
        row.forEach(function (path, jj) {
            var startTown = towns[ii],
                endTown = towns[jj],
                controlPoints = path && path.controlPoints || [],
                strokeMethods = {
                    2: ctx.lineTo,
                    4: ctx.quadraticCurveTo,
                    6: ctx.bezierCurveTo,
                };
            controlPoints.push(endTown.position.x);
            controlPoints.push(endTown.position.y);
            if (path) {
                path.start = startTown.position;
                path.pathMethod = strokeMethods[controlPoints.length] || ctx.lineTo;
                path.controlPoints = controlPoints;
            }
        });
    });
    return paths;
};

module.exports = Board;
