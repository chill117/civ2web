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

					app.NewGame = app.Games.prepareNewGame();

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

});