/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.MainScreenView = Backbone.View.extend({

		el: '#app',

		initialize: function() {

			_.bindAll(this);

			var html = app.Template.get('main_screen');

			this.mainScreenTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();

			this.resize();

		},

		render: function() {
		
			this.$el.html(this.mainScreenTemplate());
		
		},

		define_elements: function() {

			this.$view = this.$('.view');

			this.$form = this.$('.window.form');
			this.$fields = this.$form.find('input[name="game_type"]');
			this.$submit_button = this.$form.find('.button.submit');

		},

		observe: function() {

			this.$submit_button.on('click', this.formSubmitted);

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		resize: function() {

			this.setViewHeight();

		},

		setViewHeight: function() {

			var appHeight = app.AppView.getAppHeight();
			var viewPaddingMarginBorder = this.$view.borderPaddingMarginHeight();

			this.$view.height(appHeight - viewPaddingMarginBorder);

		},

		formSubmitted: function() {

			var gameType = this.getSelectedGameType();

			switch (gameType)
			{
				case 'new_game':

					app.NewGame = new newGame();

					// Show the Select World Size view.
					new app.SelectWorldSizeView();

				break;

				case 'load_game':

					// Show the Load Game view.
					new app.LoadGameView();

				break;
				
				default:
				
					console.log('invalid selection!');

				break;
			}

		},

		getSelectedGameType: function() {

			var checked = this.$fields.filter(':checked');

			return checked.length > 0 ? checked.val() : null;

		}


	});

	/*
		For storing the settings for a new game.

		Uses the Session library to store previous setting choices.
	*/
	var newGame =  function() {

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

			game.settings = app.NewGame.getAllSettings();

			var dimensions = game.settings.world_size.split('x');

			var options = {
				'width' 		: parseInt(dimensions[0]),
				'height' 		: parseInt(dimensions[1]),
				'land_mass' 	: 'normal',
				'land_form' 	: 'continents',
				'climate' 		: 'temperate',
				'temperature' 	: 'normal',
				'age' 			: '4b',
				'flat' 			: false,
				'num_civs' 		: game.settings.num_civs
			};

			game.settings.width = options.width;
			game.settings.height = options.height;

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

});