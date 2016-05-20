module.exports = function get( _params ) {

  let params = {
    'url': 'about:blank',
    'callback': function( _status, _data ) {},
    'responseType': 'text'
  };

  for ( let key in _params ) {
    params[ key ] = _params[ key ];
  }

  let xhr = new XMLHttpRequest();

  xhr.onload = function() {
    params.callback( xhr.status, xhr.response );
  }

  xhr.open( 'GET', params.url, true );
  xhr.responseType = params.responseType;
  xhr.send();

};
