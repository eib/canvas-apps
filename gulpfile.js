var gulp = require('gulp'),
    smoosher = require('gulp-smoosher');

gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(smoosher())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['html'], function () {
    gulp.watch(['src/**/*.html', 'src/**/bundle.js'], ['html']);
});

gulp.task('default', ['html']);
