/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.SelectDifficultyLevelView = Backbone.View.extend({

		el: '#app',

		initialize: function() {

			_.bindAll(this);
			
			var html = app.Template.get('pre_game/select_difficulty_level');

			this.selectDifficultyLevelTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();
			this.resize();

			this.setLastSelected();

		},

		define_elements: function() {

			this.$view = this.$('.view');

			this.$form = this.$('.window.form');
			this.$fields = this.$form.find('input[name="difficulty_level"]');
			this.$submit_button = this.$form.find('.button.submit');
			this.$cancel_button = this.$form.find('.button.cancel');

		},

		observe: function() {

			this.$submit_button.on('click', this.formSubmitted);
			this.$cancel_button.on('click', this.sendBackToMainScreen);

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		render: function() {
		
			this.$el.html(this.selectDifficultyLevelTemplate());
		
		},

		resize: function() {

			this.setViewHeight();

		},

		setViewHeight: function() {

			var appHeight = app.AppView.getAppHeight();
			var viewPaddingMarginBorder = this.$view.borderPaddingMarginHeight();

			this.$view.height(appHeight - viewPaddingMarginBorder);

		},

		sendBackToMainScreen: function() {

			// Show the Main Screen view.
			new app.MainScreenView();

		},

		setLastSelected: function() {

			var last_selected = app.NewGame.getLastSelected('difficulty_level');

			if (last_selected !== null)
				this.$fields
						.filter('[value="' + last_selected + '"]')
							.prop('checked', true);

		},

		formSubmitted: function() {

			var difficultyLevel = this.getSelectedDifficultyLevel();

			switch (difficultyLevel)
			{
				case 'chieftain':
				case 'warlord':
				case 'prince':
				case 'king':
				case 'emperor':
				case 'deity':

					app.NewGame.saveSetting('difficulty_level', difficultyLevel);

					// Show the Select Number of Civs view.
					new app.SelectNumberOfCivsView();

				break;
				
				default:

					console.log('invalid selection!');

				break;
			}

		},

		getSelectedDifficultyLevel: function() {

			var checked = this.$fields.filter(':checked');

			return checked.length > 0 ? checked.val() : null;

		}


	});

});