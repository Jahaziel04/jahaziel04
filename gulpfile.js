var jade = require('gulp-jade');
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var stylus = require('gulp-stylus');
var nib = require('nib');
var minifyCSS = require('gulp-minify-css');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

var config = {
	styles: {
    	main: './src/main.styl',
    	watch: './src/**/*.styl',
    	output: './build/css'
  },
  	html: {
  		main: './src/*.jade',
  		watch: './src/**/*.jade'
  	},
  	scripts: {
  		main: './src/scripts/main.js',
  		watch: './src/scripts/**/*.js',
  		output: './build/js'
  	}

}

gulp.task('server', function() {
	gulp.src('./build')
		.pipe(webserver({
			host: '0.0.0.0',
			port: 8081,
			livereload: true
			}));
	});

gulp.task('build:html', function() {
	gulp.src(config.html.main)
		.pipe(jade({
			pretty: true
			}))
		.pipe(gulp.dest('./build'));
	});

gulp.task('build:css', function() {
	gulp.src(config.styles.main)
		.pipe(stylus({
			compress: true,
			use: nib(),
			'include css': true
			}))
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.styles.output));
	});

gulp.task('build:js', function() {
	return browserify(config.scripts.main)
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(config.scripts.output))
	});

gulp.task('watch', function() {
	gulp.watch(config.scripts.watch, ['build:js']);
	gulp.watch(config.styles.watch, ['build:css']);
	gulp.watch(config.html.watch, ['build:html']);

});



gulp.task('build', ['build:css','build:html','build:js','watch']);
gulp.task('default', ['server','build']);
