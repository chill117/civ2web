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

			this.$map.
				attr({
					'width' 	: this.$map.parent().width(),
					'height' 	: this.$map.parent().height()
				});

		},

		drawMap: function() {

			var options = {};

			options.width = app.Game.settings.width;
			options.height = app.Game.settings.height;

			app.MapDraw(this.$map, app.Game.tiles, options).draw();

		}


	});

});