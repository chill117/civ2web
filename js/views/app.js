/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	/*
		Prepares the app element.
	*/

	var AppView = Backbone.View.extend({

		el: '#app',

		initialize: function () {

			_.bindAll(this);

			this.observe();
			this.resize();

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
			var appPaddingMarginBorder = this.$el.borderPaddingMarginHeight();

			return viewPortHeight - appPaddingMarginBorder;

		}

	});

	app.AppView = new AppView();

});