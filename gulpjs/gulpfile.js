'use strict';

const gulp = require('gulp'),
	  sass = require('gulp-sass'),
	  sourcemaps = require('gulp-sourcemaps'),
	  debug = require('gulp-debug'),
	  autoprefixer = require('gulp-autoprefixer'),
	  cleanCSS = require('gulp-clean-css'),
	  notify = require("gulp-notify"),
	  plumber = require('gulp-plumber'),
	  rename = require("gulp-rename"),
	  uglify = require('gulp-uglify');

gulp.task('sass', function() {
	return gulp.src('../sass/**/*.scss')
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'sass',
					message: err.message
				}
			})
		}))
		.pipe(sourcemaps.init())
		.pipe(debug({title: 'title_src'}))
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(debug({title: 'title_sass'}))
		.pipe(sourcemaps.write())
		.pipe(autoprefixer(['last 10 versions']))
		.pipe(gulp.dest('../css/'))
});

gulp.task('css-minify', function() {
	return gulp.src('../css/style.css')
		.pipe(cleanCSS())
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('../css/'))
});

gulp.task('js-minify', function() {
	return gulp.src('../js/global.js')
		.pipe(uglify())
		.pipe(rename('global.min.js'))
		.pipe(gulp.dest('../js/'))
});

gulp.task('watch', function() {
	gulp.watch('../sass/**/*.*', gulp.series('sass', 'css-minify'));
	gulp.watch('../js/global.js', gulp.series('js-minify'));
});

gulp.task('build', gulp.series('sass', 'css-minify', 'js-minify', 'watch'));

gulp.task('default', gulp.series('build'));
