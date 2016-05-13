'use strict';

let fs = require( 'fs' );
let pathlib = require( 'path' );

let recursiveUnlink = function( _path, _callback ) {
  let callback = _callback || function() {};

  fs.stat( _path, function( _error, _stat ) {
    if ( _error ) {
      callback( _error );
      return;
    }

    if ( !_stat.isDirectory() ) {
      fs.unlink( _path, function() {
        callback( null );
      } );

    } else {
      fs.readdir( _path, function( _error, _items ) {
        if ( _error ) {
          callback( _error );
          return;
        }

        let done = function() {
          if ( _items.length === 0 ) {
            fs.rmdir( _path, function( _error ) {
              if ( _error ) {
                callback( _error );
                return;
              }

              callback( null );
            } );
          } else {
            let item = _items.shift();
            recursiveUnlink( pathlib.join( _path, item ), done );
          }
        };
        done();
      } );
    }
  } );
};

module.exports = recursiveUnlink;
