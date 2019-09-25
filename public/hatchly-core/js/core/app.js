this.JST = {"alerts": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {


    type = 'danger';
    if (status == 200) {
        type = 'success';
    }
;
__p += '\n';
 if (messages.length) { ;
__p += '\n    <div class="alert alert-' +
__e( type ) +
'" role="alert">\n        ';
 _.each(messages, function(message){ ;
__p += '\n            ' +
__e( message ) +
'<br/>\n        ';
 }); ;
__p += '\n    </div>\n';
 } ;


}
return __p
}};
(function() {
  var AjaxForm, Content, Forms, Global, Nav, Page, TinyMCEFileManager,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  AjaxForm = (function() {
    function AjaxForm() {
      this.registerEvents();
    }

    AjaxForm.prototype.registerEvents = function() {
      return $(document).on('submit', '[data-ajax-form]', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.ajaxFormSubmit(e);
        };
      })(this));
    };

    AjaxForm.prototype.ajaxFormSubmit = function(e) {
      var $form, request;
      $form = $(e.currentTarget);
      $form.trigger('Hatchly.AjaxForm.submitted', {
        originalEvent: e
      });
      request = $.ajax({
        url: $form.attr('action'),
        method: $form.attr('method').toUpperCase(),
        data: $form.serialize()
      });
      request.success((function(_this) {
        return function(data, textStatus, jqXHR) {
          return _this.success(e, data, textStatus, jqXHR);
        };
      })(this));
      request.error((function(_this) {
        return function(jqXHR, textStatus, errorThrown) {
          return _this.error(e, jqXHR, textStatus, errorThrown);
        };
      })(this));
      return request.complete((function(_this) {
        return function(jqXHR, textStatus) {
          return _this.complete(e, jqXHR, textStatus);
        };
      })(this));
    };

    AjaxForm.prototype.success = function(e, data, textStatus, jqXHR) {
      var $form;
      $form = $(e.currentTarget);
      return $form.trigger('Hatchly.AjaxForm.success', {
        originalEvent: e,
        callback: {
          data: data,
          textStatus: textStatus,
          jqXHR: jqXHR
        }
      });
    };

    AjaxForm.prototype.error = function(e, jqXHR, textStatus, errorThrown) {
      var $form;
      $form = $(e.currentTarget);
      return $form.trigger('Hatchly.AjaxForm.error', {
        originalEvent: e,
        callback: {
          jqXHR: jqXHR,
          textStatus: textStatus,
          errorThrown: errorThrown
        }
      });
    };

    AjaxForm.prototype.complete = function(e, jqXHR, textStatus) {
      var $form;
      $form = $(e.currentTarget);
      return $form.trigger('Hatchly.AjaxForm.complete', {
        originalEvent: e,
        callback: {
          jqXHR: jqXHR,
          textStatus: textStatus
        }
      });
    };

    return AjaxForm;

  })();

  Content = (function() {
    function Content() {
      this.sizeContent();
      this.events();
    }

    Content.prototype.events = function() {
      return $(window).resize(this.sizeContent);
    };

    Content.prototype.sizeContent = function() {
      var $content;
      $content = $('#content');
      return $content.css({
        'min-height': $(window).height()
      });
    };

    return Content;

  })();

  Forms = (function() {
    function Forms() {
      $(document).on('Hatchly.start', (function(_this) {
        return function() {
          _this.registerCustomTinyMCEPlugins();
          _this.registerFields();
          return _this.registerEvents();
        };
      })(this));
    }

    Forms.prototype.registerFields = function() {
      var field, j, len, ref, results;
      ref = ['wysiwyg', 'datePickers', 'timePickers', 'dateTimePickers', 'select2'];
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        field = ref[j];
        results.push(this[field]());
      }
      return results;
    };

    Forms.prototype.registerCustomTinyMCEPlugins = function() {
      return new TinyMCEFileManager;
    };

    Forms.prototype.getTinyMCEPlugins = function() {
      var j, len, plugin, plugins, ref;
      plugins = [];
      ref = window.Hatchly.tinyMCEPlugins;
      for (j = 0, len = ref.length; j < len; j++) {
        plugin = ref[j];
        plugins.push(plugin.name);
      }
      return plugins.join(" ");
    };

    Forms.prototype.getTinyMCEButtons = function() {
      var buttons, j, len, plugin, ref;
      buttons = [];
      ref = window.Hatchly.tinyMCEPlugins;
      for (j = 0, len = ref.length; j < len; j++) {
        plugin = ref[j];
        buttons.push.apply(buttons, plugin.buttons);
      }
      return buttons.join(" ");
    };

    Forms.prototype.wysiwyg = function() {
      var $wysi;
      $wysi = $('[data-wysiwyg]');
      if (!$wysi.length) {
        return;
      }
      return $wysi.each((function(_this) {
        return function(i, el) {
          if (!$(el).hasClass('init')) {
            $(el).addClass('init');
            return $(el).tinymce({
              theme: "modern",
              skin: 'light',
              relative_urls: false,
              plugins: [_this.getTinyMCEPlugins(), "advlist autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen", "insertdatetime media table contextmenu paste"],
              toolbar: (_this.getTinyMCEButtons()) + " | insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
            });
          }
        };
      })(this));
    };

    Forms.prototype.datePickers = function() {
      return $('[data-datepicker]').each((function(_this) {
        return function(i, el) {
          return _this.setupDatePicker(el);
        };
      })(this));
    };

    Forms.prototype.setupDatePicker = function(el) {
      return $(el).pickadate({
        format: 'dd-mm-yyyy',
        selectYears: true
      });
    };

    Forms.prototype.timePickers = function() {
      return $('[data-timepicker]').each((function(_this) {
        return function(i, el) {
          return _this.setupTimePicker(el);
        };
      })(this));
    };

    Forms.prototype.setupTimePicker = function(el) {
      return $(el).pickatime({
        format: 'HH:i'
      });
    };

    Forms.prototype.dateTimePickers = function() {};

    Forms.prototype.registerEvents = function() {
      return $('body').on('Hatchly.Core.fieldsAdded', (function(_this) {
        return function(e) {
          return setTimeout(function() {
            return _this.registerFields();
          }, 0);
        };
      })(this));
    };

    Forms.prototype.select2 = function() {
      var $selects;
      $selects = $('select').not('.unstyled');
      return $selects.each(function(i, el) {
        var $select2Container;
        $select2Container = $(el).next('.select2-container');
        if ($select2Container.length) {
          $select2Container.remove();
          if ($(el).data('select2')) {
            $(el).select2('destroy');
          }
        }
        $(el).select2();
        return $(el).on('select2:select', function() {
          return el.dispatchEvent(new Event('change', {
            bubbles: true,
            cancelable: true
          }));
        });
      });
    };

    return Forms;

  })();

  Global = (function() {
    function Global() {
      this.init();
      this.events();
    }

    Global.prototype.init = function() {};

    Global.prototype.events = function() {};

    return Global;

  })();

  window.ModalBase = (function() {
    function ModalBase() {
      this.setDefaults();
      this.registerCoreEvents();
    }

    ModalBase.prototype.setDefaults = function() {
      this.config = {};
      return this.defaults = {
        message: this.modalContentWithMessages(),
        title: this.title(),
        onEscape: function() {}
      };
    };

    ModalBase.prototype.registerCoreEvents = function() {
      $(document).on('show.bs.modal', '.modal', this.centerModals);
      return $(window).on('resize', this.centerModals);
    };

    ModalBase.prototype.centerModals = function() {
      return $('.modal').each(function(i) {
        var $clone, top;
        $clone = $(this).clone().css('display', 'block').appendTo('body');
        top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        return $(this).find('.modal-content').css("margin-top", top);
      });
    };

    ModalBase.prototype.show = function(data) {
      var options;
      if (data == null) {
        data = {};
      }
      options = $.extend(true, this.defaults, this.config);
      this.modal = bootbox.dialog(this.defaults);
      this.modal.on('show.bs.modal', this.onModalShow);
      this.modal.on('shown.bs.modal', this.onModalShown);
      this.modal.on('hide.bs.modal', this.onModalHide);
      return this.modal.on('hidden.bs.modal', this.onModalHidden);
    };

    ModalBase.prototype.close = function() {
      return this.modal.modal('hide');
    };

    ModalBase.prototype.onModalHide = function() {};

    ModalBase.prototype.onModalHidden = function() {};

    ModalBase.prototype.onModalShow = function() {};

    ModalBase.prototype.onModalShown = function() {};

    ModalBase.prototype.title = function() {
      return "Modal Title";
    };

    ModalBase.prototype.modalMessages = function() {
      return '<div class="modal_messages"></div>';
    };

    ModalBase.prototype.modalContentWithMessages = function() {
      var content;
      content = [this.modalMessages(), this.modalContent()];
      return content.join("");
    };

    ModalBase.prototype.modalContent = function() {
      return "Please provide content by overriding the modalContent method.";
    };

    ModalBase.prototype.invoker = function() {
      return "data-empty-modal";
    };

    ModalBase.prototype.addMessages = function() {
      return this.clearMessages();
    };

    ModalBase.prototype.clearMessages = function() {};

    return ModalBase;

  })();

  Nav = (function() {
    function Nav() {
      this.events();
      this.sizeOverflow();
    }

    Nav.prototype.events = function() {
      $(window).resize(this.sizeOverflow);
      return $(document).on('click', '[data-toggle-nav]', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.toggleNav();
        };
      })(this));
    };

    Nav.prototype.sizeOverflow = function() {
      var $toSize, hVisHeight;
      $toSize = $('#nav .nav-inner');
      hVisHeight = 0;
      if ($('#nav #toggle-nav:visible').length) {
        hVisHeight += $('#nav #toggle-nav:visible').outerHeight();
      }
      if ($('#nav #nav-footer').length) {
        hVisHeight += $('#nav #nav-footer').outerHeight();
      }
      return $toSize.css({
        'height': $(window).height() - hVisHeight
      });
    };

    Nav.prototype.toggleNav = function() {
      return $('#nav').toggleClass('open');
    };

    return Nav;

  })();

  Page = (function() {
    Page.prototype.isIn = false;

    Page.prototype.config = {
      type: 'page',
      component: ''
    };

    function Page(extended) {
      this.extended = extended != null ? extended : {};
      if (_.size(this.extended)) {
        $.extend(this.config, this.extended);
      }
    }

    Page.prototype.is = function(slug) {
      return $('body').hasClass(this.config.type + "-" + this.config.component + slug);
    };

    Page.prototype["in"] = function(slugs) {
      var fn, j, len, slug;
      this.isIn = false;
      slugs = slugs instanceof Array ? slugs : [slugs];
      fn = (function(_this) {
        return function(slug) {
          if (_this.is(slug)) {
            return _this.isIn = true;
          }
        };
      })(this);
      for (j = 0, len = slugs.length; j < len; j++) {
        slug = slugs[j];
        fn(slug);
      }
      return this.isIn;
    };

    Page.prototype.segment = function(id) {
      var segments;
      segments = window.location.pathname.split('/');
      if (segments[id] != null) {
        return segments[id];
      } else {
        return false;
      }
    };

    Page.prototype.segmentMatch = function(id, match) {
      return this.segment(id) === match;
    };

    return Page;

  })();

  TinyMCEFileManager = (function() {
    function TinyMCEFileManager() {
      this.registerPlugin();
      this.registerEvents();
    }

    TinyMCEFileManager.prototype.registerEvents = function() {
      return $('body').on('Hatchly.files.file-selected', (function(_this) {
        return function(e, data) {
          if (data == null) {
            data = {};
          }
          return _this.handleSelectedImage(e, data);
        };
      })(this));
    };

    TinyMCEFileManager.prototype.handleSelectedImage = function(e, data) {
      if (this.openWindow) {
        this.openWindow.close();
        tinyMCE.execCommand('mceInsertContent', false, '<img alt="' + data.name + '" height="100" src="' + data.public_url + '"/>');
        return this.openWindow = false;
      }
    };

    TinyMCEFileManager.prototype.registerPlugin = function() {
      var plugin;
      tinymce.PluginManager.add('filemanager', (function(_this) {
        return function(editor, url) {
          return editor.addButton('filemanager', {
            tooltip: 'Add Image',
            icon: 'add-image',
            onclick: function() {
              return _this.openWindow = editor.windowManager.open({
                title: 'Select file',
                url: '/admin/files/file-browser',
                width: 800,
                height: 600
              });
            }
          });
        };
      })(this));
      plugin = {
        name: 'filemanager',
        buttons: ['filemanager']
      };
      if (!window.Hatchly.tinyMCEPlugins) {
        window.Hatchly.tinyMCEPlugins = [];
      }
      return window.Hatchly.tinyMCEPlugins.push(plugin);
    };

    return TinyMCEFileManager;

  })();

  window.ConfirmModal = (function(superClass) {
    extend(ConfirmModal, superClass);

    function ConfirmModal() {
      ConfirmModal.__super__.constructor.apply(this, arguments);
      this.registerEvents();
    }

    ConfirmModal.prototype.setupModal = function(e) {
      var $invoker, invokerData, orignalEvent;
      $invoker = $(e.currentTarget);
      invokerData = $invoker.data(this.invoker());
      orignalEvent = $.extend(true, {}, e);
      return this.config = {
        message: this.modalContent(invokerData),
        title: invokerData.title,
        buttons: {
          danger: {
            label: invokerData.label || "Confirm",
            className: "btn-danger",
            callback: (function(_this) {
              return function() {
                return _this.confirmCallback(orignalEvent);
              };
            })(this)
          },
          main: {
            label: "Cancel",
            className: "btn-default"
          }
        }
      };
    };

    ConfirmModal.prototype.registerEvents = function() {
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

    ConfirmModal.prototype.confirmCallback = function(e) {
      var $invoker, invokerData, originalEvent;
      $invoker = $(e.currentTarget);
      invokerData = $invoker.data(this.invoker());
      originalEvent = e.type;
      if (e.currentTarget.tagName === 'A') {
        return window.location = e.currentTarget.href;
      }
      return $invoker.trigger(originalEvent, {
        confirmed: true
      });
    };

    ConfirmModal.prototype.invoker = function() {
      return 'confirmation';
    };

    ConfirmModal.prototype.modalContent = function(invokerData) {
      var content;
      if (invokerData == null) {
        invokerData = {};
      }
      return content = [this.modalMessages(), "<p>" + invokerData.message + "</p>"];
    };

    return ConfirmModal;

  })(ModalBase);

  Page = (function() {
    Page.prototype.isIn = false;

    Page.prototype.config = {
      type: 'page',
      component: ''
    };

    function Page(extended) {
      this.extended = extended != null ? extended : {};
      if (_.size(this.extended)) {
        $.extend(this.config, this.extended);
      }
    }

    Page.prototype.is = function(slug) {
      return $('body').hasClass(this.config.type + "-" + this.config.component + slug);
    };

    Page.prototype["in"] = function(slugs) {
      var fn, j, len, slug;
      this.isIn = false;
      slugs = slugs instanceof Array ? slugs : [slugs];
      fn = (function(_this) {
        return function(slug) {
          if (_this.is(slug)) {
            return _this.isIn = true;
          }
        };
      })(this);
      for (j = 0, len = slugs.length; j < len; j++) {
        slug = slugs[j];
        fn(slug);
      }
      return this.isIn;
    };

    Page.prototype.segment = function(id) {
      var segments;
      segments = window.location.pathname.split('/');
      if (segments[id] != null) {
        return segments[id];
      } else {
        return false;
      }
    };

    Page.prototype.segmentMatch = function(id, match) {
      return this.segment(id) === match;
    };

    return Page;

  })();

  if (window.JST) {
    window.CoreJST = JST;
    window.JST = false;
  }

  Global = new Global;

  Nav = new Nav;

  Content = new Content;

  AjaxForm = new AjaxForm;

  Forms = new Forms;

  window.Page = new Page({
    component: 'hatchly'
  });

  Vue.config.debug = true;

  window.Vue = Vue;

  window.Hatchly = window.Hatchly || {};

  Hatchly.start = function() {
    window.LoadedPage = window.LoadedPage || new Promise(function(resolve) {
      return resolve();
    });
    return window.LoadedPage.then(function() {
      return new Vue({
        el: '#content',
        ready: function() {
          return this.$nextTick(this.hatchlyStart);
        },
        mounted: function() {
          return this.$nextTick(this.hatchlyStart);
        },
        methods: {
          hatchlyStart: function() {
            return $(document).trigger('Hatchly.start');
          }
        }
      });
    });
  };

  new ModalBase;

  new ConfirmModal;

}).call(this);
