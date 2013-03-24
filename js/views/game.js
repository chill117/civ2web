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

			var game_id = app.Session.get('gameInProgress');

			this.game = app.Games.get(game_id);

			this.drawMap();
			this.drawMiniMap();

		},

		define_elements: function() {

			this.$view = this.$('.view');

			this.$map = this.$('#map');
			this.$mini_map = this.$('#mini-map');

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

			var map_window = new app.Window('map', this.$view);
			var status_window = new app.Window('status', this.$view);
			var mini_map_window = new app.Window('mini-map', this.$view);

			map_window.setWidth('80%').setHeight('100%');
			status_window.setWidth('20%').setHeight('80%');
			mini_map_window.setWidth('20%').setHeight('20%');

			this.$map.
				attr({
					'width' 	: this.$map.parent().width(),
					'height' 	: this.$map.parent().height()
				});

			this.$mini_map.
				attr({
					'width' 	: this.$mini_map.parent().width(),
					'height' 	: this.$mini_map.parent().height()
				});

		},

		setViewHeight: function() {

			var appHeight = app.AppView.getAppHeight();
			var viewPaddingMarginBorder = this.$view.borderPaddingMarginHeight();

			this.$view.height(appHeight - viewPaddingMarginBorder);

		},

		drawMap: function() {

			var options = {};

			options.width = this.game.settings.width;
			options.height = this.game.settings.height;

			app.MapDraw(this.$map, this.game.tiles, options).draw();

		},

		drawMiniMap: function() {
			
		}


	});

});