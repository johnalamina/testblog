/*
 * zClip :: jQuery ZeroClipboard v1.1.5
 * Originally forked from: http://steamdev.com/zclip
 *
 * Copyright 2011, SteamDev
 *
 * Released under the MIT license.
 * https://github.com/patricklodder/jquery-zclip/blob/master/LICENSE
 */

(function (jQuery) {

    jQuery.fn.zclip = function (params) {

        if (typeof params == "object" && !params.length) {

            var settings = jQuery.extend({}, ZeroClipboard.defaults, params);

            return this.each(function () {

                var o = jQuery(this);

                if (o.is(':visible') && (typeof settings.copy == 'string' || jQuery.isFunction(settings.copy))) {

                    ZeroClipboard.setMoviePath(settings.path);
                    var clip = new ZeroClipboard.Client();

                    if (jQuery.isFunction(settings.copy)) {
                        o.bind('zClip_copy', settings.copy);
                    }

                    if (jQuery.isFunction(settings.beforeCopy)) {
                        o.bind('zClip_beforeCopy', settings.beforeCopy);
                    }

                    if (jQuery.isFunction(settings.afterCopy)) {
                        o.bind('zClip_afterCopy', settings.afterCopy);
                    }

                    clip.setHandCursor(settings.setHandCursor);

                    clip.setCSSEffects(settings.setCSSEffects);

                    clip.addEventListener('mouseOver', function (client) {
                        o.trigger('mouseenter');
                    });

                    clip.addEventListener('mouseOut', function (client) {
                        o.trigger('mouseleave');
                    });

                    clip.addEventListener('mouseDown', function (client) {

                        o.trigger('mousedown');

                        if (jQuery.isFunction(settings.beforeCopy)) {
                            o.trigger('zClip_beforeCopy');
                        }

                        if (!jQuery.isFunction(settings.copy)) {
                            clip.setText(settings.copy);
                        } else {
                            clip.setText(o.triggerHandler('zClip_copy'));
                        }

                    });

                    clip.addEventListener('complete', function (client, text) {

                        if (jQuery.isFunction(settings.afterCopy)) {

                            o.trigger('zClip_afterCopy');

                        } else {
                            if (text.length > 500) {
                                text = text.substr(0, 500) + "...\n\n(" + (text.length - 500) + " characters not shown)";
                            }

                            o.removeClass('hover');
                            alert("Copied text to clipboard:\n\n " + text);
                        }

                        if (settings.clickAfter) {
                            o.trigger('click');
                        }

                    });

                    clip.glue(o[0], o.parent()[0]);

                    jQuery(window).bind('load resize', function () {clip.reposition();});

                }

            });

        } else if (typeof params == "string") {

            return this.each(function () {

                var o = jQuery(this);

                params = params.toLowerCase();
                var zclipId = o.data('zclipId');
                var clipElm = jQuery('#' + zclipId + '.zclip');
                var clientId = clipElm.attr('id').replace(/^.*_/g, '') || null;

                if (params == "remove") {

                    clipElm.remove();
                    o.removeClass('active hover');
                    o.unbind('zClip_copy');
                    o.unbind('zClip_beforeCopy');
                    o.unbind('zClip_afterCopy');
                    ZeroClipboard.unregister(clientId);

                } else if (params == "hide") {

                    clipElm.hide();
                    o.removeClass('active hover');

                } else if (params == "show") {

                    clipElm.show();

                }

            });

        }

    };

})(jQuery);

// ZeroClipboard
// Simple Set Clipboard System
// Author: Joseph Huckaby
var ZeroClipboard = {

    version: "1.0.7",
    clients: {},
    // registered upload clients on page, indexed by id
    moviePath: 'ZeroClipboard.swf',
    // URL to movie
    nextId: 1,
    // ID of next movie

    defaults: {
        path: 'ZeroClipboard.swf',
        clickAfter: true,
        setHandCursor: true,
        setCSSEffects: true,

        copy: null,
        // a string or function that returns string

        beforeCopy: null,
        afterCopy: null
    },

    jQuery: function (thingy) {
        // simple DOM lookup utility function
        if (typeof(thingy) == 'string') thingy = document.getElementById(thingy);
        if (!thingy.addClass) {
            // extend element with a few useful methods
            thingy.hide = function () {
                // this.style.display = 'none';
            };
            thingy.show = function () {
                this.style.display = '';
            };
            thingy.addClass = function (name) {
                this.removeClass(name);
                this.className += ' ' + name;
            };
            thingy.removeClass = function (name) {
                var classes = this.className.split(/\s+/);
                var idx = -1;
                for (var k = 0; k < classes.length; k++) {
                    if (classes[k] == name) {
                        idx = k;
                        k = classes.length;
                    }
                }
                if (idx > -1) {
                    classes.splice(idx, 1);
                    this.className = classes.join(' ');
                }
                return this;
            };
            thingy.hasClass = function (name) {
                return !!this.className.match(new RegExp("\\s*" + name + "\\s*"));
            };
        }
        return thingy;
    },

    setMoviePath: function (path) {
        // set path to ZeroClipboard.swf
        this.moviePath = path;
    },

    dispatch: function (id, eventName, args) {
        // receive event from flash movie, send to client
        var client = this.clients[id];
        if (client) {
            client.receiveEvent(eventName, args);
        }
    },

    register: function (id, client) {
        // register new client to receive events
        this.clients[id] = client;
    },

    unregister: function (id) {
        if (typeof(id) === 'number' && this.clients.hasOwnProperty(id)) {
            delete this.clients[id];
        }
    },

    getDOMObjectPosition: function (obj, stopObj) {
        // get absolute coordinates for dom element
        var info = {
            left: 0,
            top: 0,
            width: obj.width ? obj.width : obj.offsetWidth,
            height: obj.height ? obj.height : obj.offsetHeight
        };

        if (obj && (obj != stopObj)) {
            info.left += obj.offsetLeft;
            info.top += obj.offsetTop;
        }

        return info;
    },

    Client: function (elem) {
        // constructor for new simple upload client
        this.handlers = {};

        // unique ID
        this.id = ZeroClipboard.nextId++;
        this.movieId = 'ZeroClipboardMovie_' + this.id;

        // register client with singleton to receive flash events
        ZeroClipboard.register(this.id, this);

        // create movie
        if (elem) this.glue(elem);
    }
};

ZeroClipboard.Client.prototype = {

    id: 0,
    // unique ID for us
    ready: false,
    // whether movie is ready to receive events or not
    movie: null,
    // reference to movie object
    clipText: '',
    // text to copy to clipboard
    handCursorEnabled: true,
    // whether to show hand cursor, or default pointer cursor
    cssEffects: true,
    // enable CSS mouse effects on dom container
    handlers: null,
    // user event handlers
    glue: function (elem, appendElem, stylesToAdd) {
        // glue to DOM element
        // elem can be ID or actual DOM element object
        this.domElement = ZeroClipboard.jQuery(elem);

        // float just above object, or zIndex 99 if dom element isn't set
        var zIndex = 99;
        if (this.domElement.style.zIndex) {
            zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
        }

        if (typeof(appendElem) == 'string') {
            appendElem = ZeroClipboard.jQuery(appendElem);
        } else if (typeof(appendElem) == 'undefined') {
            appendElem = document.getElementsByTagName('body')[0];
        }

        // find X/Y position of domElement
        var box = ZeroClipboard.getDOMObjectPosition(this.domElement, appendElem);

        // create floating DIV above element
        this.div = document.createElement('div');
        this.div.className = "zclip";
        this.div.id = "zclip-" + this.movieId;
        jQuery(this.domElement).data('zclipId', 'zclip-' + this.movieId);
        var style = this.div.style;
        style.position = 'absolute';
        style.left = '' + box.left + 'px';
        style.top = '' + box.top + 'px';
        style.width = '' + box.width + 'px';
        style.height = '' + box.height + 'px';
        style.zIndex = zIndex;

        if (typeof(stylesToAdd) == 'object') {
            for (var addedStyle in stylesToAdd) {
                style[addedStyle] = stylesToAdd[addedStyle];
            }
        }

        // style.backgroundColor = '#f00'; // debug
        appendElem.appendChild(this.div);

        this.div.innerHTML = this.getHTML(box.width, box.height);
    },

    getHTML: function (width, height) {
        // return HTML for movie
        var html = '';
        var flashvars = 'id=' + this.id + '&width=' + width + '&height=' + height;

        if (navigator.userAgent.match(/MSIE/)) {
            // IE gets an OBJECT tag
            var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
            html += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + protocol + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + width + '" height="' + height + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + flashvars + '"/><param name="wmode" value="transparent"/></object>';
        } else {
            // all other browsers get an EMBED tag
            html += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + width + '" height="' + height + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
        }
        return html;
    },

    hide: function () {
        // temporarily hide floater offscreen
        if (this.div) {
            this.div.style.left = '-2000px';
        }
    },

    show: function () {
        // show ourselves after a call to hide()
        this.reposition();
    },

    destroy: function () {
        // destroy control and floater
        if (this.domElement && this.div) {
            this.hide();
            this.div.innerHTML = '';

            var body = document.getElementsByTagName('body')[0];
            try {
                body.removeChild(this.div);
            } catch (e) {
                //do nothing
            }

            this.domElement = null;
            this.div = null;
        }
    },

    reposition: function (elem) {
        // reposition our floating div, optionally to new container
        // warning: container CANNOT change size, only position
        if (elem) {
            this.domElement = ZeroClipboard.jQuery(elem);
            if (!this.domElement) this.hide();
        }

        if (this.domElement && this.div) {
            var box = ZeroClipboard.getDOMObjectPosition(this.domElement);
            var style = this.div.style;
            style.left = '' + box.left + 'px';
            style.top = '' + box.top + 'px';
        }
    },

    setText: function (newText) {
        // set text to be copied to clipboard
        this.clipText = newText;
        if (this.ready) {
            this.movie.setText(newText);
        }
    },

    addEventListener: function (eventName, func) {
        // add user event listener for event
        // event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel
        eventName = eventName.toString().toLowerCase().replace(/^on/, '');
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        this.handlers[eventName].push(func);
    },

    setHandCursor: function (enabled) {
        // enable hand cursor (true), or default arrow cursor (false)
        this.handCursorEnabled = enabled;
        if (this.ready) {
            this.movie.setHandCursor(enabled);
        }
    },

    setCSSEffects: function (enabled) {
        // enable or disable CSS effects on DOM container
        this.cssEffects = !! enabled;
    },

    receiveEvent: function (eventName, args) {
        // receive event from flash
        eventName = eventName.toString().toLowerCase().replace(/^on/, '');

        // special behavior for certain events
        switch (eventName) {
        case 'load':
            // movie claims it is ready, but in IE this isn't always the case...
            // bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
            this.movie = document.getElementById(this.movieId);
            var self = this;

            if (!this.movie) {
                setTimeout(function () {
                    self.receiveEvent('load', null);
                }, 1);
                return;
            }

            // firefox on pc needs a "kick" in order to set these in certain cases
            if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                setTimeout(function () {
                    self.receiveEvent('load', null);
                }, 100);
                this.ready = true;
                return;
            }

            this.ready = true;
            try {
                this.movie.setText(this.clipText);
            } catch (e) {}
            try {
                this.movie.setHandCursor(this.handCursorEnabled);
            } catch (e) {}
            break;

        case 'mouseover':
            if (this.domElement && this.cssEffects) {
                this.domElement.addClass('hover');
                if (this.recoverActive) {
                    this.domElement.addClass('active');
                }

            }
            break;

        case 'mouseout':
            if (this.domElement && this.cssEffects) {
                this.recoverActive = false;
                if (this.domElement.hasClass('active')) {
                    this.domElement.removeClass('active');
                    this.recoverActive = true;
                }
                this.domElement.removeClass('hover');

            }
            break;

        case 'mousedown':
            if (this.domElement && this.cssEffects) {
                this.domElement.addClass('active');
            }
            break;

        case 'mouseup':
            if (this.domElement && this.cssEffects) {
                this.domElement.removeClass('active');
                this.recoverActive = false;
            }
            break;
        } // switch eventName
        if (this.handlers[eventName]) {
            for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
                var func = this.handlers[eventName][idx];

                if (jQuery.isFunction(func)) {
                    // actual function reference
                    func(this, args);
                } else if ((typeof(func) == 'object') && (func.length == 2)) {
                    // PHP style object + method, i.e. [myObject, 'myMethod']
                    func[0][func[1]](this, args);
                } else if (typeof(func) == 'string') {
                    // name of function
                    window[func](this, args);
                }
            } // foreach event handler defined
        } // user defined handler for event
    }

};

this.JST = {"views/file": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li>\n    ' +
((__t = ( JST['views/thumbnail']({
        file: file
    }) )) == null ? '' : __t) +
'\n</li>\n';

}
return __p
},
"views/folder": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<li>\n    <div class="gallery-item with-controls folder">\n        <a href="#" data-navigate-directory="' +
__e( folder.id ) +
'">\n            <div class="content">\n                <div class="o">\n                    <div class="i">\n                        ';
 if (folder.parent) { ;
__p += '\n                            <i class="fa fa-level-up"></i>\n                        ';
 } else { ;
__p += '\n                            <i class="fa fa-folder"></i>\n                        ';
 } ;
__p += '\n                        <p class="filename">' +
__e( folder.name ) +
'</p>\n                    </div>\n                </div>\n            </div>\n        </a>\n        ';
 if (!folder.parent) { ;
__p += '\n            <div class="controls">\n                <div class="controls-inner">\n                    <div class="btn-group" role="group" aria-label="actions">\n                        <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="Edit" data-trigger="hover" data-edit-folder="' +
__e( folder.id ) +
'">\n                            <i class="fa fa-pencil"></i>\n                        </button>\n                        <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="Delete" data-trigger="hover" data-delete-folder=\'{ "id": ' +
__e( folder.id ) +
', "name": "' +
__e( folder.name ) +
'" }\'>\n                            <i class="fa fa-close"></i>\n                        </button>\n                    </div>\n                </div>\n            </div>\n        ';
 } ;
__p += '\n    </div>\n</li>';

}
return __p
},
"views/grid": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul>\n    ';
 _.each(folders, function(folder, i) { ;
__p += '\n        ' +
((__t = ( JST['views/folder']({ folder: folder }) )) == null ? '' : __t) +
'\n    ';
 }); ;
__p += '\n    ';
 _.each(files, function(file, i) { ;
__p += '\n        ' +
((__t = ( JST['views/file']({ file: file }) )) == null ? '' : __t) +
'\n    ';
 }); ;
__p += '\n</ul>';

}
return __p
},
"views/thumbnail": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {


    itemClasses = 'gallery-item';

    if (file.public_url) {
        itemClasses += ' with-controls image';
        image = file.public_url;
        if (!file.is_image) {
            itemClasses += ' file';
        } else if (file.thumbnail_public_url) {
            image = file.thumbnail_public_url;
        }
    } else {
        itemClasses += ' image-placeholder';
        image = '/hatchly-files/images/module/loader.gif';
    }
;
__p += '\n<div class="' +
__e( itemClasses ) +
'">\n    <div class="content" style="background-image: url(\'' +
__e( image ) +
'\');">\n        <div class="o">\n            <div class="i">\n                ';
 if (file.public_url) { ;
__p += '\n                    ';
 if (!file.is_image) { ;
__p += '\n                        <i class="fa fa-file"></i>\n                        ';
 
                            filename = file.name;
                            if (filename.length > 20) {
                                filename = file.name.substring(0, 20);
                            }
                        ;
__p += '\n                        <p class="filename">' +
__e( filename ) +
'</p>\n                    ';
 } else { ;
__p += '\n                        ' +
__e( file.name ) +
'\n                    ';
 } ;
__p += '\n                ';
 } ;
__p += '\n            </div>\n        </div>\n    </div>\n    ';
 if (file.public_url) { ;
__p += '\n        <div class="controls">\n            <div class="controls-inner">\n                <div class="btn-group" role="group" aria-label="actions">\n                    ';
 if ($('body').hasClass('page-hatchlyfilesfile-browser')) { ;
__p += '\n                        <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="Insert file" data-select-file="' +
__e( file.id ) +
'" data-trigger="hover">\n                            <i class="fa fa-link"></i>\n                        </button>\n                    ';
 } else { ;
__p += '\n                        <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="Copy link" data-copy="' +
__e( file.public_url ) +
'" data-trigger="hover">\n                            <i class="fa fa-link"></i>\n                        </button>\n                    ';
 } ;
__p += '\n                    <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="Edit" data-trigger="hover" data-edit-file-meta="' +
__e( file.id ) +
'">\n                        <i class="fa fa-pencil"></i>\n                    </button>\n                    <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="Delete" data-trigger="hover" data-delete-file=\'{ "id": ' +
__e( file.id ) +
', "name": "' +
__e( file.name ) +
'" }\'>\n                        <i class="fa fa-close"></i>\n                    </button>\n                </div>\n            </div>\n        </div>\n    ';
 } ;
__p += '\n</div>\n';

}
return __p
}};
(function() {
  var ConfirmDeleteModal, ConfirmFolderDeleteModal, FileBrowser, FileBrowserModal, FileMetaModal, Files, FolderModal, InlineFileUpload, List, ZClipboard,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  List = (function() {
    List.prototype.type = 'grid';

    List.prototype.directory = '';

    List.prototype.page = 1;

    List.prototype.files = [];

    List.prototype.loadingPage = false;

    List.prototype.hasMore = true;

    function List() {
      this.setDropzoneDefaults();
      this.events();
    }

    List.prototype.setDropzoneDefaults = function() {};

    List.prototype.events = function() {
      $(document).ready((function(_this) {
        return function() {
          return _this.documentReady();
        };
      })(this));
      $(document).on('click', '[data-trigger-upload]', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.triggerUpload();
        };
      })(this));
      $(document).on('click', '[data-navigate-directory]', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.changeDirectory(e);
        };
      })(this));
      $(window).on('dragenter', this.scrollTop);
      $(window).on('dragleave', this.haltScrollTop);
      return $(window).scroll((function(_this) {
        return function() {
          var bottomOfWindow, triggerPoint;
          triggerPoint = $('body').outerHeight() - 200;
          bottomOfWindow = $(window).height() + $(window).scrollTop();
          if (bottomOfWindow > triggerPoint) {
            if (_this.loadingPage) {
              return;
            }
            return _this.loadNextPage();
          }
        };
      })(this));
    };

    List.prototype.loadNextPage = function() {
      this.page++;
      return this.getDirectory();
    };

    List.prototype.scrollTop = function() {
      return $('html, body').animate({
        scrollTop: 0
      }, 250);
    };

    List.prototype.haltScrollTop = function() {
      return $('html, body').stop();
    };

    List.prototype.triggerUpload = function() {
      return $("#file_uploader").find('[type=file]').trigger('click');
    };

    List.prototype.startLoading = function() {
      return $('section.gallery').addClass('loading');
    };

    List.prototype.finishLoading = function() {
      ZClip.init();
      return $('section.gallery').removeClass('loading');
    };

    List.prototype.documentReady = function() {
      return this.getDirectory();
    };

    List.prototype.changeView = function(type) {
      this.type = type;
      this.resetData();
      return this.getDirectory();
    };

    List.prototype.resetData = function() {
      this.files = [];
      this.hasMore = true;
      return this.page = 1;
    };

    List.prototype.changeDirectory = function(e) {
      var $clicked;
      this.resetData();
      $clicked = $(e.currentTarget);
      window.Hatchly.currentDirectory = this.directory = $clicked.data('navigate-directory');
      return this.getDirectory();
    };

    List.prototype.getDirectory = function() {
      var request;
      if (this.loadingPage || !this.hasMore) {
        return;
      }
      this.startLoading();
      this.loadingPage = true;
      request = $.ajax({
        url: Hatchly.admin_url + "/files/_ajax/get_directory",
        data: {
          directory: this.directory,
          page: this.page
        }
      });
      request.done((function(_this) {
        return function(data, textStatus, jqXHR) {
          _this.files = _this.files.concat(_.toArray(data.files.data));
          _this.loadingPage = false;
          _this.render(data);
          return _this.hasMore = data.files.next_page_url;
        };
      })(this));
      return request.error((function(_this) {
        return function(data) {
          bootbox.alert({
            title: 'Oops!',
            message: 'An error occurred while processing your request. Please contact <a href="https://netsells.co.uk/">Netsells</a>.',
            buttons: {
              ok: {
                label: 'Close'
              }
            }
          });
          return _this.finishLoading();
        };
      })(this));
    };

    List.prototype.render = function(data) {
      var $container, filesTemplate;
      $container = $('#render');
      filesTemplate = JST["views/" + this.type]({
        files: this.files,
        folders: data.folders
      });
      $container.html(filesTemplate);
      $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
      });
      this.finishLoading();
      return this.attachEvents();
    };

    List.prototype.attachEvents = function() {
      var err;
      try {
        return $(".file_uploader").dropzone({
          previewsContainer: "#render ul",
          url: Hatchly.files.upload_url,
          headers: {
            'X-CSRF-TOKEN': Hatchly.token
          },
          sending: (function(_this) {
            return function(file, xhr, formData) {
              if (_this.directory) {
                return formData.append("directory_id", _this.directory);
              }
            };
          })(this),
          addedfile: function(file) {
            var $previewsContainer, renderedFile;
            $previewsContainer = $(this.options.previewsContainer);
            renderedFile = JST["views/file"]({
              file: {}
            });
            if ($previewsContainer.find('.folder').length) {
              return $previewsContainer.find('.folder').last().closest('li').after(renderedFile);
            } else {
              return $previewsContainer.prepend(renderedFile);
            }
          },
          success: function(file, response) {
            var $previewsContainer, fileResponse, renderedFile;
            $previewsContainer = $(this.options.previewsContainer);
            fileResponse = JSON.parse(file.xhr.response);
            renderedFile = JST["views/file"]({
              file: fileResponse
            });
            $previewsContainer.find('.image-placeholder').first().closest('li').replaceWith(renderedFile);
            return ZClip.init();
          },
          error: function(file, errorMessage, xhr) {
            var $previewsContainer;
            $previewsContainer = $(this.options.previewsContainer);
            $previewsContainer.find('.image-placeholder').first().closest('li').remove();
            return bootbox.alert(errorMessage.errors[0]);
          }
        });
      } catch (error) {
        err = error;
        console.log(err.message);
        if (err.message === 'Dropzone already attached.') {
          return console.log('supress');
        }
      }
    };

    return List;

  })();

  ZClipboard = (function() {
    function ZClipboard() {
      this.init();
    }

    ZClipboard.prototype.init = function() {
      return $(document).on('mouseenter', '[data-copy]', function(e) {
        if ($(e.target).hasClass('copy-init')) {
          return;
        }
        $(e.target).zclip({
          path: '/hatchly-files/vendor/ZeroClipboard.swf',
          copy: function() {
            var copyVal;
            copyVal = $(e.target).data('copy');
            return copyVal;
          },
          afterCopy: function() {},
          beforeCopy: function() {}
        });
        return $(e.target).addClass('copy-init');
      });
    };

    return ZClipboard;

  })();

  ConfirmDeleteModal = (function(superClass) {
    extend(ConfirmDeleteModal, superClass);

    function ConfirmDeleteModal() {
      ConfirmDeleteModal.__super__.constructor.apply(this, arguments);
    }

    ConfirmDeleteModal.prototype.registerEvents = function() {
      return $(document).on('click submit', "[data-" + (this.invoker()) + "]", (function(_this) {
        return function(e, eventData) {
          if (eventData == null) {
            eventData = {};
          }
          if (eventData.confirmed) {
            return true;
          }
          e.preventDefault();
          _this.setupModal(e);
          return _this.show();
        };
      })(this));
    };

    ConfirmDeleteModal.prototype.setupModal = function(e) {
      var $invoker, invokerData;
      ConfirmDeleteModal.__super__.setupModal.apply(this, arguments);
      $invoker = $(e.currentTarget);
      invokerData = $invoker.data(this.invoker());
      return this.config.title = "Deleting '" + invokerData.name + "'";
    };

    ConfirmDeleteModal.prototype.confirmCallback = function(e) {
      if (Page.is('filesindex')) {
        this.deleteFromFileManager(e);
      }
      if (Page.is('pagesedit') || Page.is('pagescreate')) {
        return this.deleteFromForm(e);
      }
    };

    ConfirmDeleteModal.prototype.deleteFromFileManager = function(e) {
      var $invoker, invokerData, response;
      $invoker = $(e.currentTarget);
      invokerData = $invoker.data(this.invoker());
      response = $.ajax({
        url: Hatchly.files.delete_url + "/" + invokerData.id,
        type: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': Hatchly.token
        }
      });
      response.success((function(_this) {
        return function(data, textStatus, jqXHR) {
          return _this.responseSuccess(e, data, textStatus, jqXHR);
        };
      })(this));
      response.error((function(_this) {
        return function(jqXHR, textStatus, errorThrown) {
          return _this.responseError(e, jqXHR, textStatus, errorThrown);
        };
      })(this));
      response.complete((function(_this) {
        return function(jqXHR, textStatus) {
          return _this.responseComplete(e, jqXHR, textStatus);
        };
      })(this));
      return false;
    };

    ConfirmDeleteModal.prototype.deleteFromForm = function(e) {
      var $clicked, $thumbnail;
      $clicked = $(e.currentTarget);
      $thumbnail = $clicked.closest('.image-upload-group');
      $thumbnail.find('input').val('');
      return $thumbnail.find('.thumbnail').data('thumbnail', '').data('src', '').data('id', '').empty();
    };

    ConfirmDeleteModal.prototype.responseSuccess = function(e, data, textStatus, jqXHR) {
      var $invoker;
      $invoker = $(e.currentTarget);
      $invoker.closest('li').fadeOut().remove();
      return this.close();
    };

    ConfirmDeleteModal.prototype.responseError = function(e, jqXHR, textStatus, errorThrown) {
      return console.log(jqXHR, textStatus, errorThrown);
    };

    ConfirmDeleteModal.prototype.responseComplete = function(e, jqXHR, textStatus) {};

    ConfirmDeleteModal.prototype.modalContent = function() {
      return "Are you sure you want to delete this file? This cannot be undone.";
    };

    ConfirmDeleteModal.prototype.invoker = function() {
      return "delete-file";
    };

    return ConfirmDeleteModal;

  })(window.ConfirmModal);

  ConfirmFolderDeleteModal = (function(superClass) {
    extend(ConfirmFolderDeleteModal, superClass);

    function ConfirmFolderDeleteModal() {
      ConfirmFolderDeleteModal.__super__.constructor.apply(this, arguments);
    }

    ConfirmFolderDeleteModal.prototype.registerEvents = function() {
      return $(document).on('click submit', "[data-" + (this.invoker()) + "]", (function(_this) {
        return function(e, eventData) {
          if (eventData == null) {
            eventData = {};
          }
          if (eventData.confirmed) {
            return true;
          }
          e.preventDefault();
          _this.setupModal(e);
          return _this.show();
        };
      })(this));
    };

    ConfirmFolderDeleteModal.prototype.setupModal = function(e) {
      var $invoker, invokerData;
      ConfirmFolderDeleteModal.__super__.setupModal.apply(this, arguments);
      $invoker = $(e.currentTarget);
      invokerData = $invoker.data(this.invoker());
      return this.config.title = "Deleting '" + invokerData.name + "'";
    };

    ConfirmFolderDeleteModal.prototype.confirmCallback = function(e) {
      return this.deleteFromFileManager(e);
    };

    ConfirmFolderDeleteModal.prototype.deleteFromFileManager = function(e) {
      var $invoker, invokerData, response;
      $invoker = $(e.currentTarget);
      invokerData = $invoker.data(this.invoker());
      response = $.ajax({
        url: Hatchly.files.delete_folder_url + "/" + invokerData.id,
        type: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': Hatchly.token
        }
      });
      response.success((function(_this) {
        return function(data, textStatus, jqXHR) {
          return _this.responseSuccess(e, data, textStatus, jqXHR);
        };
      })(this));
      response.error((function(_this) {
        return function(jqXHR, textStatus, errorThrown) {
          return _this.responseError(e, jqXHR, textStatus, errorThrown);
        };
      })(this));
      response.complete((function(_this) {
        return function(jqXHR, textStatus) {
          return _this.responseComplete(e, jqXHR, textStatus);
        };
      })(this));
      return false;
    };

    ConfirmFolderDeleteModal.prototype.responseSuccess = function(e, data, textStatus, jqXHR) {
      var $invoker;
      $invoker = $(e.currentTarget);
      $invoker.closest('li').fadeOut().remove();
      return this.close();
    };

    ConfirmFolderDeleteModal.prototype.responseError = function(e, jqXHR, textStatus, errorThrown) {
      return console.log(jqXHR, textStatus, errorThrown);
    };

    ConfirmFolderDeleteModal.prototype.responseComplete = function(e, jqXHR, textStatus) {};

    ConfirmFolderDeleteModal.prototype.modalContent = function() {
      return "Are you sure you want to delete this folder? This cannot be undone.";
    };

    ConfirmFolderDeleteModal.prototype.invoker = function() {
      return "delete-folder";
    };

    return ConfirmFolderDeleteModal;

  })(window.ConfirmModal);

  FileMetaModal = (function() {
    function FileMetaModal() {
      $(document).on('click', '[data-edit-file-meta]', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.getModalContent(e);
        };
      })(this));
    }

    FileMetaModal.prototype.getModalContent = function(e) {
      var $clicked, fileId, originalValue;
      $clicked = $(e.currentTarget);
      fileId = $clicked.data('edit-file-meta');
      originalValue = $clicked.html();
      this.startLoading($clicked);
      return $.ajax({
        url: "/admin/files/_ajax/get_meta_form/" + fileId,
        success: (function(_this) {
          return function(data) {
            return _this.prepareForModal(data);
          };
        })(this),
        complete: (function(_this) {
          return function() {
            return _this.stopLoading($clicked, originalValue);
          };
        })(this)
      });
    };

    FileMetaModal.prototype.startLoading = function(e) {
      return $(e).html('<i class="fa fa-spinner fa-spin"></i>');
    };

    FileMetaModal.prototype.stopLoading = function(e, originalValue) {
      return $(e).html(originalValue);
    };

    FileMetaModal.prototype.prepareForModal = function(data) {
      return this.show(data);
    };

    FileMetaModal.prototype.show = function(data) {
      this.modal = bootbox.dialog({
        message: '<div id="modal-messages"></div>' + data,
        title: "Edit file meta data",
        onEscape: function() {}
      });
      return this.modal.on('shown.bs.modal', (function(_this) {
        return function() {
          return _this.registerMetaFormEvents();
        };
      })(this));
    };

    FileMetaModal.prototype.registerMetaFormEvents = function() {
      this.addToken();
      this.modal.off('Hatchly.AjaxForm.submitted').on('Hatchly.AjaxForm.submitted', 'form', (function(_this) {
        return function(e, eventData) {
          $(e.currentTarget).find('input[type=submit], button[type=submit]').addClass('disabled');
          return _this.clearMessages();
        };
      })(this));
      this.modal.off('Hatchly.AjaxForm.success').on('Hatchly.AjaxForm.success', 'form', (function(_this) {
        return function(e, eventData) {
          _this.generateMessages(eventData.callback.data.messages, eventData.callback.jqXHR.status);
          return setTimeout((function() {
            return _this.modal.modal('hide');
          }), 500);
        };
      })(this));
      this.modal.off('Hatchly.AjaxForm.error').on('Hatchly.AjaxForm.error', 'form', (function(_this) {
        return function(e, eventData) {
          return _this.generateMessages(eventData.callback.jqXHR.responseJSON.messages, eventData.callback.jqXHR.status);
        };
      })(this));
      return this.modal.off('Hatchly.AjaxForm.complete').on('Hatchly.AjaxForm.complete', 'form', (function(_this) {
        return function(e, eventData) {
          return $(e.currentTarget).find('input[type=submit], button[type=submit]').removeClass('disabled');
        };
      })(this));
    };

    FileMetaModal.prototype.generateMessages = function(messages, status) {
      this.clearMessages();
      return $('#modal-messages').html(CoreJST['alerts']({
        messages: messages,
        status: status
      }));
    };

    FileMetaModal.prototype.clearMessages = function() {
      return $('#modal-messages').html('');
    };

    FileMetaModal.prototype.addToken = function() {
      return this.modal.find('form').each((function(_this) {
        return function(i, el) {
          if (!$(el).find('input[name=_token]').length) {
            $(el).prepend('<input type="hidden" name="_token">');
          }
          return _this.addTokenValue(el);
        };
      })(this));
    };

    FileMetaModal.prototype.addTokenValue = function(el) {
      return $(el).find('input[name=_token]').val(Hatchly.token);
    };

    return FileMetaModal;

  })();

  FolderModal = (function() {
    FolderModal.currentDirectory = null;

    function FolderModal() {
      $(document).on('click', '[data-edit-folder]', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.getModalContent(e);
        };
      })(this));
      $(document).on('click', '[data-add-folder]', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.getModalContent(e);
        };
      })(this));
    }

    FolderModal.prototype.getModalContent = function(e, folderId) {
      var $clicked, endpoint, originalValue;
      if (folderId == null) {
        folderId = false;
      }
      $clicked = $(e.currentTarget);
      if ($clicked.data('edit-folder')) {
        folderId = $clicked.data('edit-folder');
      }
      originalValue = $clicked.html();
      this.startLoading($clicked);
      endpoint = "/admin/files/_ajax/edit_folder";
      if (!folderId) {
        folderId = 0;
      }
      endpoint = endpoint + "/" + folderId;
      if (window.Hatchly.currentDirectory) {
        endpoint = endpoint + "/" + window.window.Hatchly.currentDirectory;
      }
      return $.ajax({
        url: endpoint,
        success: (function(_this) {
          return function(data) {
            return _this.prepareForModal(data, folderId);
          };
        })(this),
        complete: (function(_this) {
          return function() {
            return _this.stopLoading($clicked, originalValue);
          };
        })(this)
      });
    };

    FolderModal.prototype.startLoading = function(e) {
      return $(e).html('<i class="fa fa-spinner fa-spin"></i>');
    };

    FolderModal.prototype.stopLoading = function(e, originalValue) {
      return $(e).html(originalValue);
    };

    FolderModal.prototype.prepareForModal = function(data, folderId) {
      return this.show(data, folderId);
    };

    FolderModal.prototype.show = function(data, folderId) {
      var prefix;
      prefix = folderId ? 'Edit' : 'Create new';
      this.modal = bootbox.dialog({
        message: '<div id="modal-messages"></div>' + data,
        title: prefix + " folder",
        onEscape: function() {}
      });
      return this.modal.on('shown.bs.modal', (function(_this) {
        return function() {
          return _this.registerMetaFormEvents();
        };
      })(this));
    };

    FolderModal.prototype.registerMetaFormEvents = function() {
      this.addToken();
      this.modal.off('Hatchly.AjaxForm.submitted').on('Hatchly.AjaxForm.submitted', 'form', (function(_this) {
        return function(e, eventData) {
          $(e.currentTarget).find('input[type=submit], button[type=submit]').addClass('disabled');
          return _this.clearMessages();
        };
      })(this));
      this.modal.off('Hatchly.AjaxForm.success').on('Hatchly.AjaxForm.success', 'form', (function(_this) {
        return function(e, eventData) {
          _this.generateMessages(eventData.callback.data.messages, eventData.callback.jqXHR.status);
          return setTimeout((function() {
            _this.modal.modal('hide');
            return window.location.reload(true);
          }), 500);
        };
      })(this));
      this.modal.off('Hatchly.AjaxForm.error').on('Hatchly.AjaxForm.error', 'form', (function(_this) {
        return function(e, eventData) {
          return _this.generateMessages(eventData.callback.jqXHR.responseJSON.messages, eventData.callback.jqXHR.status);
        };
      })(this));
      return this.modal.off('Hatchly.AjaxForm.complete').on('Hatchly.AjaxForm.complete', 'form', (function(_this) {
        return function(e, eventData) {
          return $(e.currentTarget).find('input[type=submit], button[type=submit]').removeClass('disabled');
        };
      })(this));
    };

    FolderModal.prototype.generateMessages = function(messages, status) {
      this.clearMessages();
      return $('#modal-messages').html(CoreJST['alerts']({
        messages: messages,
        status: status
      }));
    };

    FolderModal.prototype.clearMessages = function() {
      return $('#modal-messages').html('');
    };

    FolderModal.prototype.addToken = function() {
      return this.modal.find('form').each((function(_this) {
        return function(i, el) {
          if (!$(el).find('input[name=_token]').length) {
            $(el).prepend('<input type="hidden" name="_token">');
          }
          return _this.addTokenValue(el);
        };
      })(this));
    };

    FolderModal.prototype.addTokenValue = function(el) {
      return $(el).find('input[name=_token]').val(Hatchly.token);
    };

    return FolderModal;

  })();

  FileBrowser = (function() {
    function FileBrowser() {
      this.registerEvents();
    }

    FileBrowser.prototype.registerEvents = function() {
      return $(document).on('click', '[data-select-file]', (function(_this) {
        return function(e) {
          return _this.selectFile(e);
        };
      })(this));
    };

    FileBrowser.prototype.selectFile = function(e) {
      var $selected, id;
      $selected = $(e.currentTarget);
      id = $selected.data('select-file');
      return this.returnSelectedFile(id);
    };

    FileBrowser.prototype.returnSelectedFile = function(id) {
      var $request;
      $request = $.ajax({
        url: "/admin/files/_ajax/get_file/" + id,
        type: "GET"
      });
      return $request.success(function(data, textStatus, jqXHR) {
        parent.$('body').trigger('Hatchly.files.file-selected', data.file);
        return parent.$('body').trigger('Hatchly.Files.existingFileSelected', data.file);
      });
    };

    return FileBrowser;

  })();

  FileBrowserModal = (function() {
    function FileBrowserModal() {
      this.registerEvents();
      this.$clicked = null;
      this.modal = null;
    }

    FileBrowserModal.prototype.registerEvents = function() {
      $(document).on('click', '[data-select-existing-file]', (function(_this) {
        return function(e) {
          _this.$clicked = $(e.currentTarget);
          return _this.openFileBrowser();
        };
      })(this));
      return $(document).on('Hatchly.Files.existingFileSelected', 'body', (function(_this) {
        return function(e, data) {
          if (_this.$clicked) {
            return _this.insertFile(data);
          }
        };
      })(this));
    };

    FileBrowserModal.prototype.openFileBrowser = function() {
      this.modal = bootbox.dialog({
        message: "<iframe src=\"" + Hatchly.admin_url + "/files/file-browser\" frameborder=\"0\" style=\"width: 100%; height: 500px;\"></iframe>"
      });
      this.modal.on('shown.bs.modal', (function(_this) {
        return function() {
          return _this.modal.find('iframe')[0].contentWindow.location = _this.modal.find('iframe').attr('src');
        };
      })(this));
      return this.modal.on('hidden.bs.modal', (function(_this) {
        return function() {
          return _this.$clicked = false;
        };
      })(this));
    };

    FileBrowserModal.prototype.insertFile = function(file) {
      var $field, $thumbnail;
      $field = this.$clicked.closest('.image-upload-group');
      $thumbnail = $field.find('.thumbnail');
      $thumbnail.attr('data-thumbnail', '');
      $thumbnail.attr('data-src', file.thumbnail ? file.thumbnail.public_url : file.public_url);
      $thumbnail.attr('data-id', file.id);
      $thumbnail.attr('data-image', file.is_image);
      $thumbnail.attr('data-file-name', file.name);
      $field.find("input[name='" + ($thumbnail.data('input-name')) + "']").val(file.id);
      this.modal.modal('hide');
      return $('body').trigger('Hatchly.Core.fieldsAdded');
    };

    return FileBrowserModal;

  })();

  InlineFileUpload = (function() {
    function InlineFileUpload() {
      this.generateThumbnails();
      this.setupDropZone();
      this.registerEvents();
    }

    InlineFileUpload.prototype.registerEvents = function() {
      return $('body').on('Hatchly.Core.fieldsAdded', (function(_this) {
        return function() {
          _this.generateThumbnails();
          return _this.setupDropZone();
        };
      })(this));
    };

    InlineFileUpload.prototype.generateThumbnails = function() {
      $('[data-thumbnail]').each((function(_this) {
        return function(i, el) {
          var thumbnail;
          if ($(el).attr('data-thumbnail') === 'generated' || $(el).attr('data-src') === '') {
            return;
          }
          thumbnail = JST["views/thumbnail"]({
            file: {
              public_url: $(el).attr('data-src'),
              name: $(el).attr('data-file-name'),
              id: $(el).attr('data-id'),
              is_image: $(el).attr('data-image')
            }
          });
          $(el).html(thumbnail);
          return $(el).attr('data-thumbnail', 'generated');
        };
      })(this));
      return ZClip.init();
    };

    InlineFileUpload.prototype.setupDropZone = function() {
      $(".file_uploader").each(function(i, el) {
        var name;
        if ($(el).hasClass('dz-clickable')) {
          return;
        }
        name = $(el).data('name');
        return $(el).dropzone({
          previewsContainer: "[data-input-name='" + name + "']",
          url: $(el).data('action'),
          paramName: 'file',
          headers: {
            'X-CSRF-TOKEN': Hatchly.token
          },
          addedfile: function(file) {
            var $previewsContainer, renderedFile;
            $previewsContainer = $(this.options.previewsContainer);
            renderedFile = JST["views/thumbnail"]({
              file: {}
            });
            return $previewsContainer.html(renderedFile);
          },
          success: function(file, response) {
            var $previewsContainer, fileResponse, renderedFile;
            $previewsContainer = $(this.options.previewsContainer);
            fileResponse = JSON.parse(file.xhr.response);
            renderedFile = JST["views/thumbnail"]({
              file: fileResponse
            });
            $previewsContainer.find('.gallery-item').replaceWith(renderedFile);
            $("[name='" + name + "']").val(fileResponse.id);
            return ZClip.init();
          },
          error: function(file, errorMessage, xhr) {
            var $previewsContainer;
            $previewsContainer = $(this.options.previewsContainer);
            $previewsContainer.find('.gallery-item').remove();
            return bootbox.alert(errorMessage.errors[0]);
          }
        });
      });
      return $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
      });
    };

    return InlineFileUpload;

  })();

  Files = (function() {
    function Files() {
      new List;
    }

    return Files;

  })();

  $(document).on('Hatchly.start', function() {
    window.ZClip = new ZClipboard;
    new ConfirmDeleteModal;
    if (Page.is('filesindex')) {
      new ConfirmFolderDeleteModal;
      new Files(new FileMetaModal, new FolderModal);
    }
    if (Page.is('pagesedit')) {
      new FileBrowserModal;
      new InlineFileUpload(new FileMetaModal);
    }
    if (Page.is('filesfile-browser')) {
      return new FileBrowser;
    }
  });

}).call(this);
