/*global $ */
var app = app || {};

$(function () {

	'use strict';

	app.SessionDataCollection.fetch({

		success: function() {

			if (app.Session.hasGameInProgess())
			{
				// Continue their game.
				new app.GameView();
			}
			else
			{
				// Otherwise, fire up the Main Screen.
				new app.MainScreenView();
			}

		},

		error: function() {

			// Failed to retrieve Session Data.

		}

	});

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