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

					console.log('Failed to load template: main_screen');

				}

			});

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

					// Send them to the Select World Size view.
					new app.SelectWorldSizeView();

				break;

				case 'customize_world':

					// Send them to the Select World Size view.
					new app.SelectWorldSizeView();

				break;

				case 'load_game':

					console.log('load game!');

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