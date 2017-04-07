const gulp = require('gulp');
const stripComments = require('gulp-strip-comments');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const fs = require('fs');

const scriptName = 'torviet-shoutbox-enhancer.js';

gulp.task('lint', () => gulp.src([`./dist/${scriptName}`])
  .pipe(eslint())
  .pipe(eslint.format()));

gulp.task('build', () => gulp.src([
  'include/header.js',
  'js/declaration.js',
  'js/dom-element-helper.js',
  'js/emoticon-service.js',
  'js/emoticon.js',
  'js/main.js',
  'include/footer.js',
])
  .pipe(concat(scriptName))
  .pipe(stripComments({
    ignore: /\/\//g,
  }))
  .pipe(replace('@{version}', JSON.parse(fs.readFileSync('./package.json')).version))
  .pipe(replace(/(\r\n|\r|\n)module\.exports.+(\r\n|\r|\n)/g, ''))
  .pipe(gulp.dest('dist')));

gulp.task('watch', () => {
  gulp.watch('js/*.js', ['build', 'lint']);
});

gulp.task('default', ['build', 'lint', 'watch']);
