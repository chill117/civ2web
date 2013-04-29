/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.StatusWindowView = Backbone.View.extend({

		initialize: function(options) {

			_.bindAll(this);

			this.$windows = options.windows;
			
			var html = app.Template.get('game/status');

			this.statusWindowTemplate = _.template(html);

			this.render();
			this.observe();
			this.resize();

		},

		render: function() {
		
			this.$el.html(this.statusWindowTemplate());
		
		},

		observe: function() {

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		resize: function() {

			var statusWindow = new app.Window('status', this.$windows);

			statusWindow.setWidth('20%').setHeight('70%');

		}


	});

});