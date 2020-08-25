var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps');
var coffee = require('gulp-coffee');
var run = require('run-sequence');
var config = require('./bin/config');
var shim = require('./bin/shim');
var plugins = require('gulp-load-plugins')({
    lazy: false
  });
var pkg = require('./package.json');
var uglify = require('gulp-uglify-es').default;

scripts = {
    coffee: [config.srcScripts + 'vendor/*.coffee', 
      config.srcScripts + 'helpers/*.coffee',
      config.srcScripts + 'modules/**/*.coffee',
      config.srcScripts + 'main.coffee'],
    js: [config.srcScripts + 'vendor/*.js', 
      config.srcScripts + 'helpers/*.js',
      config.srcScripts + 'modules/**/*.js']
  };

gulp.task('coffee', function() {
  gulp.src(scripts.coffee).pipe(plugins.plumber());
  return gulp.src(config.srcScripts + '/main.coffee', {
    read: false
  }).pipe(plugins.plumber()).pipe(plugins.browserify({
    transform: ['coffeeify'],
    shim: shim
  })).pipe(plugins['if'](config.publish, uglify()))
    .pipe(plugins.rename('main.js'))
  //   .pipe(plugins.header('/* ' + config.name + ' : ' + config.version + ' : ' + new Date() + ' */'))
    .pipe(plugins.size({ showFiles: true })).pipe(gulp.dest(config.destScripts));
});

gulp.task('jade', function() {
  var _path = config._jadePath || config.srcJade + '*.jade',
  fileArg = process.argv[3],
  _build = config._buildPath || config.build;
  config._jadePath = null;
  config._buildPath = null;

  console.log('Path: ' + _path);
  console.log('Build: ' + _build);

  return gulp.src(_path).pipe(plugins.plumber()).pipe(plugins.jade({
    pretty: true,
    data: {
      description: pkg.description,
      keywords: pkg.keywords,
      _t: require(config.srcLocale+'en.json')
    }
  })).pipe(gulp.dest(_build));
});
