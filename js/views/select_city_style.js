/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.SelectCityStyleView = Backbone.View.extend({

		el: '#app',

		initialize: function() {

			_.bindAll(this);
			
			var html = app.Template.get('select_city_style');

			this.selectCityStyleTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();
			this.resize();

			this.setDefaultValue();

		},

		define_elements: function() {

			this.$view = this.$('.view');

			this.$form = this.$('.window.form');
			this.$fields = this.$form.find('input[name="city_style"]');
			this.$submit_button = this.$form.find('.button.submit');
			this.$cancel_button = this.$form.find('.button.cancel');

		},

		observe: function() {

			this.$submit_button.on('click', this.formSubmitted);
			this.$cancel_button.on('click', this.sendBackToSelectGenderView);

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		render: function() {
		
			this.$el.html(this.selectCityStyleTemplate());
		
		},

		resize: function() {

			this.setViewHeight();

		},

		setViewHeight: function() {

			var appHeight = app.AppView.getAppHeight();
			var viewPaddingMarginBorder = this.$view.borderPaddingMarginHeight();

			this.$view.height(appHeight - viewPaddingMarginBorder);

		},

		sendBackToSelectGenderView: function() {

			// Show the Select Gender view.
			new app.SelectGenderView();

		},

		setDefaultValue: function() {

			var civs = app.Config.get('civs');
			var tribe = app.NewGame.getSetting('tribe');

			var default_value = civs[tribe].city_style;

			this.$fields
					.filter('[value="' + default_value + '"]')
						.prop('checked', true);

		},

		formSubmitted: function() {

			var cityStyle = this.getSelectedCityStyle();

			switch (cityStyle)
			{
				case 'bronze':
				case 'classical':
				case 'far_east':
				case 'medieval':

					app.NewGame.saveSetting('city_style', cityStyle);

					// Start the game.
					new app.GameView();

				break;
				
				default:

					console.log('invalid selection!');

				break;
			}

		},

		getSelectedCityStyle: function() {

			var checked = this.$fields.filter(':checked');

			return checked.length > 0 ? checked.val() : null;

		}


	});

});