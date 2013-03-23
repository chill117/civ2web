/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.GameView = Backbone.View.extend({

		el: '#app',

		initialize: function() {

			_.bindAll(this);
			
			var html = app.Template.get('game');

			this.gameTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();
			this.resize();

		},

		define_elements: function() {

			this.$view = this.$('.view');

		},

		observe: function() {

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		render: function() {

			var data = {};
		
			this.$el.html(this.gameTemplate(data));
		
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



		}


	});

});