var Town = require('./town'),
    Piece = require('./piece'),
    rand = require('../rand'),
    PathAnimation = require('./pathAnimation');

function Board(fx) {
    if (!(this instanceof Board)) {
        return new Board(fx);
    }
    this.fx = fx;
    this.towns = this.generateTowns();
    this.paths = this.generatePaths(this.towns, fx.ctx); //2D edge matrix (numTowns x numTowns), both halves (top right/bottom left) are populated
    this.pieces = [];
    this.lastSelectedPiece = null;
    this.lastAnimation = Promise.resolve();
}

/* Events */

Board.prototype.handleSingleClick = function (location) {
    var selectedTown = this.towns.find(function (town) {
            var distX = town.position.x - location.x,
                distY = town.position.y - location.y;
            return Math.sqrt(distX * distX + distY * distY) < town.getSelectionRadius();
        }, this);
    if (selectedTown) {
        var selectedPiece = selectedTown.pieces.find(function (piece) {
                var distX = piece.position.x - location.x,
                    distY = piece.position.y - location.y;
                return Math.sqrt(distX * distX + distY * distY) < piece.getSelectionRadius();
            });

        if (selectedPiece) {
            console.log("Piece selected:", selectedPiece);
            if (this.lastSelectedPiece && this.lastSelectedPiece !== selectedPiece) {
                this.lastSelectedPiece.isSelected = false;
            }
            //this.removePieceFromTown(selectedPiece, selectedTown);
            selectedPiece.isSelected = !selectedPiece.isSelected;
            this.lastSelectedPiece = selectedPiece;
        } else {
            if (this.lastSelectedPiece && this.lastSelectedPiece.town !== selectedTown && this.areConnected(this.lastSelectedPiece.town, selectedTown)) {
                this.movePieceToTown(this.lastSelectedPiece, selectedTown);
            } else {
                console.log("Town selected:", selectedTown);
                this.createPieceAtTown(selectedTown);
                if (this.lastSelectedPiece) {
                    this.lastSelectedPiece.isSelected = false;
                }
                this.lastSelectedPiece = null;
            }
        }
    }
    return !!selectedTown;
};

Board.prototype.removePieceFromTown = function (piece, town) {
    town.removePiece(piece);
    this.pieces.splice(this.pieces.indexOf(piece), 1);
};

var index = 0;
Board.prototype.createPieceAtTown = function (town) {
    var piece = new Piece({
        position: { x: town.position.x, y: town.position.y }, //TODO: "clone" position method?
        town: town,
        index: index++,
        //TODO: "team" implies color/fillColor
    });
    town.addPiece(piece);
    this.pieces.push(piece);
};

Board.prototype.movePieceToTown = function (piece, newTown) {
    var oldTown = piece.town,
        path = this.getPath(piece.town, newTown),
        animation = new PathAnimation(piece, path);
    this.queueAnimation(animation, function () {
        oldTown.removePiece(piece);
        piece.town = newTown;
        newTown.addPiece(piece);
    });
};

Board.prototype.getPath = function (town1, town2) {
    return town1 && town2 && this.paths[town1.index][town2.index];
};

Board.prototype.areConnected = function (town1, town2) {
    return !!this.getPath(town1, town2);
};

Board.prototype.onDelete = function () {
    if (this.lastSelectedPiece) {
        this.removePieceFromTown(this.lastSelectedPiece, this.lastSelectedPiece.town); //TODO: LoD
        this.lastSelectedPiece = null;
    }
};

/* Animations */

Board.prototype.queueAnimation = function (animation, onComplete) {
    var fx = this.fx;
    this.lastAnimation = this.lastAnimation.then(new Promise(function (resolve, reject) {
        animation.onComplete = function () {
            onComplete(); //Note: "onComplete" should be synchronous (if you resolve to a Promise, is the resolved Promise resolved, too?)
            resolve();
        };
        fx.addObject(animation);
    })).catch(function (err) {
        console.log('Uncaught animation error:', err);
        window.alert('Uncaught animation error: ' + (err.message || err));
    });
};

/* Rendering */

Board.prototype.render = function (ctx) {
    this.drawAllPaths(ctx);
    this.drawTowns(ctx);
    this.drawPieces(ctx);
};

Board.prototype.drawPieces = function (ctx) {
    this.pieces.forEach(function (piece) {
        piece.render(ctx);
    });
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
    ctx.lineWidth = 30;
    ctx.strokeStyle = '#AAAA77';
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
    paths[0][3] = { controlPoints: [230, 420, 360, 380] };
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
                path.end = { x: endTown.position.x, y: endTown.position.y };
            }
        });
    });

    function flipPath(path) {
        if (!path) {
            return path;
        }
        var controlPoints = [];
        for (ii = path.controlPoints.length - 3; ii > 0; ii -= 2) {
            var x = path.controlPoints[ii - 1],
                y = path.controlPoints[ii];
            controlPoints.push(x);
            controlPoints.push(y);
        }
        controlPoints.push(path.start.x);
        controlPoints.push(path.start.y);

        return { //TODO: Path.prototype.flip()
            start: path.end,
            end: path.start,
            pathMethod: path.pathMethod,
            controlPoints: controlPoints,
        };
    }
    for (var rowIndex = 0; rowIndex < paths.length; rowIndex++) {
        var row = paths[rowIndex];
        for (var columnIndex = rowIndex; columnIndex < row.length; columnIndex++) {
            paths[columnIndex][rowIndex] = flipPath(paths[rowIndex][columnIndex]);
        }
    }
    return paths;
};

module.exports = Board;
