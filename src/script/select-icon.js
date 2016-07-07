let selectIcon = ( _name ) => {

  if ( _name.match( /\.(txt)$/ ) ) {
    return 'text.svg';
  } else if ( _name.match( /\.(md)$/ ) ) {
    return 'md.svg';
  } else if ( _name.match( /\.(htm|html|xml)$/ ) ) {
    return 'xml.svg';
  } else if ( _name.match( /\.(js)$/ ) ) {
    return 'js.svg';
  } else if ( _name.match( /\.(json)$/ ) ) {
    return 'json.svg';
  } else if ( _name.match( /\.(jpg|jpeg|png|gif|bmp|tif|tiff)$/ ) ) {
    return 'image.svg';
  } else if ( _name.match( /\.(wav|wv|mp3|ogg|flac)$/ ) ) {
    return 'audio.svg';
  } else if ( _name.match( /\.(avi|wmv|mpeg|mpg|mp4|webm|flv|mov)$/ ) ) {
    return 'video.svg';
  } else if ( _name.match( /\.(zip|rar|gz|7z)$/ ) ) {
    return 'archive.svg';
  } else {
    return 'default.svg';
  }

};

export default selectIcon;
