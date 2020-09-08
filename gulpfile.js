var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps');
var coffee = require('gulp-coffee');
var run = require('run-sequence');
var config = require('./bin/config');
var shim = require('./bin/shim');
var nib = require('nib');
var watch = require('node-watch');
var plugins = require('gulp-load-plugins')({
    lazy: false
  });
var pkg = require('./package.json');
var uglify = require('gulp-uglify-es').default;
var express = require('express');
var autoprefixer = require('autoprefixer-stylus');
var lr = require('tiny-lr')();
var open = require('open');
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

gulp.task('stylus', function() {
  return gulp.src(config.srcStylus + 'main*.styl').pipe(plugins.plumber()).pipe(plugins.stylus({
    use: [nib(), autoprefixer()],
    compress: config.publish
  }))
  .pipe(plugins.header('/* ' + config.name + ' : ' + config.version + ' : ' + new Date() + ' */'))
  .pipe(plugins.size({
    showFiles: true
  })).pipe(gulp.dest(config.destStylus));
});

gulp.task('images', function() {
  gulp.src(config.srcImg + '**/*.{jpg,png,gif}').pipe(plugins.plumber())
  .pipe(plugins.imagemin({
    cache: false
  })).pipe(plugins.size({
    showFiles: true
  })).pipe(gulp.dest(config.destImg));
  return gulp.src(config.srcImg + '**/*.svg')
  .pipe(plugins.plumber()).pipe(plugins.svgmin())
  .pipe(plugins.size({
    showFiles: true
  })).pipe(gulp.dest(config.destImg));
});

gulp.task('server', function() {
  var app;
  app = express();
  app.use(require('connect-livereload')());
  app.use(express['static'](config.build));
  app.listen(config.port);
  lr.listen(35729);
  return setTimeout(function() {
    return open('http://localhost:' + config.port + '/index.html');
  }, 3000);
});

gulp.task('watch', function() {

  gulp.watch([config.destScripts + '**/*.js', config.build + '/static/css/**/*.css', config.build + '**/*.html', config.build + 'images/**/*.{jpg,png,gif,svg}']);

  watch(config.srcScripts, function(evt, file) {
    if (file.indexOf('/standalone/') < 0)
      return gulp.parallel("coffee");
    else
      return true;
  });
  watch(config.srcStylus, function(evt, file) {
    console.log('build css....')
    return gulp.series('stylus');
  });
  watch(config.srcJade, function(evt, file) {
    console.log('Changed: '+file);
    var filename = file.replace(/^.*[\\\/]/, '');
    if (!file.match(/includes\/|mixins\/|templates\/|includes\\|mixins\\|templates\\/ig)) {
      config._jadePath = config.root + file; 
      config._buildPath = config.build + (file.replace(filename, '').replace(/(src\/jade\/|src\\jade\\)/ig, ''));
      // config._buildPath = config._buildPath.replace(/(sections\/|sections\\)/ig, '');
    }

    if (filename.indexOf('_') > -1) { // partial file
      var ls = spawn('gulp', ['jade', '-f='+config.root+file]);
      stream(ls);
      config._jadePath = config.root + file.replace('_', '*');
    }
  
    if (file.indexOf('.jade') > -1) {
      return gulp.parallel("jade");
    }
    else {
      return true;
    }
  });
  watch(config.srcImg, function(evt, file) {
    return gulp.parallel('images');
  });
});