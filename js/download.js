module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let pathlib = require( 'path' );
  let archiver = require( 'archiver' );

  let sendFileOptions = {
    dotfiles: 'allow'
  };

  let download = function( _req, _res ) {

    let path = decodeURI( _req.url.replace( /\/download(.*)/, '$1' ) );
    path = pathlib.join( process.cwd(), path );
    if ( /^\.\.\//.test( pathlib.relative( process.cwd(), path ) ) ) {
      _res.status( 400 ).send( 'invalid path' );
      return;
    }

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

      if ( _stat.isDirectory() ) {
        let zipPath = pathlib.join( process.cwd(), '.filet/temp', ( +new Date() ) + '.zip' );
        let out = fs.createWriteStream( zipPath );
        let zip = archiver( 'zip' );

        out.on( 'close', function() {
          _res.sendFile( zipPath, sendFileOptions, function( _error ) {
            if ( _error ) {
              _res.status( 500 ).send( 'something went wrong' );
              console.error( _error );
              return;
            }
            fs.unlink( zipPath );
          } );
        } );

        zip.on( 'error', function( _error ) {
          _res.status( 500 ).send( 'something went wrong' );
          console.error( _error );
        } );

        zip.pipe( out );

        let addRecursive = function( _path, _callback ) {
          if ( _path === zipPath ) {
            if ( typeof _callback === 'function' ) { _callback(); }
            return;
          }

          fs.stat( _path, function( _error, _stat ) {
            if ( _error ) {
              _res.status( 500 ).send( 'something went wrong' );
              console.error( _error );
              return;
            }

            if ( _stat.isDirectory() ) {
              fs.readdir( _path, function( _error, _files ) {
                if ( _error ) {
                  _res.status( 500 ).send( 'something went wrong' );
                  console.error( _error );
                  return;
                }

                let done = function() {
                  if ( _files.length === 0 ) {
                    if ( typeof _callback === 'function' ) { _callback(); }
                  } else {
                    let file = _files.shift();
                    addRecursive(
                      pathlib.join( _path, file ),
                      function() { done(); }
                    );
                  }
                };
                done();
              } );
            } else {
              zip.append(
                fs.createReadStream( _path ),
                { name: pathlib.relative( path, _path ) }
              );
              if ( typeof _callback === 'function' ) { _callback(); }
            }
          } );
        };

        addRecursive( path, function() {
          zip.finalize();
        } );

      } else {
        _res.sendFile( path, sendFileOptions, function( _error ) {
          if ( _error ) {
            _res.status( 500 ).send( 'something went wrong' );
            console.error( _error );
            return;
          }
        } );
      }

    } );

  };

  return download;

} )();
