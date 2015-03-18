var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var path = require('path');
var opn = require('opn');

//  Hints and builds all JavaScript.
gulp.task('js', function() {

  return gulp.src(['./client/app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(concat('app.js'))
      .pipe(gulp.dest('./client/dist'))
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./client/dist/'));

});

//  Builds all of the css.
gulp.task('css', function() {

});

//  Copies vendor files over.
gulp.task('vendor', function() {
  gulp.src('./bower_components/angular/angular.*')
    .pipe(gulp.dest('./client/vendor/angular'));
  gulp.src('./bower_components/angular-cookies/angular-cookies.*')
    .pipe(gulp.dest('./client/vendor/angular-cookies'));
  gulp.src('./bower_components/angular-route/angular-route.*')
    .pipe(gulp.dest('./client/vendor/angular-route'));
  gulp.src('./bower_components/crosswords-js/dist/*.*')
    .pipe(gulp.dest('./client/vendor/crosswords-js'));
  gulp.src('./bower_components/bootstrap/dist/**/*.*')
    .pipe(gulp.dest('./client/vendor/bootstrap'));
  gulp.src('./bower_components/jquery/dist/**/*.*')
    .pipe(gulp.dest('./client/vendor/jquery'));
  gulp.src('./bower_components/materialize/dist/**/*.*')
    .pipe(gulp.dest('./client/vendor/materialize'));
});

//  Starts the livereload server.
var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(35729);
});

function notifyLiveReload(event) {

  var fileName = path.relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('test', function (done) {
  karma.start({
    configFile: path.join(__dirname, './karma.conf.js'),
    singleRun: true
  }, done);
});

//  Sets up watchers.
gulp.task('watch', function() {

  // //  When our source js/less changes, rebuild it.
  // gulp.watch(['src/**.js'], ['jshint', 'js']);
  // gulp.watch(['src/**.less'], ['css']);

  //  Rebuild on client js changes.
  gulp.watch(['client/app/**/*.js'], ['js']);

  //  Reload on client changes.
  gulp.watch(['client/**/*.html', 'client/dist/**/*.*'], notifyLiveReload);

});

gulp.task('default', ['vendor', 'livereload', 'watch'], function() {
  opn('http://localhost:3000');
});