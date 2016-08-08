// ===================================================
// Author Notes
// ===================================================

// https://gist.github.com/davidhund/564331193e1085208d7e
// Add a title element child to the sprite's symbol
// Add a desc element child to the sprite's symbol
// <svg role="presentation">
//     <use xlink:href="sprite.svg#left-arrow"/>
// </svg>

// https://css-tricks.com/accessible-svgs
// https://css-tricks.com/svg-sprites-use-better-icon-fonts/

// ===================================================
// Setup
// ===================================================

var gulp            = require('gulp'),
    loadPlugins     = require('gulp-load-plugins'),
    $               = loadPlugins(),
    del             = require('del');

$.exec   = require('child_process').exec;
$.fs     = require('fs');


// ===================================================
// Config
// ===================================================

var asset_dir = {
  site: '.',
  icons: 'icons',
  svgs: 'src'
};

var path = {
  site: asset_dir.site,
  icons: asset_dir.icons + '/' + asset_dir.svgs
};


// ===================================================
// Server
// ===================================================

gulp.task('serve', function() {
  $.connect.server({
    root: path.site,
    port: 5000,
    livereload: true,
    middleware: function(connect) {
      return [
        connect().use(connect.query())
      ];
    }
  });

  $.exec('open http://localhost:5000');
});


// ===================================================
// SVG Sprite
// ===================================================

gulp.task('svgsprite', function() {

  var stream = gulp.src(path.icons + '/*.svg')
    .pipe($.svgmin({
      plugins: [{
        removeDoctype: true
      },
      {
        removeComments: true
      }]
    }))
    .pipe($.svgstore({
      inlineSvg: true
    }))
    .pipe($.rename('sprite.svg')) // must be run after svgstore pipe
    .pipe($.cheerio({
      run: function($) {
        $('svg').attr({
          'width' : '0',
          'height' : '0',
          'display' : 'none',
          'aria-hidden' : 'true'
        });
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(gulp.dest(asset_dir.icons));

    return stream;
});


// ===================================================
// Clean
// ===================================================

gulp.task('clean', function(cb) {
  del([asset_dir.icons + '/*.svg'], cb);
});


// ===================================================
// Monitor
// ===================================================

gulp.task('watch', function(cb) {
  $.livereload.listen();
  gulp.watch(path.site + '/*.html').on('change', $.livereload.changed);
});


// ===================================================
// Tasks
// ===================================================

gulp.task('default', ['serve', 'watch']);
