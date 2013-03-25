/*global $ */
var app = app || {};

$(function () {

	'use strict';

	/*
		Ready state for the different steps of the loading process.
	*/
	var ready = {
					templates: false,
					lang: false,
					config: false,
					session: false,
					sprites: false
				};

	/*
		Event listeners.
	*/
	app.Event.on('app:ready', start);

	add_ready_listeners();

	function start()
	{
		if (app.Session.hasGameInProgess())
			app.Games.loadGameInProgess();
		else
			// Otherwise, fire up the Main Screen.
			new app.MainScreenView();
	}

	function add_ready_listeners()
	{
		app.Event.on('templates:ready', function() {

			ready.templates = true;

			check_if_ready();

		});
		
		app.Event.on('lang:ready', function() {

			ready.lang = true;

			check_if_ready();

		});
		
		app.Event.on('config:ready', function() {

			ready.config = true;

			check_if_ready();

		});
		
		app.Event.on('session:ready', function() {

			ready.session = true;

			check_if_ready();

		});

		app.Event.on('sprites:ready', function() {

			ready.sprites = true;

			check_if_ready();

		});
	}

	function check_if_ready()
	{
		for (var i in ready)
			if (!ready[i])
				// Not ready yet.
				return;

		// Good to go.
		app.Event.trigger('app:ready');
	}

	/*
		Let's things listening for this event know that it's time to load stuff.
	*/
	app.Event.trigger('app:load');

});




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