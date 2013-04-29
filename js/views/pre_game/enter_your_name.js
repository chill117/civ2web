/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.EnterYourNameView = Backbone.View.extend({

		el: '#app',

		initialize: function() {

			_.bindAll(this);
			
			var html = app.Template.get('pre_game/enter_your_name');

			this.enterNameTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();
			this.resize();

			this.setDefaultValue();

		},

		define_elements: function() {

			this.$view = this.$('.view');

			this.$image = this.$('.window.image');
			this.$form = this.$('.window.form');
			this.$field = this.$form.find('input[name="leader"]');
			this.$submit_button = this.$form.find('.button.submit');
			this.$cancel_button = this.$form.find('.button.cancel');

		},

		observe: function() {

			this.$submit_button.on('click', this.formSubmitted);
			this.$cancel_button.on('click', this.sendBackToSelectGenderView);

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		render: function() {
		
			this.$el.html(this.enterNameTemplate());
		
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

		setDefaultValue: function() {

			var leaders = app.Config.get('leaders');
			var tribe = app.NewGame.getSetting('tribe');
			var gender = app.NewGame.getSetting('gender');

			var default_value = leaders[tribe][gender];

			this.$field.val(default_value);

		},

		formSubmitted: function() {

			var leader = this.$field.val();

			if ($.trim(leader) != '')
			{
				app.NewGame.saveSetting('leader', leader);

				// Show the Select City Style view.
				new app.SelectCityStyleView();
			}
			else
			{
				console.log('invalid input!');
			}

		}


	});

});