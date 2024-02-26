/**
 * Define extensions, paths
 */

 const gulp = require( 'gulp' ),
 babel = require('gulp-babel'),
 eslint = require('gulp-eslint'),
 sass = require( 'gulp-sass' ),
 sourcemaps = require( 'gulp-sourcemaps'),
 autoprefixer = require( 'gulp-autoprefixer' ),
 cssnano = require( 'gulp-cssnano' ),
 concat = require( 'gulp-concat' ),
 fs = require('fs'),
 uglify = require( 'gulp-uglify' ),
 rename = require( 'gulp-rename' ),
 notify = require( 'gulp-notify' ),
 imagemin = require( 'gulp-imagemin' ),
 plumber = require('gulp-plumber'),
 path = {
     WATCH_APP_JS: ['assets/js/*.js'],
     WATCH_VENDOR_JS: ['assets/vendor/*.js'],
     WATCH_CSS: ['assets/sass/*.scss'],
     APP_JS: 'assets/js/',
     VENDOR_JS: 'assets/vendor/',
     CSS: 'assets/sass/',
     IMG: 'assets/img/',
     BUILD: 'assets/build',
     BUILD_CSS: [ 'assets/build/*.css'],
     BUILD_JS: [ 'assets/build/*.js'],
     DIST: 'assets/dist'
 };

/**
* Development Tasks
*/

// Compile Sass files
gulp.task( 'sass', function() {
 gulp.src( [ path.CSS + '*.scss', path.CSS + '**/*.scss' ] )
     .pipe( plumber() )
     .pipe( sourcemaps.init() )
     .pipe( sass()
         .on( 'error', notify.onError( {
             message: 'Sass failed. Check console for errors'
         } ) )
         .on( 'error', sass.logError ) )
     .pipe( autoprefixer() )
     .pipe( sourcemaps.write() )
     .pipe( gulp.dest( path.BUILD ) )
     .pipe( notify( 'Sass successfully compiled' ) );
} );

// Lint JS
gulp.task('lint', function () {
 gulp.src([path.APP_JS + '*.js', path.APP_JS + '**/*.js', '!' + path.APP_JS] )
     .pipe(plumber())
     .pipe(eslint())
     .pipe(eslint.format());
});

// Compile App JS
gulp.task( 'app_js', /*[ 'lint' ],*/ function() {
 gulp.src(path.WATCH_APP_JS)
     .pipe( plumber() )
     .pipe(babel({ presets: ['@babel/env']}) )
     .pipe( sourcemaps.init() )
     .pipe( concat( 'app_scripts.js' ) )
     .pipe( sourcemaps.write() )
     .pipe( gulp.dest( path.BUILD ) )
     .pipe( notify( 'App JS successfully compiled' ) );
} );

// Compile Vendor JS
gulp.task('vendor_js', function () {
	gulp.src(path.WATCH_VENDOR_JS)
		.pipe( plumber() )
		.pipe(sourcemaps.init())
		.pipe(concat('vendor_scripts.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.BUILD))
		.pipe(notify('Vendor JS successfully compiled'));
});

// Default
gulp.task( 'default', [ 'sass', 'app_js', 'vendor_js' ] );

/**
* Production Tasks
*/

// Concatenate, minify, move style files
gulp.task( 'buildCss', function() {
 gulp.src( [ path.BUILD + '/*.css' ] )
     .pipe( plumber() )
     .pipe( rename({ suffix: '.min' }) )
     .pipe( cssnano( { safe: true } ) )
     .pipe( gulp.dest( path.DIST ) );
} );

// Concatenate, minify, move script files
gulp.task( 'buildJs', function() {
 gulp.src( [ path.BUILD + '/*.js' ] )
     .pipe( plumber() )
     .pipe( rename({ suffix: '.1.0.min' }) )
     .pipe( uglify() )
     .pipe( gulp.dest( path.DIST ) );
} );

// Optimize images
gulp.task( 'compressImgs', function() {
 return gulp.src( [ path.IMG + '*.*'] )
     .pipe( plumber() )
     .pipe( imagemin() )
     .pipe( gulp.dest( path.IMG ) );
} );

// Build tasks
gulp.task( 'watch', function() {
 gulp.watch( path.WATCH_APP_JS, [ 'app_js' ] );
 gulp.watch( path.WATCH_VENDOR_JS, ['vendor_js']);
 gulp.watch( path.WATCH_CSS, [ 'sass' ] );
 gulp.watch( path.BUILD_JS.concat(path.BUILD_CSS), [ 'prod' ] );
} );

gulp.task( 'stage', [ 'buildCss', 'buildJs' ] );
gulp.task( 'prod', [ 'buildCss', 'buildJs', 'compressImgs', 'assetVersion' ] );

gulp.task( 'assetVersion', function(cb) {
 fs.writeFile( 'version.php', `<?php\n\ndefine( 'TL_ASSET_VERSION', ${Math.floor(Date.now() / 1000)} );`, cb );
} );
