/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Session = function() {

		/*
			Returns TRUE if the user has a game in progress.

			Otherwise, returns FALSE.
		*/
		function hasGameInProgess() {

			return this.get('gameInProgress') !== null;

		}

		/*
			Returns just the value associated with the session variable.
		*/
		function get(name) {

			var data = app.SessionDataCollection.localStorage.find({id: name});

			return data !== null ? data.value : null;

		}

		/*
			Sets a session variable with the given arguments.
		*/
		function set(name, value) {

			var data = {};

			data.id = name;
			data.value = value;

			var model = new app.SessionDataModel(data);

			app.SessionDataCollection.update([model]);

			model.save();

		}

		/*
			Auto-loads the session data.
		*/
		function autoLoad() {

			app.SessionDataCollection.fetch({

				success: function() {

					app.Event.trigger('session:ready');

				}

			});

		}

		app.Event.on('app:load', autoLoad);

		// "Public" methods.
		this.hasGameInProgess 	= hasGameInProgess;
		this.get 				= get;
		this.set 				= set;

		return this;

	}

	app.Session = new Session();

})();