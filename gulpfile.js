var gulp = require('gulp');

gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['html'], function () {
    gulp.watch(['src/**/*.html'], ['html']);
});

gulp.task('default', ['html']);
