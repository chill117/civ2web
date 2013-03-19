/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.MainScreenView = Backbone.View.extend({

		el: '#app',

		initialize: function() {

			_.bindAll(this);

			var _this = this;

			app.Templates.load('main_screen', {

				success: function(html) {

					_this.mainScreenTemplate = _.template(html);

					_this.render();
					_this.define_elements();
					_this.observe();

					_this.resize();

				},

				error: function() {

					console.log('failed to load main screen template!');

				}

			});

		},

		define_elements: function() {

			this.$form = this.$('.window.form');
			this.$game_type_fields = this.$form.find('input[name="game_type"]');
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

		},

		formSubmitted: function() {

			var gameType = this.getSelectedGameType();

			switch (gameType)
			{
				case 'new_game':

					console.log('new game!');

				break;

				case 'customize_world':

					console.log('customize world!');

				break;

				case 'load_game':

					console.log('load game!');

				break;
				
				default:

					// Invalid Game Type selected.

				break;
			}

		},

		getSelectedGameType: function() {

			var checked = this.$game_type_fields.filter(':checked');

			return checked.length > 0 ? checked.val() : null;

		}


	});

});