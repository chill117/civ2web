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
			this.define_elements();
			this.observe();
			this.resize();

		},

		define_elements: function() {

		},

		observe: function() {

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		render: function() {
		
			this.$el.html(this.statusWindowTemplate());
		
		},

		resize: function() {

			var statusWindow = new app.Window('status', this.$windows);

			statusWindow.setWidth('20%').setHeight('70%');

		}


	});

});