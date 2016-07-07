import el from './el';
import Balloon from './balloon';

import post from './post';

let upload = ( _path, _files ) => {
  let balloon = new Balloon( {
    title: 'Uploading',
    message: 'Progress: calculating',
    hold: true
  } );

  post( {
    url: location.href.replace( /\/browser.*/, '/upload' ),
    data: {
      path: _path,
      files: _files
    },
    uploadProgress: ( _event ) => {
      if ( _event.lengthComputable ) {
        let prog = ( _event.loaded / _event.total * 100.0 ).toFixed( 1 );
        balloon.set( {
          message: 'Progress: ' + prog + ' %',
          background: '#08d'
        } );
      }
    },
    callback: ( _status, _data ) => {
      if ( _status === 200 ) {
        if ( window.history.state.path === _path ) {
          balloon.set( {
            title: 'Done!',
            message: 'Progress: 100.0 %',
            background: '#1c7',
            timeout: 1,
            hold: false
          } );
          browser( null, true, true );
        }
      }
    }
  } );
};

export default upload;
