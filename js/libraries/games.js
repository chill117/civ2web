/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Games = function() {

		/*
			Loads a game.
		*/
		function load(game_id) {

			app.Session.set('gameInProgess', game_id);

			// Show the Game view.
			new app.GameView();

		}

		/*
			Retrieves all saved games.
		*/
		function getAll() {

			return app.GamesCollection.localStorage.findAll();

		}

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

			game.turn = 1;
			game.year = calculateYear(game.turn);
			game.name = generateGameName(game);

			return app.GamesCollection.create(game).get('id');

		}

		/*
			Generate a name for a game.
		*/
		function generateGameName(game) {

			return game.settings.leader + ' ' + game.year;

		}

		/*
			Calculates the game year based on the turn number.
		*/
		function calculateYear(turn) {

			return '4000 B.C.';

		}

		// "Public" methods.
		this.load 			= load;
		this.getAll 		= getAll;
		this.get 			= get;
		this.create 		= create;
		this.calculateYear 	= calculateYear;

		return this;

	}

	app.Games = new Games();

})();