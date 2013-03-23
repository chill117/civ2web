/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.SelectBarbarianLevel = Backbone.View.extend({

		el: '#app',

		initialize: function() {

			_.bindAll(this);

			var html = app.Template.get('select_barbarian_level');

			this.selectBarbarianLevelTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();
			this.resize();

			this.setLastSelected();

		},

		define_elements: function() {

			this.$view = this.$('.view');

			this.$form = this.$('.window.form');
			this.$fields = this.$form.find('input[name="barbarian_level"]');
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
		
			this.$el.html(this.selectBarbarianLevelTemplate());
		
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

			var last_selected = app.NewGame.getLastSelected('barbarian_level');

			if (last_selected !== null)
				this.$fields
						.filter('[value="' + last_selected + '"]')
							.prop('checked', true);

		},

		pickRandom: function() {

			this.$fields.filter(':random').prop('checked', true);

			this.formSubmitted();

		},

		formSubmitted: function() {

			var barbarianLevel = this.getSelectedBarbarianLevel();

			switch (barbarianLevel)
			{
				case 'villages_only':
				case 'roving_bands':
				case 'restless_tribes':
				case 'raging_hordes':

					app.NewGame.saveSetting('barbarian_level', barbarianLevel);

					// Show the Select Gender view.
					new app.SelectGenderView();

				break;
				
				default:

					console.log('invalid selection!');

				break;
			}

		},

		getSelectedBarbarianLevel: function() {

			var checked = this.$fields.filter(':checked');

			return checked.length > 0 ? checked.val() : null;

		}


	});

});