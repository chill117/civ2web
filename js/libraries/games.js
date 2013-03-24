/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Games = function() {

		/*
			Retrieves the game specified by game_id.
		*/
		function get(game_id) {

			var data = app.GamesCollection.localStorage.find({id: game_id});

			return data !== null ? data : null;

		}

		/*
			Creates a new game and returns the new game's ID.
		*/
		function create(game) {

			var model = app.GamesCollection.create(game);

			return model.get('id');

		}

		// "Public" methods.
		this.get 		= get;
		this.create 	= create;

		return this;

	}

	app.Games = new Games();

})();