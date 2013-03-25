/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.LoadGameView = Backbone.View.extend({

		initialize: function() {

			_.bindAll(this);

			this.render();
			this.define_elements();
			this.observe();

			this.GameListView = new GameListView({el: this.$content});

			this.resize();

		},

		define_elements: function() {

			this.$content = this.modal.find('.content');
			this.$submit_button = this.modal.find('.submit.button');
			this.$cancel_button = this.modal.find('.cancel.button');

		},

		render: function() {
			
			var html = app.Template.get('load_game');

			this.loadGameTemplate = _.template(html);

			this.modal = new app.Modal(this.loadGameTemplate());

		},

		observe: function() {

			$(window).on('resize.app', _.bind(this.resize, this));

			this.$submit_button.on('click', this.loadSelectedGame);

			this.$cancel_button.on('click', this.destroy);

		},

		resize: function() {

			this.modal.center();

		},

		destroy: function() {

			this.modal.remove();

			$(this.el).removeData().unbind();

		},

		loadSelectedGame: function() {

			var selectedGame = this.getSelectedGame();

			if (selectedGame !== false)
			{
				this.destroy();

				app.Games.load(selectedGame);
			}

		},

		getSelectedGame: function() {

			var list = this.GameListView.$el.find('.list');

			var selectedGame = list.find('[data-id].selected');

			return selectedGame.length > 0 ? selectedGame.data('id') : false;

		}

	});

	var GameListView = Backbone.View.extend({

		initialize: function() {

			_.bindAll(this);

			this.render();
			this.define_elements();
			this.observe();

		},

		render: function() {
			
			var html = app.Template.get('list_of_saved_games');

			this.listOfSavedGamesTemplate = _.template(html);

			var data = {};

			data.games = app.Games.getAll();

			this.$el.html(this.listOfSavedGamesTemplate(data));

		},

		define_elements: function() {

			this.$games = this.$('[data-id]');

		},

		observe: function() {

			this.$games.on('click', this.selectGame)

		},

		selectGame: function(e) {

			var _this = $(e.target);
			var game;

			if (_this.data('id'))
				game = _this;
			else
				game = _this.parents('[data-id]');

			// Is this game already selected?
			if (game.hasClass('selected'))
				return;

			this.$games.filter('.selected').removeClass('selected');

			game.addClass('selected');

		}

	});

});