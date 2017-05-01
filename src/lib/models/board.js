var Piece = require('./piece'),
    Layout = require('./layout'),
    rand = require('../rand'),
    PathAnimation = require('./pathAnimation');

function Board(fx) {
    if (!(this instanceof Board)) {
        return new Board(fx);
    }
    this.fx = fx;
    this.layout = new Layout();
    this.pieces = [];
    this.lastSelectedPiece = null;
    this.lastAnimation = Promise.resolve();
}

/* Events */

Board.prototype.handleSingleClick = function (location) {
    var selectedTown = this.layout.findTown(function (town) {
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
    return town1 && town2 && this.layout.getPath(town1.index, town2.index);
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
    this.layout.forEachTown(function (town) {
        town.render(ctx);
    });
};

Board.prototype.drawAllPaths = function (ctx) {
    this.layout.forEachPath((path) => this.drawPath(path, ctx));
};

Board.prototype.drawPath = function (path, ctx) {
    ctx.lineWidth = 30;
    ctx.strokeStyle = '#AAAA77';
    ctx.beginPath();
    ctx.moveTo(path.start.x, path.start.y);
    path.strokeMethod.apply(ctx, path.flattenedControlPoints);
    ctx.stroke();
};

module.exports = Board;
