var Town = require('./town'),
    Path = require('./path');

function Layout() {
    if (!(this instanceof Layout)) {
        return new Layout();
    }
    this.towns = this.generateTowns();
    this.paths = this.generatePaths(this.towns.length); //2D edge matrix (numTowns x numTowns), both halves (top right/bottom left) are populated
    this.connectTowns();
}

Layout.prototype.getTown = function (index) {
    return this.towns[index];
};

Layout.prototype.getPath = function (index1, index2) {
    return this.paths[index1][index2];
};

Layout.prototype.findTown = function (filter) {
    var matchingTown = null;
    this.forEachTown((town) => {
       if (filter(town)) {
           matchingTown = town;
       }
    });
    return matchingTown;
};

Layout.prototype.forEachTown = function (forEach) {
    for (var ii = 0; ii < this.towns.length; ii++) {
        if (this.towns[ii]) {
            forEach(this.towns[ii]);
        }
    }
};

Layout.prototype.forEachPath = function (forEach, thisArg) {
    var row, path;
    for (var ii = 0; ii < this.paths.length; ii++) {
        row = this.paths[ii];
        for (var jj = ii; jj < row.length; jj++) {
            path = row[jj];
            if (path) {
                forEach(path, ii, jj);
            }
        }
    }
};

/* Generation */

Layout.prototype.generateTowns = function () {
    var numTowns = 25;
    var towns = [];
    for (var ii = 0; ii < numTowns; ii++) {
        var x = Math.floor(ii / 5) * 150 + 50,
            y = (ii % 5) * 150 + 50,
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
    towns[6] = null;
    towns[16] = null;
    towns[8] = null;
    towns[18] = null;
    return towns;
};

Layout.prototype.generatePaths = function (numTowns) {
    var paths = [];
    for (var ii = 0; ii < numTowns; ii++) {
        paths[ii] = new Array(numTowns).fill(false);
    }
    return paths;
};

Layout.prototype.connectTowns = function (paths, towns, index1, index2, controlPoints = []) {
    this.towns[11].position.x += 25;
    this.towns[13].position.x -= 25;
    this.towns[7].position.y -= 25;
    this.towns[17].position.y += 25;

    this.createPath(12, 7);
    this.createPath(12, 17);
    this.createPath(12, 13);
    this.createPath(12, 11);

    this.createPath(11, 10);
    this.createPath(17, 22);
    this.createPath(13, 14);
    this.createPath(2, 7);

    this.createPath(1, 2);
    this.createPath(1, 10, [{ x: 250, y: 200 }]);
    this.createPath(10, 15);
    this.createPath(15, 22, [{ x: 500, y: 250 }]);
    this.createPath(22, 23);
    this.createPath(23, 14, [{ x: 450, y: 500 }]);
    this.createPath(14, 9);
    this.createPath(9, 2, [{ x: 200, y: 450 }]);

    this.createPath(0, 1);
    this.createPath(20, 15);
    this.createPath(24, 23);
    this.createPath(9, 4);

    this.createPath(5, 0);
    this.createPath(21, 20);
    this.createPath(3, 4);
    this.createPath(19, 24);
};

Layout.prototype.createPath = function (index1, index2, controlPoints = []) {
    var town1 = this.towns[index1],
        town2 = this.towns[index2],
        path = new Path(town1.position, town2.position, controlPoints);
    this.paths[index1][index2] = path;
    this.paths[index2][index1] = path.flip();
};

module.exports = Layout;
