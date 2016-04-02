( function() {

  'use strict';

  let express = require( 'express' );
  let app = express();
  let multer = require( 'multer' );
  let upload = multer();

  app.post( '/list', upload.array(), require( './js/list' ) );
  app.post( '/property', upload.array(), require( './js/property' ) );
  app.post( '/download', upload.array(), require( './js/download' ) );
  app.post( '/upload', upload.array( 'files' ), require( './js/upload' ) );
  app.use( '/browser', require( './js/browser' ) );
  app.use( '/file', express.static( './' ) );
  app.use( '/static', express.static( __dirname + '/dist' ) );

  let port = process.env.PORT || 3000;
  app.listen( port );
  console.log( '🐟 < Hi, I am filet' );
  console.log( '🐟 < listening @ port ' + port );

} )();
