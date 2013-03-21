/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.SelectTribeView = Backbone.View.extend({

		el: '#app',

		initialize: function() {

			_.bindAll(this);
			
			var html = app.Template.get('select_tribe');

			this.selectTribeTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();

			this.resize();

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
		
			this.$el.html(this.selectTribeTemplate());
		
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

			new app.SelectGenderView();

		},

		formSubmitted: function() {

			var tribe = this.getSelectedTribe();

			switch (tribe)
			{
				case '':

				break;
				
				default:

					console.log('invalid selection!');

				break;
			}

		},

		getSelectedTribe: function() {

			var checked = this.$fields.filter(':checked');

			return checked.length > 0 ? checked.val() : null;

		}


	});

});