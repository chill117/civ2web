app.helpers.window = function(type)
{
	"use strict";

	/*
		!!! DESCRIPTION
	*/
	
	var 	Interface 	= {},
			elm 		= {};

	/*
		This is executed when this helper class is instantiated.
	*/
	function init()
	{
		define_elements();
	}

	function define_elements()
	{
		elm.window = $('.window.' + type);
		elm.inner = elm.window.find('.inner');
		elm.title = elm.inner.find('.title');
		elm.menu = elm.inner.find('.menu');
		elm.content = elm.inner.find('.content');
	}

	function set_width(width)
	{
		if (String(width).substr(String(width).length - 1, 1) === '%')
		{
			var percent = parseFloat(String(width).substr(0, String(width).length - 1));

			width = $(window).width() * (percent / 100);
		}

		elm.window.
				css('width', width);

		elm.content.
				css('width', calculate_content_width());
	}

	function calculate_content_width()
	{
		var content_width = elm.window.width();

		$.each(elm.content.parents(), function(i, parent) {

			if ($(parent)[0] == elm.window[0])
				return;

			// Subtract the vertical padding + margin + border-width.
			content_width -= ($(parent).outerWidth(true) - $(parent).width());

		});
		
		return content_width;
	}

	function set_height(height)
	{
		if (String(height).substr(String(height).length - 1, 1) === '%')
		{
			var percent = parseFloat(String(height).substr(0, String(height).length - 1));

			height = $(window).height() * (percent / 100);
		}

		elm.window.
				css('height', height);

		elm.inner.
				css('height', calculate_inner_height());

		elm.content.
				css('height', calculate_content_height());
	}

	function calculate_content_height()
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

	function calculate_inner_height()
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

	function find(selector)
	{
		return elm.content.find(selector);
	}

	init();

	// "Public" methods.
	Interface.set_width 		= set_width;
	Interface.set_height 		= set_height;
	Interface.find 				= find;

	return Interface;
}