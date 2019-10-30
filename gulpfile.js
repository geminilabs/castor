const args            = require('yargs').argv;
const bump            = require('gulp-bump');
const cache           = require('gulp-cache');
const checktextdomain = require('gulp-checktextdomain');
const gulp            = require('gulp');
const imagemin        = require('gulp-imagemin');
const potomo          = require('gulp-potomo');
const pottopo         = require('gulp-pottopo');
const pump            = require('pump');
const sort            = require('gulp-sort');
const wpPot           = require('gulp-wp-pot');
const yaml            = require('yamljs');

var config = yaml.load('config.yml');

/* Images Task
 -------------------------------------------------- */
gulp.task('images', function(cb) {
  pump([
    gulp.src(config.images.watch),
    cache(imagemin([
      imagemin.gifsicle(),
      imagemin.jpegtran(),
      imagemin.optipng(),
      imagemin.svgo(),
    ])),
    gulp.dest(config.images.destination),
  ], cb);
});

/* Language Tasks
 -------------------------------------------------- */
gulp.task('po-to-mo', function(cb) {
  pump([
    gulp.src(config.language.destination + '*.po'),
    potomo(),
    gulp.dest(config.language.destination),
  ], cb);
});

gulp.task('pot', function(cb) {
  pump([
    gulp.src(config.language.watch),
    checktextdomain({
      text_domain: config.language.domain,
      keywords: [
        '__:1,2d',
        '_e:1,2d',
        '_x:1,2c,3d',
        'esc_html__:1,2d',
        'esc_html_e:1,2d',
        'esc_html_x:1,2c,3d',
        'esc_attr__:1,2d',
        'esc_attr_e:1,2d',
        'esc_attr_x:1,2c,3d',
        '_ex:1,2c,3d',
        '_n:1,2,4d',
        '_nx:1,2,4c,5d',
        '_n_noop:1,2,3d',
        '_nx_noop:1,2,3c,4d',
      ],
    }),
    sort(),
    wpPot({
      domain: config.language.domain,
      lastTranslator: config.language.translator,
      team: config.language.team,
    }),
    gulp.dest(config.language.destination + config.language.domain + '.pot'),
  ], cb);
});

gulp.task('pot-to-po', function(cb) {
  pump([
    gulp.src(config.language.destination + '*.pot'),
    pottopo(),
    gulp.dest(config.language.destination),
  ], cb);
});

gulp.task('languages', gulp.series('pot', 'pot-to-po', 'po-to-mo'));

/* Version Task
 -------------------------------------------------- */
gulp.task('bump', function(cb) {
  var type = 'patch';
  ['prerelease','patch','minor','major'].some(function(arg) {
    if( !args[arg] )return;
    type = arg;
    return true;
  });
  pump([
    gulp.src(config.bump),
    bump({type:type,keys:['stable tag','version']}),
    gulp.dest('.'),
  ], cb);
});

/* Default Task
 -------------------------------------------------- */
gulp.task('default', gulp.parallel('images', 'languages'));
