module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let path = require( 'path' );
  let archiver = require( 'archiver' );

  let browser = function( _req, _res ) {

    fs.readFile( __dirname + '/../index.html', 'utf8', function( _error, _data ) {
      if ( _error ) {
        _res.status( 500 ).send( 'something goes wrong' );
        console.error( _error );
        return;
      }

      let staticUrl = _req.protocol + '://' + _req.get( 'host' ) + '/static';
      let doc = _data.replace( /\$\$static\$\$/g, staticUrl );

      fs.stat( '.' + _req.url, function( _error, _stat ) {
        if ( _error ) {
          if ( _error.code === 'ENOENT' ) {
            _res.status( 404 ).send( 'no such file or directory' );
          } else {
            _res.status( 500 ).send( 'something goes wrong' );
            console.error( _error );
          }
          return;
        }

        doc += '\n<script>browser( \'' + _req.url + '\', ' + _stat.isDirectory() + ', true );</script>';
        _res.send( doc );
      } );
    } );

  };

  return browser;

} )();
