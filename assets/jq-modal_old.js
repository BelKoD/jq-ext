;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}
(function ($) {
    var d = [],
        doc = $(document),
        ua = navigator.userAgent.toLowerCase(),
        wndw = $(window),
        isShow = null,
        w = [];

    var browser = {
        ieQuirks: null,
        msie: /msie/.test(ua) && !/opera/.test(ua),
        opera: /opera/.test(ua)
    };
    browser.ie6 = browser.msie && /msie 6./.test(ua) && typeof window['XMLHttpRequest'] !== 'object';
    browser.ie7 = browser.msie && /msie 7.0/.test(ua);

    /*
     * Create and display a modal dialog.
     *
     * @param {string, object} data A string, jQuery object or DOM object
     * @param {object} [options] An optional object containing options overrides
     */
    $.modalb = function (data, options) {
        return $.modalb.impl.init(data, options);
    };

    /*
     * Close the modal dialog.
     */
    $.modalb.close = function () {
        $.modalb.impl.open();
    };

    $.modalb.open = function () {
        $.modalb.impl.close();
    };

    /*
     * Set focus on first or last visible input in the modal dialog. To focus on the last
     * element, call $.modal.focus('last'). If no input elements are found, focus is placed
     * on the data wrapper element.
     */
    $.modalb.focus = function (pos) {
        $.modalb.impl.focus(pos);
    };

    /*
     * Determine and set the dimensions of the modal dialog container.
     * setPosition() is called if the autoPosition option is true.
     */
    $.modalb.setContainerDimensions = function () {
        //$.modal.impl.setContainerDimensions();
    };

    /*
     * Re-position the modal dialog.
     */
    $.modalb.setPosition = function () {
        //$.modal.impl.setPosition();
    };

    /*
     * Update the modal dialog. If new dimensions are passed, they will be used to determine
     * the dimensions of the container.
     *
     * setContainerDimensions() is called, which in turn calls setPosition(), if enabled.
     * Lastly, focus() is called is the focus option is true.
     */
    $.modalb.update = function (height, width) {
        //$.modal.impl.update(height, width);
    };

    /*
     * Chained function to create a modal dialog.
     *
     * @param {object} [options] An optional object containing options overrides
     */
    $.fn.modalb = function (options) {
        //return $.modalb.impl.init(this, options);
        return this.each(function () {
          console.log($(this));

            var $this   = $(this);
            var data    = $this.data('modalb');
          var options = $.extend({}, $.modalb.defaults, typeof option == 'object' && option)

          if (!data) $this.data('modalb', (data = new $.modalb(this, options)))
            return $.modalb.impl.init($this, options);
        })

    };

    $.modalb.defaults = {
        appendTo: 'body',
        focus: true,
        opacity: 50,
        overlayId: 'simplemodal-overlay',
        overlayCss: {},
        containerId: 'simplemodal-container',
        containerCss: {},
        dataId: 'simplemodal-data',
        dataCss: {},
        minHeight: null,
        minWidth: null,
        maxHeight: null,
        maxWidth: null,
        autoResize: false,
        autoPosition: true,
        zIndex: 1000,
        close: true,
        closeHTML: '<a class="modalCloseImg" title="Close"></a>',
        closeClass: 'close',
        escClose: true,
        overlayClose: false,
        fixed: true,
        position: null,
        persist: false,
        modal: true,
        onOpen: null,
        onShow: null,
        onClose: null,
        showOnStart: false
    };

    /*
     * Main modal object
     */
    $.modalb.impl = {
        /*
         * Modal dialog options
         */
        opts: null,
        /*
         * Contains the modal dialog elements and is the object passed
         * back to the callback (onOpen, onShow, onClose) functions
         */
        d: {},
        /*
         * Initialize the modal dialog
         */
        init: function (data, options) {
            var s = this;

            // don't allow multiple calls
            if (s.d.data) {
                return false;
            }

            // $.support.boxModel is undefined if checked earlier
            browser.ieQuirks = browser.msie && !$.support.boxModel;

            // merge defaults and user options
            s.o = $.extend({}, $.modalb.defaults, options);

            // keep track of z-index
            s.zIndex = s.o.zIndex;

            // set the onClose callback flag
            s.occb = false;

            // determine how to handle the data based on its type
            if (typeof data === 'object') {
                // convert DOM object to a jQuery object
                data = data instanceof $ ? data : $(data);
            }
            else {
                // unsupported data type!
                alert('ModalB Error: Unsupported data type: ' + typeof data);
                return s;
            }

            if(!s.o.showOnStart)
            {
                data.css('display', 'none');
                s.isShow = false;
            }
            else
                s.isShow = true;

            s.create(data);

            console.log(s);
            console.log(data);

            // useful for adding events/manipulating data in the modal dialog
			if ($.isFunction(s.o.onShow)) {
				s.o.onShow.apply(s, [s.d]);
			}

            // don't break the chain =)
            return s;
        },
        create: function(data) {
            var s = this;

            // get the window properties
			s.getDimensions();

            s.d.data = data;
            s.d.dialog = data.find('.modal-dialog');
            s.d.content = s.d.dialog.find('.modal-content');
            s.d.body = s.d.content.find('.modal-body');
            s.d.selector = data.attr('id');
            // bind default events

            s.o.autoPosition && s.setPosition();

            $('[data-target="#'+ s.d.selector +'"]').each(function(){

                $(this).bind('click.modalb', function (e) {
                               e.preventDefault();
                               if(s.isShow)
                                   s.close();
                               else
                                   s.open();
                           });
            });
        },
        /*
		 * Bind events
		 */
		bindEvents: function () {
			var s = this;


			// bind the close event to any element with the closeClass class
			$('.' + s.o.closeClass).bind('click.modalb', function (e) {
				e.preventDefault();
				s.close();
			});

			// bind the overlay click to the close function, if enabled
			if (s.o.modal && s.o.close && s.o.overlayClose) {
				s.d.data.bind('click.modalb', function (e) {
					e.preventDefault();
					s.close();
				});
			}

            // update window size
			wndw.bind('resize.modalb orientationchange.modalb', function () {
				// redetermine the window width/height
				s.getDimensions();

				// reposition the dialog
				s.o.autoPosition && s.setPosition();

			});

		},
        /*
		 * Unbind events
		 */
		unbindEvents: function () {
			$('.' + this.o.closeClass).unbind('click.modalb');
			doc.unbind('keydown.modalb');
			wndw.unbind('.modalb');
			this.d.data.unbind('click.modalb');
		},

        open: function () {
            var s = this;

            if ($.isFunction(s.o.onOpen)) {
                // execute the onOpen callback
                s.o.onOpen.apply(s, [s.d]);
            }
            else {
                // display the remaining elements
                s.d.data.addClass('in').show();
                s.d.dialog.show();
                s.d.content.show();
            }

            s.o.focus && s.focus();

            // bind default events
            s.bindEvents();
        },

        close: function() {
            var s = this;

            // prevent close when dialog does not exist
            if (!s.d.data) {
                return false;
            }

            // remove the default events
			s.unbindEvents();

            if ($.isFunction(s.o.onClose) && !s.occb) {
                // set the onClose callback flag
                s.occb = true;

                // execute the onClose callback
                s.o.onClose.apply(s, [s.d]);
            }
            else {
                s.d.data.removeClass('in').hide();
            }

        },
		/*
		 * Place focus on the first or last visible input
		 */
		focus: function (pos) {
			var s = this, p = pos && $.inArray(pos, ['first', 'last']) !== -1 ? pos : 'first';

			// focus on dialog or the first visible/enabled input element
			var input = $(':input:enabled:visible:' + p, s.d.body);
			setTimeout(function () {
				input.length > 0 ? input.focus() : s.d.body.focus();
			}, 10);
		},
        getDimensions: function () {
            // fix a jQuery bug with determining the window height - use innerHeight if available
            var s = this,
                h = typeof window.innerHeight === 'undefined' ? wndw.height() : window.innerHeight;

            d = [doc.height(), doc.width()];
            w = [h, wndw.width()];
        },
        getVal: function (v, d) {
            return v ? (typeof v === 'number' ? v
                    : v === 'auto' ? 0
                    : v.indexOf('%') > 0 ? ((parseInt(v.replace(/%/, '')) / 100) * (d === 'h' ? w[0] : w[1]))
                    : parseInt(v.replace(/px/, '')))
                : null;
        },
        setPosition: function () {
            var s = this, top, left,
                hc = (w[0]/2) - (s.d.dialog.outerHeight(true)/2),
                vc = (w[1]/2) - (s.d.dialog.outerWidth(true)/2),
                st = s.d.dialog.css('position') !== 'fixed' ? wndw.scrollTop() : 0;

            if (s.o.position && Object.prototype.toString.call(s.o.position) === '[object Array]') {
                top = st + (s.o.position[0] || hc);
                left = s.o.position[1] || vc;
            } else {
                top = st + hc;
                left = vc;
            }

            if(top<0) top = 0;
            //s.d.dialog.css({left: left, top: top});
        }

    };


    /*$(document).on('click.modalb', '[data-toggle="modalb"]', function (e) {
      var $this   = $(this)
      var href    = $this.attr('href')
      var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

      e.preventDefault();

      console.log($target, option, this);


    })*/

}));

/*var modalb = (function(options){
    var
        method = {},
        $overlay,
        $modal,
        $content,
        $close;

    //console.log(options);
    // Append the HTML
    method.init = function () {};


    // Center the modal in the viewport
    method.center = function () {};

    // Open the modal
    method.open = function (settings) {};

    // Close the modal
    method.close = function () {};

    return method.init;
}());*/