let computeSize = function( _w0, _h0, _w1, _h1, _el ) {
  let x, y, w, h;

  if ( _w0 / _w1 < _h0 / _h1 ) {
    h = Math.min( _h1, _h0 );
    w = _w0 * h / _h0;
  } else {
    w = Math.min( _w1, _w0 );
    h = _h0 * w / _w0;
  }
  x = ( _w1 - w ) / 2;
  y = ( _h1 - h ) / 2;

  if ( _el ) {
    _el.style.left = x + 'px';
    _el.style.top = y + 'px';
    _el.style.width = w + 'px';
    _el.style.height = h + 'px';
  }

  return { x : x, y : y, w : w, h : h };
};

module.exports = computeSize;
