module.exports = ( function() {

  'use strict';

  let DnD = function( _props ) {

    // _props: { element, enter, leave, drop }

    // Ref: http://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
    let editorDragCounter = 0;

    let dragenter = function( _event ) {
      _event.preventDefault();
      _event.stopPropagation();

      if ( editorDragCounter === 0 ) {
        if ( typeof _props.enter === 'function' ) {
          _props.enter( _event );
        }
      }

      editorDragCounter ++;
    };
    _props.element.addEventListener( 'dragenter', dragenter );

    let dragover = function( _event ) {
      _event.preventDefault();
      _event.stopPropagation();
    };
    _props.element.addEventListener( 'dragover', dragover );

    let dragleave = function( _event ) {
      _event.preventDefault();
      _event.stopPropagation();

      editorDragCounter --;

      if ( editorDragCounter === 0 ) {
        if ( typeof _props.leave === 'function' ) {
          _props.leave( _event );
        }
      }
    };
    _props.element.addEventListener( 'dragleave', dragleave );

    let drop = function( _event ) {
      _event.preventDefault();
      _event.stopPropagation();

      editorDragCounter = 0;
      if ( typeof _props.drop === 'function' ) {
        _props.drop( _event );
      }
    };
    _props.element.addEventListener( 'drop', drop );

    return function() {
      _props.element.removeEventListener( 'dragenter', dragenter );
      _props.element.removeEventListener( 'dragover', dragover );
      _props.element.removeEventListener( 'dragleave', dragleave );
      _props.element.removeEventListener( 'drop', drop );
    };

  };

  return DnD;

} )();
