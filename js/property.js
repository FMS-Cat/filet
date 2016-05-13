module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let pathlib = require( 'path' );

  let property = function( _req, _res ) {

    let pathO = decodeURI( _req.url.replace( /\/property(.*)/, '$1' ) );
    let path = pathlib.join( process.cwd(), pathO );
    if ( /^\.\.\//.test( pathlib.relative( process.cwd(), path ) ) ) {
      _res.status( 400 ).send( 'invalid path' );
      return;
    }

    let ret = {};

    fs.stat( path, function( _error, _stat ) {
      if ( _error ) {
        if ( _error.code === 'ENOENT' ) {
          _res.status( 404 ).send( 'no such file or directory' );
        } else {
          _res.status( 500 ).send( 'something went wrong' );
          console.error( _error );
        }
        return;
      }

      let dir = 0;
      if ( _stat.isDirectory() ) {
        dir = 1;
      }

      let ret = {
        name: pathlib.basename( pathO ),
        path: pathO,
        dir: dir,
        stats: _stat
      };

      _res.send( JSON.stringify( ret ) );
    } );

  };

  return property;

} )();
