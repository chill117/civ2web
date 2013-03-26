/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.MapWindowView = Backbone.View.extend({

		initialize: function(options) {

			_.bindAll(this);

			this.$windows = options.windows;
			
			var html = app.Template.get('game/map');

			this.mapWindowTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();
			this.resize();

			this.drawMap();

		},

		define_elements: function() {

			this.$map = this.$('#map');

		},

		observe: function() {

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		render: function() {

			var data = {};

			data.tribe = {};
			data.tribe.label = 'Vikings';
		
			this.$el.html(this.mapWindowTemplate(data));
		
		},

		resize: function() {

			var mapWindow = new app.Window('map', this.$windows);

			mapWindow.setWidth('80%').setHeight('100%');

		},

		drawMap: function() {

			var settings = app.Game.get('settings');

			var options = {};

			options.width = settings.width;
			options.height = settings.height;

			this.$map.
					attr({
						'width' 	: (settings.width + 1) * 32,
						'height' 	: (settings.height + 1) * 16
					});

			app.MapDraw(this.$map, app.Game.get('tiles'), options).draw();

		}


	});

});