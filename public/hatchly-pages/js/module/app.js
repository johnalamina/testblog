(function() {
  var Form, Home, RepeatableSection, SelectableSection, Slugify,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Form = (function() {
    function Form() {
      this.init();
      this.events();
    }

    Form.prototype.events = function() {
      return $(".selectable-section, .repeatable-section").each((function(_this) {
        return function(i, el) {
          return $(el).sortable({
            handle: $(el).children('.panel').children('.panel-heading')
          });
        };
      })(this));
    };

    Form.prototype.init = function() {
      new RepeatableSection();
      return new SelectableSection();
    };

    return Form;

  })();

  RepeatableSection = (function() {
    function RepeatableSection() {
      this.events();
    }

    RepeatableSection.prototype.events = function() {
      $(document).off('click.Hatchly.addRepeatableSection').on('click.Hatchly.addRepeatableSection', '[data-add-repeatable-section]', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.addRepeatableSection(e);
        };
      })(this));
      return $(document).off('click.Hatchly.deleteRepeatableSection').on('click.Hatchly.deleteRepeatableSection', '[data-delete-repeatable-section]', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.deleteRepeatableSection(e);
        };
      })(this));
    };

    RepeatableSection.prototype.addRepeatableSection = function(e) {
      var $repeatableSection, collectionKeys, pageTemplate, sectionKey;
      $repeatableSection = $(e.currentTarget).closest('.repeatable-section-container').find('.repeatable-section').first();
      sectionKey = $(e.currentTarget).data('section-key');
      collectionKeys = $(e.currentTarget).data('section-collection-keys');
      pageTemplate = $(e.currentTarget).data('page-template');
      return this.getContent(pageTemplate, sectionKey, collectionKeys, $repeatableSection);
    };

    RepeatableSection.prototype.getContent = function(template, key, collectionKeys, $section) {
      var request;
      request = $.ajax({
        url: _.trim(Hatchly.admin_url + "/pages/_ajax/repeatable-section/" + Hatchly.pages.page_id + "/" + template + "/" + key + "/" + collectionKeys, '/')
      });
      return request.done((function(_this) {
        return function(data) {
          return _this.addContent($section, data);
        };
      })(this));
    };

    RepeatableSection.prototype.addContent = function($section, data) {
      $section.append(data);
      return $('body').trigger('Hatchly.Core.fieldsAdded');
    };

    RepeatableSection.prototype.deleteRepeatableSection = function(e) {
      var $repeatableSection, collectionKey, sectionKey;
      $repeatableSection = $(e.currentTarget).closest('[data-section-key]');
      sectionKey = $repeatableSection.data('section-key');
      collectionKey = $repeatableSection.data('collection-key');
      return this.deleteContent(sectionKey, collectionKey, $repeatableSection);
    };

    RepeatableSection.prototype.deleteContent = function(sectionKey, collectionKey, $section) {
      var request;
      request = $.ajax({
        url: Hatchly.admin_url + "/pages/_ajax/repeatable-section/remove",
        data: {
          key: sectionKey,
          collection: collectionKey,
          pageId: Hatchly.pages.page_id
        },
        headers: {
          'X-CSRF-TOKEN': Hatchly.token
        },
        method: 'DELETE'
      });
      return request.done((function(_this) {
        return function(data) {
          return _this.removeContent($section);
        };
      })(this));
    };

    RepeatableSection.prototype.removeContent = function($section) {
      return $section.remove();
    };

    return RepeatableSection;

  })();

  SelectableSection = (function() {
    function SelectableSection() {
      this.events();
    }

    SelectableSection.prototype.events = function() {
      $(document).off('click.Hatchly.addSelectableSection').on('click.Hatchly.addSelectableSection', '[data-add-selectable-section]', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.addSelectableSection(e);
        };
      })(this));
      return $(document).off('click.Hatchly.deleteSelectableSection').on('click.Hatchly.deleteSelectableSection', '[data-delete-selectable-section]', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.deleteSelectableSection(e);
        };
      })(this));
    };

    SelectableSection.prototype.addSelectableSection = function(e) {
      var $selectableSection, collectionKeys, pageTemplate, sectionKey, selectedTemplate;
      $selectableSection = $(e.currentTarget).closest('.selectable-section-container').find('.selectable-section');
      sectionKey = $(e.currentTarget).data('section-key');
      pageTemplate = $(e.currentTarget).data('page-template');
      selectedTemplate = $(e.currentTarget).closest('.selectable-section-controls').find('select').val();
      collectionKeys = $(e.currentTarget).data('section-collection-keys');
      return this.getContent(pageTemplate, sectionKey, $selectableSection, selectedTemplate, collectionKeys);
    };

    SelectableSection.prototype.getContent = function(template, key, $section, selectedTemplate, collectionKey) {
      var request;
      request = $.ajax({
        url: _.trim(Hatchly.admin_url + "/pages/_ajax/selectable-section/" + Hatchly.pages.page_id + "/" + template + "/" + key + "/" + selectedTemplate + "/" + collectionKey, '/')
      });
      return request.done((function(_this) {
        return function(data) {
          return _this.addContent($section, data);
        };
      })(this));
    };

    SelectableSection.prototype.addContent = function($section, data) {
      $section.append(data);
      return $('body').trigger('Hatchly.Core.fieldsAdded');
    };

    SelectableSection.prototype.deleteSelectableSection = function(e) {
      var $selectableSection, collectionKey, sectionKey;
      $selectableSection = $(e.currentTarget).closest('[data-section-key]');
      sectionKey = $selectableSection.data('section-key');
      collectionKey = $selectableSection.data('collection-key');
      return this.deleteContent(sectionKey, collectionKey, $selectableSection);
    };

    SelectableSection.prototype.deleteContent = function(sectionKey, collectionKey, $section) {
      var request;
      request = $.ajax({
        url: Hatchly.admin_url + "/pages/_ajax/selectable-section/remove",
        data: {
          key: sectionKey,
          collection: collectionKey,
          pageId: Hatchly.pages.page_id
        },
        headers: {
          'X-CSRF-TOKEN': Hatchly.token
        },
        method: 'DELETE'
      });
      return request.done((function(_this) {
        return function(data) {
          return _this.removeContent($section);
        };
      })(this));
    };

    SelectableSection.prototype.removeContent = function($section) {
      return $section.remove();
    };

    return SelectableSection;

  })();

  Slugify = (function() {
    function Slugify() {
      this.generateSlug = bind(this.generateSlug, this);
      this.registerEvents();
    }

    Slugify.prototype.registerEvents = function() {
      $(document).on('keyup change', '[data-slugify]', _.debounce(this.generateSlug, 1000));
      return $(document).on('change', '[name=slug]', this.generateSlug);
    };

    Slugify.prototype.generateSlug = function(e) {
      var $entry, $slugField, slug;
      $entry = $(e.currentTarget);
      if ($entry.data('no-slugify')) {
        return;
      }
      if ($entry.data('slugify')) {
        $slugField = $($entry.data('slugify'));
      } else {
        $slugField = $entry;
      }
      if ($slugField.length && !$slugField.prop('disabled') && !$slugField.prop('readonly')) {
        slug = this.convertToSlug($entry.val());
        $slugField.val(slug);
        return this.verifySlug(slug, $slugField);
      }
    };

    Slugify.prototype.convertToSlug = function(string) {
      var separator;
      separator = '-';
      string = string.replace('_', '-');
      string = string.toLowerCase().replace(new RegExp('[^a-z0-9' + separator + '\\s]', 'g'), '');
      string = string.replace(new RegExp('[' + separator + '\\s]+', 'g'), separator);
      return string.replace(new RegExp('^[' + separator + '\\s]+|[' + separator + '\\s]+$', 'g'), '');
    };

    Slugify.prototype.verifySlug = function(slug, $slugField) {
      if (this.request) {
        this.request.abort();
      }
      this.startValidation($slugField);
      this.request = $.ajax({
        url: Hatchly.admin_url + "/pages/_ajax/slug/validate",
        headers: {
          'X-CSRF-Token': Hatchly.token
        },
        method: 'POST',
        data: {
          page_id: Hatchly.pages.page_id,
          language: Hatchly.pages.language,
          slug: slug
        }
      });
      this.request.success(function(data, textStatus, jqXHR) {
        return $slugField.val(jqXHR.responseJSON.data.uniqueSlug);
      });
      this.request.error(function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 422) {
          return $slugField.val(jqXHR.responseJSON.data.uniqueSlug);
        } else {
          return console.log(errorThrown);
        }
      });
      return this.request.complete((function(_this) {
        return function(jqXHR, textStatus) {
          if (textStatus !== "abort") {
            return _this.finishValidation($slugField);
          }
        };
      })(this));
    };

    Slugify.prototype.startValidation = function($slugField) {
      var loadingTemplate, loadingTemplateStyle;
      if ($slugField.siblings('.validating-icon').length) {
        return false;
      }
      loadingTemplateStyle = ['position: absolute;', 'top: 0;', 'right: 0;', 'z-index: 2;', 'padding: 5px;'];
      loadingTemplate = "<div class=\"validating-icon\" style=\"" + (loadingTemplateStyle.join(" ")) + "\"><i class=\"fa fa-spinner fa-spin\"></i></div>";
      $slugField.parent().css({
        position: 'relative'
      });
      return $(loadingTemplate).insertAfter($slugField);
    };

    Slugify.prototype.finishValidation = function($slugField) {
      $slugField.parent().css({
        position: 'relative'
      });
      return $slugField.siblings('.validating-icon').remove();
    };

    return Slugify;

  })();

  Home = (function() {
    Home.prototype.filtering = false;

    Home.prototype.slashKeyCode = 191;

    function Home() {
      this.events();
    }

    Home.prototype.events = function() {
      $(document).ready((function(_this) {
        return function() {
          return _this.initNestable();
        };
      })(this));
      $(document).on('keyup', (function(_this) {
        return function(e) {
          if (e.keyCode === _this.slashKeyCode) {
            return $('#page-search').focus();
          }
        };
      })(this));
      return $(document).on('keyup change', '#page-search', (function(_this) {
        return function(e) {
          _this.filtering = $(e.currentTarget).val().length > 0;
          return _this.handleFilter($(e.currentTarget).val());
        };
      })(this));
    };

    Home.prototype.handleFilter = function(search) {
      var results;
      results = [];
      $('.dd-item').hide().each(function() {
        var item;
        item = $(this).find('.page-title').text().toLowerCase();
        if (item.indexOf(search, 0) !== -1) {
          return results.push($(this));
        }
      });
      return _.forEach(results, (function(_this) {
        return function(result) {
          return _this.filterShowAndParent(result);
        };
      })(this));
    };

    Home.prototype.filterShowAndParent = function(item) {
      item.show();
      if (item.parents('.dd-item').length > 0) {
        return this.filterShowAndParent(item.parents('.dd-item').first());
      }
    };

    Home.prototype.initNestable = function() {
      var list;
      return list = $('.dd').nestable({
        limitByType: true,
        collapsedByDefault: Hatchly.collapsedByDefault,
        callback: (function(_this) {
          return function(rootEl, el) {
            return _this.reportNestableChanges($(el));
          };
        })(this)
      });
    };

    Home.prototype.reportNestableChanges = function($listItem) {
      var nextSibling, parentId, previousSibling;
      if (this.filtering) {
        return false;
      }
      parentId = $listItem.parent().parent().data('id');
      if (parentId == null) {
        parentId = 0;
      }
      previousSibling = $listItem.prev().data('id');
      nextSibling = $listItem.next().data('id');
      return $.ajax({
        url: Hatchly.admin_url + "/pages/_ajax/order-pages",
        data: {
          item: $listItem.data('id'),
          parent: parentId,
          previousSibling: previousSibling,
          nextSibling: nextSibling
        },
        method: 'POST',
        headers: {
          "X-CSRF-TOKEN": Hatchly.token
        }
      });
    };

    return Home;

  })();

  Vue.component('lat-lng-search', {
    name: 'lat-lng-search',
    props: ['latLng', 'apiKey'],
    data: function() {
      return {
        lat: null,
        lng: null,
        location: ''
      };
    },
    map: null,
    computed: {
      latLngObject: function() {
        return {
          lat: this.lat,
          lng: this.lng
        };
      },
      latLngJson: function() {
        return JSON.stringify(this.latLngObject);
      }
    },
    created: function() {
      return this.addGoogle();
    },
    ready: function() {
      return this.mount();
    },
    mounted: function() {
      return this.mount();
    },
    watch: {
      lat: function(newVal, oldVal) {
        if (oldVal !== null) {
          return this.recenterMap();
        }
      },
      lng: function(newVal, oldVal) {
        if (oldVal !== null) {
          return this.recenterMap();
        }
      }
    },
    methods: {
      mount: function() {
        if (this.latLng) {
          this.setLatLng(JSON.parse(this.latLng).lat, JSON.parse(this.latLng).lng);
        } else {
          this.setLatLng(53.957696, -1.0855060000000094);
        }
        return this.checkGoogle();
      },
      setLatLng: function(lat, lng) {
        this.lat = lat;
        return this.lng = lng;
      },
      checkGoogle: function() {
        if (typeof google === 'object') {
          this.initAutocomplete();
          return this.initMap();
        }
        return setTimeout((function(_this) {
          return function() {
            return _this.checkGoogle();
          };
        })(this), 10);
      },
      initAutocomplete: function() {
        var autocomplete;
        autocomplete = new google.maps.places.Autocomplete(this.$refs.autocomplete);
        return autocomplete.addListener('place_changed', (function(_this) {
          return function() {
            var location, place;
            place = autocomplete.getPlace();
            location = place.geometry.location;
            _this.location = place.formatted_address;
            return _this.setLatLng(location.lat(), location.lng());
          };
        })(this));
      },
      initMap: function() {
        this.map = new google.maps.Map(this.$refs.map, {
          zoom: 16,
          center: this.latLngObject
        });
        this.marker = new google.maps.Marker({
          position: this.latLngObject,
          draggable: true,
          map: this.map
        });
        return google.maps.event.addListener(this.marker, 'dragend', (function(_this) {
          return function(marker) {
            return _this.setLatLng(_this.marker.position.lat(), _this.marker.position.lng());
          };
        })(this));
      },
      addGoogle: function() {
        var script;
        if (document.getElementById('google-maps-script')) {
          return;
        }
        script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=" + this.apiKey + "&libraries=places";
        script.id = "google-maps-script";
        return document.body.appendChild(script);
      },
      recenterMap: function() {
        if (this.marker) {
          this.marker.setPosition(this.latLngObject);
        }
        if (this.map) {
          return this.map.panTo(this.latLngObject);
        }
      }
    }
  });

  $(document).on('Hatchly.start', function() {
    new Slugify;
    if (Page.is('pagesindex')) {
      new Home;
    }
    if (Page.is('pagesedit') || Page.is('pagescreate')) {
      return new Form;
    }
  });

}).call(this);
