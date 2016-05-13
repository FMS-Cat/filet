let byteformat = function( _size ) {
  let prefix = [ ' B', ' KB', ' MB', ' GB', ' TB', ' PB' ];
  let exp = 0;
  let number = _size;

  while ( 1024.0 < number ) {
    number /= 1024.0;
    exp ++;
  }

  let numDisplay = exp === 0 ? number : number.toFixed( 1 );

  return numDisplay + prefix[ exp ];
};

module.exports = byteformat;
