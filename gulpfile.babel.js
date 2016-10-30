var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var pump = require('pump');
var del = require('del');

var paths = {
    scripts: ['public/jscripts/**/*.js']
};

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('scripts', ['clean'], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        // .pipe(concat('all.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
});

gulp.task('watch', function() {
    for (var task of Object.getOwnPropertyNames(paths))
        gulp.watch(paths[task], [task]);
});

gulp.task('default', ['watch', 'scripts']);