/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.SelectNumberOfCivsView = Backbone.View.extend({

		el: '#app',

		initialize: function() {

			_.bindAll(this);
			
			var html = app.Template.get('pre_game/select_number_of_civs');

			this.selectNumberOfCivsTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();
			this.resize();

			this.setLastSelected();

		},

		define_elements: function() {

			this.$view = this.$('.view');

			this.$form = this.$('.window.form');
			this.$fields = this.$form.find('input[name="num_civs"]');
			this.$random_button = this.$form.find('.button.random');
			this.$submit_button = this.$form.find('.button.submit');
			this.$cancel_button = this.$form.find('.button.cancel');

		},

		observe: function() {

			this.$random_button.on('click', this.pickRandom);
			this.$submit_button.on('click', this.formSubmitted);
			this.$cancel_button.on('click', this.sendBackToSelectDifficultyLevelView);

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		render: function() {
		
			this.$el.html(this.selectNumberOfCivsTemplate());
		
		},

		resize: function() {

			this.setViewHeight();

		},

		setViewHeight: function() {

			var appHeight = app.AppView.getAppHeight();
			var viewPaddingMarginBorder = this.$view.borderPaddingMarginHeight();

			this.$view.height(appHeight - viewPaddingMarginBorder);

		},

		sendBackToSelectDifficultyLevelView: function() {

			// Show the Select Difficult view.
			new app.SelectDifficultyLevelView();

		},

		setLastSelected: function() {

			var last_selected = app.NewGame.getLastSelected('num_civs');

			if (last_selected !== null)
				this.$fields
						.filter('[value="' + last_selected + '"]')
							.prop('checked', true);

		},

		pickRandom: function() {

			this.$fields.random().prop('checked', true);

			this.formSubmitted();

		},

		formSubmitted: function() {

			var numCivs = this.getSelectedNumberOfCivs();

			switch (numCivs)
			{
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':

					app.NewGame.saveSetting('num_civs', numCivs);

					// Show the Select Level of Barbarian Activity view.
					new app.SelectBarbarianLevel();

				break;
				
				default:

					console.log('invalid selection!');

				break;
			}

		},

		getSelectedNumberOfCivs: function() {

			var checked = this.$fields.filter(':checked');

			return checked.length > 0 ? checked.val() : null;

		}


	});

});