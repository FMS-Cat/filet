module.exports = ( function() {

  'use strict';

  let fs = require( 'fs' );
  let pathlib = require( 'path' );

  let pathDist = function( _a, _b ) {
    let path = pathlib.relative( _a, _b );
    if ( path.length === 0 ) {
      return 0;
    } else if ( /\.\./.test( path ) ) {
      return 65535;
    } else {
      return path.split( '/' ).length;
    }
  }

  let config = function( _callback ) {

    let configPath = pathlib.join( process.cwd(), '.filet/config' );
    fs.readFile( configPath, 'utf8', function( _error, _data ) {
      if ( _error ) {
        if ( _error.code === 'ENOENT' ) {
          let config = fs.openSync( configPath, 'w' );
          fs.writeFileSync( config, '{\n  "pr": ["/"]\n}' );
          fs.closeSync( config );
        } else {
          _callback( _error );
          return null;
        }
      }

      let data = _data || {};

      let exec = function( _path ) {
        let config = JSON.parse( data );

        let atts = [ 'pr', 'mr', 'pa', 'ma', 'pm', 'mm' ];
        let dists = atts.map( function( _att ) {
          let dist = 65535;
          if ( !config[ _att ] ) { return dist; }
          config[ _att ].map( function( _v ) {
            dist = Math.min( dist, pathDist( _v, _path ) );
          } );
          return dist;
        } );

        return {
          r: dists[ 0 ] < dists[ 1 ],
          a: dists[ 2 ] < dists[ 3 ],
          m: dists[ 4 ] < dists[ 5 ]
        };
      }

      _callback( null, exec );

    } );

  };

  return config;

} )();
