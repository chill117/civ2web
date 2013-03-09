/*
	This file contains the application core component.

	It initializes all available components when the document is ready.
*/

$(document).ready(function() {

	app.core = new app.core();
	app.core.init();

	var timers = {};

	$(window).on('resize', function(e) {

		if (timers['window:resize'] !== undefined)
			clearTimeout(timers['window:resize']);

		timers['window:resize'] = setTimeout(function() {
			app.core.trigger('window:resize', [e]);
		}, 250);

	});

	$(document).on('click', function(e) {
		app.core.trigger('document:click', [e]);
	});

	$(window).on('keydown', function(e) {
		app.core.trigger('window:keydown', [e]);
	});

	$(window).on('keyup', function(e) {
		app.core.trigger('window:keyup', [e]);
	});

});

// Make sure console.log() exists.
if ( ! window.console ) console = { log: function(){} };

var app = {};

app.debugging = true;

app.components = {};
app.helpers = {};

app.core = function()
{
	var Interface = {};

	function init()
	{
		initialize_components();

		trigger('app:ready');
	}

	/*
		Executes the callbacks for all initalized components.
	*/
	function trigger(name, args)
	{
		if (args === undefined || args === null)
			args = [];

		for (var component in app.components)
			if (
				app[component].callbacks !== undefined &&
				app[component].callbacks[name] !== undefined &&
				typeof app[component].callbacks[name] === 'function'
			)
				app[component].callbacks[name].apply(this, args);
	}

	function initialize_components()
	{
		for (var component in app.components)
			app[component] = new app.components[component]();

		for (var component in app.components)
			if (
				app[component].init !== undefined &&
				typeof app[component].init === 'function'
			)
				app[component].init();
	}

	// "Public" methods
	Interface.init 		= init;
	Interface.trigger 	= trigger;

	return Interface;
}

function rand(from, to)
{
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function is_array(variable)
{
	return Object.prototype.toString.call(variable) === '[object Array]';
}

function object_size(obj)
{
	var size = 0, key;

	for (key in obj)
		if (obj.hasOwnProperty(key))
			size++;

	return size;
}

function randomize_array(array)
{
	var i = array.length, j, tempi, tempj;

	if (i == 0)
		return false;

	while (--i)
	{
		j = Math.floor(Math.random() * (i + 1));
		tempi = array[i];
		tempj = array[j];
		array[i] = tempj;
		array[j] = tempi;
	}

	return array;
}