( function() {

  'use strict';

  let express = require( 'express' );
  let app = express();
  let multer = require( 'multer' );

  app.post( '/list', multer().array(), require( './js/list' ) );
  app.post( '/property', multer().array(), require( './js/property' ) );
  app.post( '/download', multer().array(), require( './js/download' ) );
  app.use( '/browser', require( './js/browser' ) );
  app.use( '/file', express.static( './' ) );
  app.use( '/static', express.static( __dirname + '/dist' ) );

  let port = process.env.PORT || 3000;
  app.listen( port );
  console.log( '🐟 < Hi, I am filet' );
  console.log( '🐟 < listening @ port ' + port );

} )();
