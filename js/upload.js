module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let pathlib = require( 'path' );

  let upload = function( _req, _res ) {

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
          return _res.status( 404 ).send( 'no such directory' );
        } else {
          console.error( _error );
          return _res.status( 500 ).send( 'something went wrong' );
        }
      }

      if ( !_stat.isDirectory() ) {
        return _res.status( 400 ).send( 'you can only upload files to directory' );
      }

      let go = function() {
        if ( _req.files.length === 0 ) {
          return _res.status( 200 ).send();
        }

        let file = _req.files.shift();
        let name = pathlib.join( path, file.originalname );
        fs.rename( file.path, name, function( _error ) {
          if ( _error ) {
            console.error( _error );
            return _res.status( 500 ).send( 'something went wrong' );
          }
          go();
        } );
      };

      go();

    } );

  };

  return upload;

} )();
