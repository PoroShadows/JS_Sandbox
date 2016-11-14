var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
var pump = require('pump')
var del = require('del')
var stylus = require('gulp-stylus')
var ejs = require('gulp-ejs')
var imageop = require('gulp-image-optimization')
var gutil = require('gulp-util')
var browserSync = require('browser-sync').create()

var paths = {
    scripts: ['public/jscripts/**/*.js'],
    styles: ['public/styles/**/*.styl'],
    ejs: ['public/views/**/*.ejs'],
    images: ['public/images/**/*.png', 'public/images/**/*.jpg', 'public/images/**/*.gif', 'public/images/**/*.jpeg']
}

gulp.task('clean', function () {
    return del(['public/dist'])
})

gulp.task('scripts', function () {
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

gulp.task('ejs', function () {
    return gulp.src(paths.ejs)
        .pipe(ejs({
            msg: 'Hello Gulp!'
        }).on('error', gutil.log))
        .pipe(gulp.dest('./dist'));
})

gulp.task('images', function (cb) {
    return gulp.src(paths.images)
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('public/dist/images'))
        .on('end', cb)
        .on('error', cb)
})

for (var task of Object.getOwnPropertyNames(paths))
    gulp.task('watch-'+task, [task], function (done) {
        browserSync.reload()
        done()
    })

gulp.task('serve', ['scripts', 'styles', 'ejs', 'images'], function () {
    for (var task of Object.getOwnPropertyNames(paths))
        for (var i = 0; i < paths[task].length; i++)
            gulp.watch(paths[task][i], ['watch'+task])
})

gulp.task('default', ['serve'])