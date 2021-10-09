'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
//const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync');
//const notify = require('gulp-notify');

//import gulp from 'gulp';
//import imagemin from 'gulp-imagemin';


const server = browserSync.create();

// BrowserSync
function serve(done) {
 server.init({
    server: {
      baseDir: "./docs"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function reload(done) {
 server.reload();
  done();
}

// 


var paths = {
  styles: {
    src: ['scss/bootstrap.css', 'scss/main.scss'],
    dest: 'docs/css'
  },
  scripts:{
    src: ['js/vendor/jquery-3.3.1.min.js','js/vendor/jquery.easing.min.js','js/vendor/scrollreveal.min.js','js/vendor/bootstrap.js','js/main.js'],
    dest: 'docs/js'
  },
  images:{
    src:'img/**/*.{png,jpg,svg}',
    dest: 'docs/img'
  },
  htmls:{
    src:'*.{html,txt,xml,webmanifest,png,js}',
    dest: 'docs/'
  }


};

function clean(){
  return del(['./docs']);
}

function images() {
  return gulp.src(paths.images.src)
  //.pipe(imagemin())
  .pipe(gulp.dest(paths.images.dest))
  //.pipe(notify("Images ok !"))
  ;
}


/*
function images() {
  return gulp.src(paths.images.src)
        .pipe(imagemin([gifsicle({interlaced: true}),
          mozjpeg({quality: 75, progressive: true}),
          optipng({optimizationLevel: 5}),
          svgo({
            plugins: [
              {
                name: 'removeViewBox',
                active: true
              },
              {
                name: 'cleanupIDs',
                active: false
              }
            ]
          })
        ]))
        .pipe(gulp.dest(paths.images.dest));
}
*/
/*
function images() {
  return gulp.src(paths.images.src)
  .pipe(imagemin([
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
    })
  ]))
  .pipe(gulp.dest(paths.images.dest));
}
*/
function copy(){
  return gulp.src('*.{html,txt,xml,webmanifest,png,js}')
  .pipe(gulp.dest('docs'));
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))   // ici on utilise gulp-sass
        .pipe( rename ({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest));
        //.pipe(server.stream()); // browser
}

////.pipe(rename({extname: '.min.js'}))
function scripts(){
  return gulp
  .src(paths.scripts.src, {
    sourcemaps:true
  })
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(gulp.dest(paths.scripts.dest));
}

//
function watch(){
  gulp.watch(paths.htmls.src, copy);
  gulp.watch(paths.scripts.src, scripts );
  gulp.watch(paths.images.src, images );
  gulp.watch(paths.styles.src, styles);
  //gulp.watch(paths.styles.src, gulp.series(styles,reload));
}

//
exports.copy = copy;
exports.clean= clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = watch;
exports.server = server;
exports.reload = reload;
//
//var build = gulp.series(clean, gulp.parallel(styles));
var build = gulp.parallel(styles,scripts);

var live = gulp.series( clean, build, images, copy, serve, watch);

var test = gulp.series( build, copy, serve, watch)

gulp.task(build);
gulp.task(live);
gulp.task(test);

gulp.task('default', build);

gulp.task('l', live);
gulp.task( 't', test);

