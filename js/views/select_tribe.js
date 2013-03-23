/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.SelectTribeView = Backbone.View.extend({

		el: '#app',

		initialize: function() {

			_.bindAll(this);

			this.civs = app.Config.get('civs');
			
			var html = app.Template.get('select_tribe');

			this.selectTribeTemplate = _.template(html);

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
			this.$fields = this.$form.find('input[name="tribe"]');
			this.$custom_button = this.$form.find('.button.custom');
			this.$submit_button = this.$form.find('.button.submit');
			this.$cancel_button = this.$form.find('.button.cancel');

		},

		observe: function() {

			this.$submit_button.on('click', this.formSubmitted);
			this.$cancel_button.on('click', this.sendBackToSelectGenderView);

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		render: function() {
		
			this.$el.html(this.selectTribeTemplate({
				civs: this.civs
			}));
		
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

		sendBackToSelectGenderView: function() {

			// Show the Select Gender view.
			new app.SelectGenderView();

		},

		setLastSelected: function() {

			var last_selected = app.NewGame.getLastSelected('tribe');

			if (last_selected !== null)
				this.$fields
						.filter('[value="' + last_selected + '"]')
							.prop('checked', true);

		},

		formSubmitted: function() {

			var tribe = this.getSelectedTribe();

			if (this.civs[tribe] !== undefined)
			{
				app.NewGame.saveSetting('tribe', tribe);

				// Show the Enter Your Name view.
				new app.EnterYourNameView();
			}
			else
			{
				console.log('invalid selection!');
			}

		},

		getSelectedTribe: function() {

			var checked = this.$fields.filter(':checked');

			return checked.length > 0 ? checked.val() : null;

		}


	});

});