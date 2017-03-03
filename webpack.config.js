var path = require('path'),
    baseDir = __dirname;

module.exports = {
    entry: path.join(baseDir, 'src/main.js'),
    output: {
        path: path.join(baseDir, 'js'),
        filename: 'bundle.js',
    }
};
