module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let path = require( 'path' );
  let archiver = require( 'archiver' );

  let unlinkRecursive = function( _path, _callback ) {
    fs.stat( _path, function( _error, _stat ) {
      if ( _error ) {
        _res.status( 500 ).send( 'something goes wrong' );
        console.error( _error );
        return;
      }

      if ( !_stat.isDirectory() ) {
        fs.unlink( _path, _callback );
      } else {
        fs.readdir( _path, function( _error, _items ) {
          if ( _error ) {
            _res.status( 500 ).send( 'something goes wrong' );
            console.error( _error );
            return;
          }

          let done = function() {
            if ( _items.length === 0 ) {
              _callback();
            } else {
              let item = _items.shift();
              unlinkRecursive( item, done );
            }
          };
        } );
      }
    } );
  }

  let unlink = function( _req, _res ) {

    let dirPath = _req.body.path;
    if ( !dirPath ) {
      _res.status( 400 ).send( 'file path is required' );
      return;
    }
    dirPath = dirPath.replace( /\/$/, '' );
    dirPath = '.' + dirPath;
    dirPath = dirPath.replace( /\.{2,}/, '.' );

    fs.stat( dirPath, function( _error, _stat ) {
      if ( _error ) {
        if ( _error.code === 'ENOENT' ) {
          _res.status( 404 ).send( 'no such file or directory' );
        } else {
          _res.status( 500 ).send( 'something goes wrong' );
          console.error( _error );
        }
        return;
      }

      unlinkRecursive( dirPath, function() {
        _res.status( 200 ).send( 'done' );
      } );

    } );

  };

  return unlink;

} )();
