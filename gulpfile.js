const gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    prettify = require('gulp-jsbeautifier'),
    replace = require('gulp-replace'),
    fs = require('fs');

gulp.task('lint', () => {
    return gulp.src(['js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build', () => {
    return gulp.src([
            'include/header.js',
            'js/dom-element-helper.js',
            'js/main.js',
            'include/footer.js'
        ])
        .pipe(concat('torviet-shoutbox-enhancer.js'))
        .pipe(replace('@{version}', JSON.parse(fs.readFileSync(
            './package.json')).version))
        .pipe(replace(/(\r\n|\r|\n)module\.exports.+;(\r\n|\r|\n)/g, ''))
        .pipe(prettify())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    gulp.watch('js/*.js', ['lint', 'build']);
});

gulp.task('default', ['lint', 'build', 'watch']);
