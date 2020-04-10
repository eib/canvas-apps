var gulp = require('gulp');

function bundleHtml() {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'));
}

gulp.task('html', bundleHtml);

gulp.task('watch', gulp.series('html', function () {
    return gulp.watch(['src/**/*.html', 'src/**/bundle.js'], bundleHtml);
}));

gulp.task('default', gulp.series('html'));
