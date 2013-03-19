/*global $ */
var app = app || {};

$(function () {

	'use strict';

	app.SessionDataCollection.fetch({

		success: function() {

			// Session Data is ready.

			// Fire up the Main Screen.
			new app.MainScreenView();

		},

		error: function() {

			// Failed to retrieve Session Data.

		}

	});

});