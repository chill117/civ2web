/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.AppView = Backbone.View.extend({

		el: '#app',

		initialize: function () {

			_.bindAll(this);

			this.define_elements();
			this.observe();
			this.resize();

		},

		define_elements: function() {

		},

		observe: function() {

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		resize: function() {

			this.setAppHeight();

		},

		getAppHeight: function() {

			return this.$el.height();

		},

		setAppHeight: function() {

			this.$el.height(this.calculateAppHeight());

		},

		calculateAppHeight: function() {

			var viewPortHeight = $(window).height();
			var appPaddingMarginBorder = (this.$el.outerHeight(true) - this.$el.height());

			return viewPortHeight - (appPaddingMarginBorder);

		}


	});

	new app.AppView();

});