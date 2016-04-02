(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/browser.js":[function(require,module,exports){
'use strict';

module.exports = function () {

  'use strict';

  var post = require('./post');

  var list = require('./list');
  var property = require('./property');

  var browser = function browser(_path, _isDir, _dontPush) {
    if (!_dontPush) {
      window.history.pushState({ path: _path, isDir: _isDir }, null, location.href.replace(/\/browser.*/, '/browser') + _path);
    }

    if (_isDir) {
      post({
        'url': location.href.replace(/\/browser.*/, '/list'),
        'data': { 'path': _path },
        'responseType': 'text',
        'callback': function callback(_status, _data) {
          if (_status === 200) {
            list(JSON.parse(_data));
          }
        }
      });
    } else {
      post({
        'url': location.href.replace(/\/browser.*/, '/property'),
        'data': { 'path': _path },
        'responseType': 'text',
        'callback': function callback(_status, _data) {
          if (_status === 200) {
            property(JSON.parse(_data));
          }
        }
      });
    }
  };

  window.addEventListener('popstate', function (_event) {
    browser(_event.state.path, _event.state.isDir, true);
  });

  return browser;
}();

},{"./list":"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/list.js","./post":"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/post.js","./property":"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/property.js"}],"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/dnd.js":[function(require,module,exports){
'use strict';

module.exports = function () {

  var dnd = function dnd(_props) {

    // _props: { element, enter, leave, drop }

    // Ref: http://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
    var editorDragCounter = 0;

    _props.element.addEventListener('dragenter', function (_event) {
      _event.preventDefault();
      _event.stopPropagation();

      if (editorDragCounter === 0) {
        if (typeof _props.enter === 'function') {
          _props.enter(_event);
        }
      }

      editorDragCounter++;
    });

    _props.element.addEventListener('dragover', function (_event) {
      _event.preventDefault();
      _event.stopPropagation();
    });

    _props.element.addEventListener('dragleave', function (_event) {
      _event.preventDefault();
      _event.stopPropagation();

      editorDragCounter--;

      if (editorDragCounter === 0) {
        if (typeof _props.leave === 'function') {
          _props.leave(_event);
        }
      }
    });

    _props.element.addEventListener('drop', function (_event) {
      _event.preventDefault();
      _event.stopPropagation();

      editorDragCounter = 0;
      if (typeof _props.drop === 'function') {
        _props.drop(_event);
      }
    });
  };

  return dnd;
}();

},{}],"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/el.js":[function(require,module,exports){
'use strict';

module.exports = function () {

  'use strict';

  var el = function el(_props) {

    var element = document.createElement(_props.tag);
    delete _props.tag;

    if (_props.parent) {
      _props.parent.appendChild(element);
    }
    delete _props.parent;

    if (_props.class) {
      if (Array.isArray(_props.class)) {
        _props.class.map(function (_cl) {
          element.classList.add(_cl);
        });
      } else {
        element.classList.add(_props.class);
      }
    }
    delete _props.class;

    for (var key in _props) {
      element[key] = _props[key];
    }

    return element;
  };

  return el;
}();

},{}],"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/list.js":[function(require,module,exports){
'use strict';

module.exports = function () {

  'use strict';

  var el = require('./el');
  var selectIcon = require('./select-icon');
  var dnd = require('./dnd');
  var post = require('./post');

  var list = function list(_data) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // ---

    var list = el({
      tag: 'div',
      parent: container,
      id: 'list'
    });

    // ---

    var current = el({
      tag: 'div',
      parent: list,
      id: 'current',
      innerText: _data.path
    });

    // ---

    var items = el({
      tag: 'div',
      parent: list,
      id: 'items'
    });

    _data.items.map(function (_item) {

      var onclick = function onclick() {
        var path = _item.path.substring(1) + '/' + _item.name;
        browser(path, !!_item.dir);
      };

      // ---

      var item = el({
        tag: 'div',
        parent: items,
        class: 'item'
      });

      var icon = el({
        tag: 'img',
        parent: item,
        class: 'icon',
        src: function () {
          var staticIcon = location.href.replace(/\/browser.*/, '/static/icon/');
          if (_item.dir) {
            return staticIcon + 'dir.svg';
          } else {
            return staticIcon + selectIcon(_item.name);
          }
        }()
      });

      var name = el({
        tag: 'a',
        parent: item,
        class: 'filename',
        onclick: onclick,
        innerText: _item.name
      });

      var date = new Date(_item.stats.birthtime);
      var dateSpan = el({
        tag: 'span',
        parent: item,
        class: 'date',
        innerText: date.toLocaleString()
      });
    });

    // ---

    var uploadBg = el({
      tag: 'div',
      parent: container,
      class: 'uploadBg'
    });

    var uploadIcon = el({
      tag: 'img',
      parent: container,
      class: 'uploadIcon',
      src: location.href.replace(/\/browser.*/, '/static/image/upload.svg')
    });

    dnd({
      element: container,
      enter: function enter() {
        uploadBg.classList.add('on');
        uploadBg.classList.remove('off');
        uploadIcon.classList.add('on');
        uploadIcon.classList.remove('off');
        uploadIcon.classList.remove('drop');
      },
      leave: function leave() {
        uploadBg.classList.remove('on');
        uploadBg.classList.add('off');
        uploadIcon.classList.remove('on');
        uploadIcon.classList.add('off');
      },
      drop: function drop(_event) {
        uploadBg.classList.remove('on');
        uploadBg.classList.add('off');
        uploadIcon.classList.remove('on');
        uploadIcon.classList.add('drop');

        post({
          url: location.href.replace(/\/browser.*/, '/upload'),
          data: {
            path: _data.path,
            files: _event.dataTransfer.files
          }
        });
      }
    });
  };

  return list;
}();

},{"./dnd":"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/dnd.js","./el":"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/el.js","./post":"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/post.js","./select-icon":"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/select-icon.js"}],"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/main.js":[function(require,module,exports){
'use strict';

(function () {

  'use strict';

  // ------

  var browser = require('./browser');
  window.browser = browser;
})();

},{"./browser":"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/browser.js"}],"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/post.js":[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

module.exports = function () {

  var post = function post(_params) {

    var params = {
      'url': 'about:blank',
      'data': {},
      'callback': function callback(_status, _data) {},
      'responseType': 'text'
    };

    for (var key in _params) {
      params[key] = _params[key];
    }

    var formData = new FormData();
    for (var _key in params.data) {
      if (_typeof(params.data[_key]) === 'object' && params.data[_key].length) {
        for (var iFile = 0; iFile < params.data[_key].length; iFile++) {
          formData.append(_key, params.data[_key][iFile]);
        }
      } else {
        formData.append(_key, params.data[_key]);
      }
    }

    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
      params.callback(xhr.status, xhr.response);
    };

    xhr.open('POST', params.url, true);
    xhr.responseType = params.responseType;
    xhr.send(formData);
  };

  return post;
}();

},{}],"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/property.js":[function(require,module,exports){
'use strict';

module.exports = function () {

  'use strict';

  var property = function property(_item) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    var div = document.createElement('div');
    container.appendChild(div);
    div.innerText = JSON.stringify(_item);

    var down = document.createElement('a');
    container.appendChild(down);
    down.href = location.href.replace(/\/browser/, '/file');
    down.innerText = 'download';
  };

  return property;
}();

},{}],"/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/select-icon.js":[function(require,module,exports){
'use strict';

module.exports = function () {

  'use strict';

  var selectIcon = function selectIcon(_name) {

    if (_name.match(/\.(htm|html|xml)$/)) {
      return 'xml.svg';
    } else if (_name.match(/\.(js)$/)) {
      return 'js.svg';
    } else if (_name.match(/\.(json)$/)) {
      return 'json.svg';
    } else if (_name.match(/\.(jpg|jpeg|png|gif|bmp|tif|tiff)$/)) {
      return 'image.svg';
    } else if (_name.match(/\.(wav|wv|mp3|ogg|flac)$/)) {
      return 'audio.svg';
    } else if (_name.match(/\.(avi|wmv|mpeg|mpg|mp4|webm|flv|mov)$/)) {
      return 'video.svg';
    } else if (_name.match(/\.(zip|rar|gz|7z)$/)) {
      return 'archive.svg';
    } else {
      return 'default.svg';
    }
  };

  return selectIcon;
}();

},{}]},{},["/Users/Yutaka/Dropbox/pro/JavaScript/_nodejs/filet/src/script/main.js"]);
