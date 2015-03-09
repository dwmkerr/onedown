var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var path = require('path');
var opn = require('opn');
var server = require('./server/server.js');

//  Copies vendor files over.
gulp.task('vendor', function() {
  gulp.src('./bower_components/angular/angular.*')
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
  server.start();
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
