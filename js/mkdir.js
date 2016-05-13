module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let pathlib = require( 'path' );
  let recursiveUnlink = require( './recursive-unlink' );

  let unlink = function( _req, _res ) {

    let path = _req.body.path;
    if ( !path ) {
      return _res.status( 400 ).send( 'file path is required' );
    }
    path = pathlib.join( process.cwd(), path );
    if ( /^\.\.\//.test( pathlib.relative( process.cwd(), path ) ) ) {
      return _res.status( 400 ).send( 'invalid path' );
    }

    fs.stat( path, function( _error, _stat ) {
      if ( _error ) {
        if ( _error.code === 'ENOENT' ) {
          return _res.status( 400 ).send( 'no such directory' );
        } else {
          console.error( _error );
          return _res.status( 500 ).send( 'something went wrong' );
        }
      }

      if ( !_stat.isDirectory() ) {
        return _res.status( 400 ).send( 'given path is not directory' );
      }

      let name = _req.body.name;
      if ( !name ) {
        return _res.status( 400 ).send( 'dirname is required' );
      }
      if ( /\//.test( name ) ) {
        return _res.status( 400 ).send( 'invalid dirname' );
      }

      fs.mkdir( pathlib.join( path, name ), function( _error ) {
        if ( _error ) {
          console.error( _error );
          return _res.status( 500 ).send( 'something went wrong' );
        }
        _res.status( 200 ).send();
      } );

    } );

  };

  return unlink;

} )();
