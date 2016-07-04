let post = ( _params ) => {

  let params = {
    'url': 'about:blank',
    'data': {},
    'uploadProgress': ( _event ) => {},
    'callback': ( _status, _data ) => {},
    'responseType': 'text'
  };

  for ( let key in _params ) {
    params[ key ] = _params[ key ];
  }

  let formData = new FormData();
  for ( let key in params.data ) {
    if (
      typeof params.data[ key ] === 'object'
      && params.data[ key ].length
    ) {
      for ( let iFile = 0; iFile < params.data[ key ].length; iFile ++ ) {
        formData.append( key, params.data[ key ][ iFile ] );
      }
    } else {
      formData.append( key, params.data[ key ] );
    }
  }

  let xhr = new XMLHttpRequest();

  xhr.addEventListener( 'load', () => {
    params.callback( xhr.status, xhr.response );
  } );

  xhr.upload.addEventListener( 'progress', params.uploadProgress );

  xhr.open( 'POST', params.url, true );
  xhr.responseType = params.responseType;
  xhr.send( formData );

};


export default post;
