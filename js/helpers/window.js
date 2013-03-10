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
		elm.title = elm.window.children('.title');
		elm.menu = elm.window.children('.menu');
		elm.inner = elm.window.children('.inner');
	}

	function set_width(width)
	{
		elm.window.css('width', width);
	}

	function set_height(height)
	{
		if (String(height).substr(String(height).length - 1, 1) === '%')
		{
			var percent = parseFloat(String(height).substr(0, String(height).length - 1));

			height = $(window).height() * (percent / 100);
		}

		elm.window.height(height);
	}

	init();

	// "Public" methods.
	Interface.set_width 	= set_width;
	Interface.set_height 	= set_height;

	return Interface;
}