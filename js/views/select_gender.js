/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.SelectGenderView = Backbone.View.extend({

		el: '#app',

		initialize: function() {

			_.bindAll(this);
			
			var html = app.Template.get('select_gender');

			this.selectGenderTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();
			this.resize();

			this.setLastSelected();

		},

		define_elements: function() {

			this.$view = this.$('.view');

			this.$image = this.$('.window.image');
			this.$form = this.$('.window.form');
			this.$fields = this.$form.find('input[name="gender"]');
			this.$submit_button = this.$form.find('.button.submit');
			this.$cancel_button = this.$form.find('.button.cancel');

		},

		observe: function() {

			this.$submit_button.on('click', this.formSubmitted);
			this.$cancel_button.on('click', this.sendBackToSelectDifficultyLevelView);

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		render: function() {
		
			this.$el.html(this.selectGenderTemplate());
		
		},

		resize: function() {

			this.setViewHeight();
			this.positionElements();

		},

		setViewHeight: function() {

			var appHeight = app.AppView.getAppHeight();
			var viewPaddingMarginBorder = this.$view.borderPaddingMarginHeight();

			this.$view.height(appHeight - viewPaddingMarginBorder);

		},

		positionElements: function() {

			this.$image.center('x', this.$view);
			this.$form.center('x', this.$view);

		},

		sendBackToSelectDifficultyLevelView: function() {

			// Show the Select Difficult view.
			new app.SelectDifficultyLevelView();

		},

		setLastSelected: function() {

			var last_selected = app.NewGame.getLastSelected('gender');

			if (last_selected !== null)
				this.$fields
						.filter('[value="' + last_selected + '"]')
							.prop('checked', true);

		},

		formSubmitted: function() {

			var gender = this.getSelectedGender();

			switch (gender)
			{
				case 'male':
				case 'female':

					app.NewGame.saveSetting('gender', gender);

					// Show the Select Tribe view.
					new app.SelectTribeView();

				break;
				
				default:

					console.log('invalid selection!');

				break;
			}

		},

		getSelectedGender: function() {

			var checked = this.$fields.filter(':checked');

			return checked.length > 0 ? checked.val() : null;

		}


	});

});