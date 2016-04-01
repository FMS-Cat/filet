( function() {

  'use strict';

  let gulp = require( 'gulp' );

  let fs = require( 'fs' );

  let browserify = require( 'browserify' );
  let watchify = require( 'watchify' );
  let babelify = require( 'babelify' );
  let sass = require( 'gulp-sass' );
  let source = require( 'vinyl-source-stream' );

  let browserSync = require( 'browser-sync' );

  let server = require( 'gulp-develop-server' );

  // ---

  gulp.task( 'style-build', function() {
    return gulp.src( './src/style/main.scss' )
    .pipe( sass().on( 'error', sass.logError ) )
    .pipe( gulp.dest( './dist' ) )
    .pipe( browserSync.stream() )
  } );

  gulp.task( 'style-watch', function() {
    gulp.watch( './src/style/**', [ 'style-build' ] );
  } );

  // ---

  let brwsrfy = watchify( browserify( {
    'cache': {},
    'packageCache': {},
    'fullPaths': true,
    'entries': [ './src/script/main.js' ],
    'transform': [
      [ babelify, {
        'presets': 'es2015'
      } ]
    ]
  } ) );

  let bundle = function() {
    console.log( '🔮 Browserify!' );
    brwsrfy.bundle()
    .on( 'error', function( _error ) {
      console.error( _error );
      this.emit( 'end' );
    } )
    .pipe( source( 'main.js' ) )
    .pipe( gulp.dest( './dist' ) );
  };

  brwsrfy.on( 'log', function( _log ) {
    console.log( '🍕 ' + _log );
  } );

  gulp.task( 'script-build', function() {
    bundle();
  } );

  gulp.task( 'script-watch', function() {
    brwsrfy.on( 'update', function() {
      bundle();
    } );
  } );

  // ---

  gulp.task( 'html-copy', function() {
    gulp.src( './src/*.html' )
    .pipe( gulp.dest( 'dist' ) );
  } );

  gulp.task( 'html-watch', function() {
    gulp.watch( [ './src/*.html' ], [ 'html-copy' ] );
  } );

  // ---

  gulp.task( 'browser-init', function() {
    browserSync.init( {
      proxy: 'localhost:3000'
    } );
  } );

  gulp.task( 'browser-watch', function() {
    gulp.watch( [ './dist/**', '!./dist/**/*.css' ], function() {
      browserSync.reload();
    } );
  } );

  // ---

  gulp.task( 'node-start', function() {
    server.listen( { path: './index.js' } );
  } );

  gulp.task( 'node-restart', function() {
    server.restart();
  } );

  gulp.task( 'node-watch', function() {
    gulp.watch( [ './*', './js/**' ], [ 'node-restart' ] );
  } );

  // ---

  gulp.task( 'clean', function() {
    fs.unlink( './dist/main.css' );
    fs.unlink( './dist/main.js' );
  } );

  // ---

  gulp.task( 'watch', [
    'style-watch',
    'script-watch',
    'browser-watch',
    'node-watch'
  ] );

  gulp.task( 'build', [
    'style-build',
    'script-build'
  ] );

  gulp.task( 'dev', [
    'build',
    'node-start',
    'browser-init',
    'watch'
  ] );

  gulp.task( 'default', [
    'dev'
  ] );

} )();
