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

			this.GameMenuView = new app.GameMenuView({el: '#game-menu'});
			
			// Must go after GameMenuView, but before the Window views.
			this.resize();

			this.MapWindowView = new app.MapWindowView({el: '#map-window', windows: this.$windows});
			this.MiniMapWindowView = new app.MiniMapWindowView({el: '#mini_map-window', windows: this.$windows});
			this.StatusWindowView = new app.StatusWindowView({el: '#status-window', windows: this.$windows});

		},

		define_elements: function() {

			this.$view = this.$('.view');
			this.$windows = this.$view.children('.windows');

		},

		observe: function() {

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		render: function() {
		
			this.$el.html(this.gameTemplate());
		
		},

		resize: function() {

			this.setViewHeight();
			this.setWindowsContainerHeight();

		},

		setViewHeight: function() {

			var appHeight = app.AppView.getAppHeight();
			var viewPaddingMarginBorder = this.$view.borderPaddingMarginHeight();

			this.$view.height(appHeight - viewPaddingMarginBorder);

		},

		setWindowsContainerHeight: function() {

			var viewHeight = this.$view.height();
			var gameMenuHeight = this.GameMenuView.$el.height();
			var windowsPaddingMarginBorder = this.$windows.borderPaddingMarginHeight();

			this.$windows.height(viewHeight - (windowsPaddingMarginBorder + gameMenuHeight));

		}


	});

});