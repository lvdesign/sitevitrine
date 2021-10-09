var gulp = require('gulp');
var less = require('gulp-less');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');


var paths = {
    styles: {
      src: ['scss/bootstrap.css', 'scss/main.scss'],
      dest: 'docs/css'
    },
    scripts: {
      src: ['js/vendor/jquery-3.3.1.min.js','js/vendor/jquery.easing.min.js','js/vendor/scrollreveal.min.js','js/vendor/bootstrap.js' ,'js/main.js'],
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


  function clean() {
    // You can use multiple globbing patterns as you would with `gulp.src`,
    // for example if you are using del 2.0 or above, return its promise
    return del([ './docs' ]);
  }

  function styles() {
    return gulp.src(paths.styles.src)
        .pipe(less())
        .on('error', console.error.bind(console))   // ici on utilise gulp-sass
        .pipe( rename ({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest));
    }

function scripts() {
        return gulp.src(paths.scripts.src, { sourcemaps: true })
          .pipe(babel())
          .pipe(uglify())
          .pipe(concat('main.min.js'))
          .pipe(gulp.dest(paths.scripts.dest));
      }

      function watch() {
        gulp.watch(paths.scripts.src, scripts);
        gulp.watch(paths.styles.src, styles);
      }

      function images() {
        return gulp.src(paths.images.src, {since: gulp.lastRun(images)})
          .pipe(imagemin())
          .pipe(gulp.dest(paths.images.dest));
      }
      
      function watch() {
        gulp.watch(paths.images.src, images);
      }

      var build = gulp.series(clean, gulp.parallel(styles, scripts));


      exports.clean = clean;
      exports.styles = styles;
      exports.scripts = scripts;
      exports.watch = watch;
      exports.build = build;
      /*
       * Define default task that can be called by just running `gulp` from cli
       */
      exports.default = build;