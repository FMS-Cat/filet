import post from './post';

let mkdir = ( _path, _name ) => {
  post( {
    'url': location.href.replace( /\/browser.*/, '/mkdir' ),
    'data': { 'path': _path, 'name': _name },
    'callback': ( _status, _data ) => {
      if ( _status === 200 ) {
        browser( null, true, true );
      }
    }
  } );
};

export default mkdir;
