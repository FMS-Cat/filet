module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let pathlib = require( 'path' );
  let archiver = require( 'archiver' );

  let browser = function( _req, _res ) {

    fs.readFile( pathlib.join( __dirname, '../index.html' ), 'utf8', function( _error, _data ) {
      if ( _error ) {
        _res.status( 500 ).send( 'something goes wrong' );
        console.error( _error );
        return;
      }

      let path = _req.url;
      path = decodeURI( path );

      let staticUrl = _req.protocol + '://' + _req.get( 'host' ) + '/static';
      let doc = _data.replace( /\$\$static\$\$/g, staticUrl );

      fs.stat( pathlib.join( process.cwd(), path ), function( _error, _stat ) {
        if ( _error ) {
          if ( _error.code === 'ENOENT' ) {
            _res.status( 404 ).send( 'no such file or directory' );
          } else {
            _res.status( 500 ).send( 'something goes wrong' );
            console.error( _error );
          }
          return;
        }

        doc += '\n<script>browser( \'' + path + '\', ' + _stat.isDirectory() + ', false );</script>';
        _res.send( doc );
      } );
    } );

  };

  return browser;

} )();
