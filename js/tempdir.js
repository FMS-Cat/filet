module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let pathlib = require( 'path' );
  let recursiveUnlink = require( './recursive-unlink' );

  let path = pathlib.join( __dirname, '/../temp/' );

  fs.stat( path, function( _error ) {
    let notfound = false;

    if ( _error ) {
      if ( _error.code === 'ENOENT' ) {
        notfound = true;
        fs.mkdirSync( path );
      } else {
        console.error( _error );
      }
    }
  } );

  let onexit = function() {
    recursiveUnlink( path, function( _error ) {
      if ( _error ) {
        console.error( _error );
      }
      process.exit();
    } );
  };

  process.on( 'exit', onexit );
  process.on( 'SIGINT', onexit );

} )();
