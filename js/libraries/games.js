/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Games = function() {

		/*
			Loads a game.
		*/
		function load(game_id) {

			app.Game = get(game_id);

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

			return data !== null ? new Game(data) : null;

		}

		/*
			Creates a new game and returns the new game's ID.
		*/
		function create(game) {

			game.name = generateGameName(game);

			return app.GamesCollection.create(game).get('id');

		}

		/*
			Generate a name for a game.
		*/
		function generateGameName(game) {

			return game.settings.leader + ' ' + calculateYear(game.turn);

		}

		/*
			Calculates the game year given the turn number.
		*/
		function calculateYear(turn) {

			// Start at 4000 B.C.
			var year = (-4000);

			var increments = [
				{
					'range' : [1, 60],
					'years' : 50
				},
				{
					'range' : [61, 100],
					'years' : 25
				},
				{
					'range' : [101, 175],
					'years' : 20
				},
				{
					'range' : [176, 200],
					'years' : 10
				},
				{
					'range' : [201, 250],
					'years' : 2
				},
				{
					'range' : [251],
					'years' : 1
				}
			];

			for (var i in increments)
			{
				var range = increments[i].range;
				var years = increments[i].years;

				if (turn < range[0])
					continue;

				var turnsInThisIncrement = Math.max(turn - range[0], 0);

				if (range[1] !== undefined)
				{
					var maxTurnsInThisIncrement = (range[1] - range[0]) + 1;

					turnsInThisIncrement = Math.min(turnsInThisIncrement, maxTurnsInThisIncrement);
				}

				year += turnsInThisIncrement * years;
			}

			var label = (year < 0 ? 'B.C.' : 'A.D.');

			// No 0 A.D.
			if (year === 0)
				// Change to 1 A.D.
				year = 1;

			return Math.abs(year) + ' ' + label;

		}

		function prepareNewGame() {

			return new NewGame();

		}

		// "Public" methods.
		this.load 				= load;
		this.getAll 			= getAll;
		this.get 				= get;
		this.create 			= create;
		this.prepareNewGame 	= prepareNewGame;
		this.calculateYear 		= calculateYear;

		return this;

	}

	var Game = function(data) {

		/*
			Get the value of the given attribute.
		*/
		function get(attribute) {

			return data[attribute] !== undefined ? data[attribute] : null;

		}

		/*
			Set the value for the given attribute.
		*/
		function set(attribute, value) {

			data[attribute] = value;

			var model = new app.GameModel(data);

			app.GamesCollection.update([model]);

			model.save();

		}

		// "Public" methods.
		this.get = get;
		this.set = set;

		return this;

	}

	/*
		For storing the settings for a new game.

		Uses the Session library to store previous setting choices.
	*/
	var NewGame =  function() {

		/*
			Stores all the settings for this new game.
		*/
		var settings = {};

		function initialize() {

			prepareSessionVariables();

		}

		function prepareSessionVariables() {

			if (app.Session.get('lastSelected') === null)
				app.Session.set('lastSelected', {});

		}

		function getAllSettings() {

			return settings;

		}

		function getSetting(name) {

			return settings[name] !== undefined ? settings[name] : null;
			
		}

		function saveSetting(name, value) {

			settings[name] = value;

			saveLastSelected(name, value);

		}

		function getLastSelected(name) {

			var lastSelected = app.Session.get('lastSelected');

			return lastSelected[name] !== undefined ? lastSelected[name] : null;
			
		}

		function saveLastSelected(name, value) {

			var lastSelected = app.Session.get('lastSelected');

			lastSelected[name] = value;

			app.Session.set('lastSelected', lastSelected);

		}

		function start() {

			var game = {};

			game.turn = 1;
			game.settings = app.NewGame.getAllSettings();

			var dimensions = game.settings.world_size.split('x');

			game.settings.width = parseInt(dimensions[0]);
			game.settings.height = parseInt(dimensions[1]);

			var options = {
				'width' 		: game.settings.width,
				'height' 		: game.settings.height,
				'land_mass' 	: 'normal',
				'land_form' 	: 'continents',
				'climate' 		: 'temperate',
				'temperature' 	: 'normal',
				'age' 			: '4b',
				'flat' 			: false,
				'num_civs' 		: game.settings.num_civs
			};

			var MapGenerator = new app.MapGenerator(options);

			var tiles = MapGenerator.seed();

			game.tiles = tiles;

			var game_id = app.Games.create(game);

			app.Games.load(game_id);

			app.Session.set('gameInProgress', game_id);

		}

		initialize();

		// "Public" methods.
		this.getAllSettings 	= getAllSettings;
		this.getSetting 		= getSetting;
		this.saveSetting 		= saveSetting;
		this.getLastSelected 	= getLastSelected;
		this.start 				= start;

		return this;

	}

	app.Games = new Games();

})();