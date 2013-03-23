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

		render: function() {
		
			this.$el.html(this.mainScreenTemplate());
		
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
					// !!!

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

		initialize();

		// "Public" methods.
		this.getAllSettings 	= getAllSettings;
		this.getSetting 		= getSetting;
		this.saveSetting 		= saveSetting;
		this.getLastSelected 	= getLastSelected;

		return this;

	}

});