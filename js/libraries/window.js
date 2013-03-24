/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	app.Window = function(type, container) {

		var elm = {};

		function initialize() {

			define_elements();

		}

		function define_elements() {

			// Default to the body tag as the parent container.
			container || (container = $('body'));

			elm.window = container.find('.window.' + type);
			elm.inner = elm.window.find('.inner');
			elm.title = elm.inner.find('.title');
			elm.menu = elm.inner.find('.menu');
			elm.content = elm.inner.find('.content');
			elm.buttons = elm.inner.find('.buttons');

		}

		function setWidth(width) {

			if (String(width).substr(String(width).length - 1, 1) === '%')
			{
				var percent = parseFloat(String(width).substr(0, String(width).length - 1));

				width = $(window).width() * (percent / 100);
			}

			elm.window.
					css('width', width);

			elm.content.
					css('width', calculateContentWidth());

			return this;
		}

		function calculateContentWidth() {

			var content_width = elm.window.width();

			$.each(elm.content.parents(), function(i, parent) {

				if ($(parent)[0] == elm.window[0])
					return;

				// Subtract the vertical padding + margin + border-width.
				content_width -= ($(parent).outerWidth(true) - $(parent).width());

			});
			
			return content_width;
		}

		function setHeight(height)
		{
			if (String(height).substr(String(height).length - 1, 1) === '%')
			{
				var percent = parseFloat(String(height).substr(0, String(height).length - 1));

				height = $(window).height() * (percent / 100);
			}

			elm.window.
					css('height', height);

			elm.inner.
					css('height', calculateInnerHeight());

			elm.content.
					css('height', calculateContentHeight());

			return this;
		}

		function calculateContentHeight()
		{
			var content_height = elm.window.height();

			// Subtract the title element's height.
			content_height -= elm.title.outerHeight(true);

			$.each(elm.content.parents(), function(i, parent) {

				if ($(parent)[0] == elm.window[0])
					return;

				// Subtract the vertical padding + margin + border-width.
				content_height -= ($(parent).outerHeight(true) - $(parent).height());

			});

			return content_height;
		}

		function calculateInnerHeight()
		{
			var inner_height = elm.window.height();
			
			inner_height -= (elm.inner.outerHeight(true) - elm.inner.height());

			$.each(elm.inner.parents(), function(i, parent) {

				if ($(parent)[0] == elm.window[0])
					return;

				// Subtract the vertical padding + margin + border-width.
				inner_height -= ($(parent).outerHeight(true) - $(parent).height());

			});

			return inner_height;
		}

		initialize();

		// "Public" methods.
		this.setWidth 	= setWidth;
		this.setHeight 	= setHeight;

		return this;

	}

})();

