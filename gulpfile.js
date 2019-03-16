var gulp = require('gulp');
var cleancss = require('gulp-cleancss');
const autoprefixer = require('gulp-autoprefixer');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var debug = require('gulp-debug');
var server = require('gulp-server-livereload');
var plumberNotifier = require('gulp-plumber-notifier');
const cache = require('gulp-cached');
const sassPartialsImported = require('gulp-sass-partials-imported');
var gcmq = require('gulp-group-css-media-queries');
var smartgrid = require('smart-grid');
//var pugInheritance = require('gulp-pug-inheritance');

var settings =  {
  filename: '_smart-grid',
  outputStyle: 'sass', /* less || scss || sass || styl */
  columns: 12, /* number of grid columns */
  offset: '30px', /* gutter width px || % || rem */
  mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
  container: {
      maxWidth: '1200px', /* max-width оn very large screen */
      fields: '30px' /* side fields */
  },
  breakPoints: {
      lg: {
          width: '1100px', /* -> @media (max-width: 1100px) */
      },
      md: {
          width: '960px'
      },
      sm: {
          width: '780px',
          fields: '15px' /* set fields only if you want to change container.fields */
      },
      xs: {
          width: '560px'
      }
      /*
      We can create any quantity of break points.

      some_name: {
          width: 'Npx',
          fields: 'N(px|%|rem)',
          offset: 'N(px|%|rem)'
      }
      */
  }
};

gulp.task('webserver', function() {
  gulp.src('./dist')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('default',async function(){
	console.log('Hello');
});

gulp.task('imgCopy', async function(){
	gulp.src('./app/img/*')
	.pipe(cache('images'))
	.pipe(gulp.dest('./dist/img/'));
});

gulp.task('jsBuild', async function(){
	gulp.src('./app/src/*.js')
	.pipe(cache('js'))
	.pipe(debug())
	.pipe(gulp.dest('./dist/src/'));
});

gulp.task('htmlBuild', async function buildHTML() {
  return gulp.src('./app/*.pug')
  .pipe(plumberNotifier())
  .pipe(pug( {
  	pretty: true
  }))
   .pipe(gulp.dest('./dist/'))
});

gulp.task('cssBuild', async function(){
	gulp.src('./app/scss/*.sass')
	.pipe(debug())
	.pipe(plumberNotifier())
	.pipe(cache('sass'))
	.pipe(sassPartialsImported('./app/scss/', './app/scss_parts/*.sass'))
	.pipe(sass())
  .pipe(gcmq())
	.pipe(cleancss({keepBreaks: true}))
	.pipe(autoprefixer({
		browsers: ['last 20 versions'],
		cascase: false
	}))
	.pipe(gulp.dest('./dist/css/'))
});

gulp.task('gridBuild', async function(){
  smartgrid('./app/scss/', settings);
})

gulp.task('watcher', async function(){
	gulp.watch('./app/img/*', gulp.series('imgCopy'));
	gulp.watch('./app/src/*.js', gulp.series('jsBuild'));
	gulp.watch(['./app/*.pug', './app/partials/*.pug'], gulp.series('htmlBuild'));
	gulp.watch('./app/scss/*.sass', gulp.series('cssBuild'));
});

gulp.task('serve', gulp.parallel('watcher', 'webserver'));
