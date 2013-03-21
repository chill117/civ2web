/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.SelectWorldSizeView = Backbone.View.extend({

		el: '#app',

		initialize: function() {

			_.bindAll(this);
			
			var html = app.Template.get('select_world_size');

			this.selectWorldSizeTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();

			this.resize();

		},

		define_elements: function() {

			this.$view = this.$('.view');

			this.$image = this.$('.window.image');
			this.$form = this.$('.window.form');
			this.$fields = this.$form.find('input[name="world_size"]');
			this.$submit_button = this.$form.find('.button.submit');
			this.$cancel_button = this.$form.find('.button.cancel');

		},

		observe: function() {

			this.$submit_button.on('click', this.formSubmitted);
			this.$cancel_button.on('click', this.sendBackToMainScreen);

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		render: function() {
		
			this.$el.html(this.selectWorldSizeTemplate());
		
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

		sendBackToMainScreen: function() {

			new app.MainScreenView();

		},

		formSubmitted: function() {

			var worldSize = this.getSelectedWorldSize();

			switch (worldSize)
			{
				case '40x50':
				case '50x80':
				case '75x120':

					// Send them to the Select Difficult Level view.
					new app.SelectDifficultyLevelView();

				break;
				
				default:

					console.log('invalid selection!');

				break;
			}

		},

		getSelectedWorldSize: function() {

			var checked = this.$fields.filter(':checked');

			return checked.length > 0 ? checked.val() : null;

		}


	});

});