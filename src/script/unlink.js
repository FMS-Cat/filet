import post from './post';

let unlink = ( _path ) => {
  post( {
    'url': location.href.replace( /\/browser.*/, '/unlink' ),
    'data': { 'path': _path },
    'callback': ( _status ) => {
      if ( _status === 200 ) {
        browser( null, true, true );
      }
    }
  } );
};

export default post;
