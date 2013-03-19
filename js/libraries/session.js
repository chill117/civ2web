/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Session = function() {

		/*
			Returns TRUE if the user has a game in progress.

			Otherwise, returns FALSE.
		*/
		this.hasGameInProgess = function() {

			return this.get('gameInProgess') !== null;

		},

		/*
			Returns just the value associated with the session variable.
		*/
		this.get = function(name) {

			var data = app.SessionDataCollection.localStorage.find({id: name});

			return data !== null ? data.value : null;

		},

		/*
			Sets a session variable with the given arguments.
		*/
		this.set = function(name, value) {

			var data = {};

			data.id = name;
			data.value = value;

			var model = new app.SessionDataModel(data);

			app.SessionDataCollection.update([model]);

			model.save();

		}

		return this;

	}

	app.Session = new Session();

})();