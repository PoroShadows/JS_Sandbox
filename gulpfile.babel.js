var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
var pump = require('pump')
var del = require('del')
var stylus = require('gulp-stylus')

var paths = {
    scripts: ['public/jscripts/**/*.js'],
    styles: ['public/styles/**/*.styl']
}

gulp.task('clean', function() {
    return del(['public/dist'])
})

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        //.pipe(concat('all.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/dist/js'))
})

gulp.task('styles', function () {
    return gulp.src(paths.styles)
        .pipe(stylus({ compress: true }))
        .pipe(gulp.dest('public/dist/css'))
})

gulp.task('watch', function() {
    for (var task of Object.getOwnPropertyNames(paths))
        gulp.watch(paths[task], [task])
})

gulp.task('default', ['clean', 'scripts', 'styles', 'watch'])