module.exports = ( function() {

  'use strict';

  let selectIcon = function( _name ) {

    if ( _name.match( /\.(htm|html|xml)$/ ) ) {
      return 'xml.svg';
    } else if ( _name.match( /\.(js)$/ ) ) {
      return 'js.svg';
    } else if ( _name.match( /\.(json)$/ ) ) {
      return 'json.svg';
    } else if ( _name.match( /\.(jpg|jpeg)$/ ) ) {
      return 'jpg.svg';
    } else if ( _name.match( /\.(zip|rar|gz|7z)$/ ) ) {
      return 'zip.svg';
    } else {
      return 'default.svg';
    }

  };

  return selectIcon;

} )();
