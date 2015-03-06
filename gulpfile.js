var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var express = require('express');
var path = require('path');
var connectLivereload = require('connect-livereload');
var opn = require('opn');

//  Copies vendor files over.
gulp.task('vendor', function() {
  gulp.src('./bower_components/angular/angular.js')
    .pipe(gulp.dest('./client/vendor/angular'));
  gulp.src('./bower_components/bootstrap/dist/**/*.*')
    .pipe(gulp.dest('./client/vendor/bootstrap'));
  gulp.src('./bower_components/jquery/dist/**/*.*')
    .pipe(gulp.dest('./client/vendor/jquery'));
});

//  Hints all of the javascript.
gulp.task('jshint', function() {

  return gulp.src(['src/crosswords.js', 'test/**/*.spec.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));

});

//  Starts the express server.
gulp.task('serve', function() {

  //  Create the app. Serve the samples and the dist.
  var app = express();
  app.use(connectLivereload());
  app.use(express.static(path.join(__dirname, 'client')));
  app.listen(3000);
  console.log('Exchange cross words on port 3000');

});

//  Starts the livereload server.
var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(35729);
});

function notifyLiveReload(event) {

  console.log("Reloading for " + event.path);

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

  //  Reload on client changes.
  gulp.watch(['samples/**/*.*'], notifyLiveReload);

});

gulp.task('default', ['vendor', 'serve', 'livereload', 'watch'], function() {
  opn('http://localhost:3000');
});
