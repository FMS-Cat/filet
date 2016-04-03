module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let unlinkRecursive = require( './unlink-recursive' );

  let path = __dirname + '/../temp/';

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
    unlinkRecursive( path, function( _error ) {
      if ( _error ) {
        console.error( _error );
      }
    } );
    process.exit();
  };

  process.on( 'exit', onexit );
  process.on( 'SIGINT', onexit );

} )();
