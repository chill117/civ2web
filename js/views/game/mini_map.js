/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.MiniMapWindowView = Backbone.View.extend({

		initialize: function(options) {

			_.bindAll(this);

			this.$windows = options.windows;
			
			var html = app.Template.get('game/mini_map');

			this.miniMapTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();
			this.resize();

			this.drawMiniMap();

		},

		define_elements: function() {
			
			this.$mini_map = this.$('#mini-map');

		},

		observe: function() {

			$(window).on('resize.app', _.bind(this.resize, this));

		},

		resize: function() {

			var miniMapWindow = new app.Window('mini-map', this.$windows);

			miniMapWindow.setWidth('20%').setHeight('30%');

			this.$mini_map.
				attr({
					'width' 	: this.$mini_map.parent().width(),
					'height' 	: this.$mini_map.parent().height()
				});

		},

		render: function() {
		
			this.$el.html(this.miniMapTemplate());
		
		},

		drawMiniMap: function() {
			
		}


	});

});