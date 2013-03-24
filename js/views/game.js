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

			this.$game_menu = this.$('#game-menu');

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

			this.resizeMapWindow();
			this.resizeMiniMapWindow();
			this.resizeStatusWindow();

		},

		resizeMapWindow: function() {

			var mapWindow = new app.Window('map', this.$view);

			mapWindow.setWidth('80%').setHeight('100%');

			this.$map.
				attr({
					'width' 	: this.$map.parent().width(),
					'height' 	: this.$map.parent().height()
				});

		},

		resizeMiniMapWindow: function() {

			var miniMapWindow = new app.Window('mini-map', this.$view);

			miniMapWindow.setWidth('20%').setHeight('30%');

			this.$mini_map.
				attr({
					'width' 	: this.$mini_map.parent().width(),
					'height' 	: this.$mini_map.parent().height()
				});

		},

		resizeStatusWindow: function() {

			var statusWindow = new app.Window('status', this.$view);

			statusWindow.setWidth('20%').setHeight('70%');

		},

		setViewHeight: function() {

			var appHeight = app.AppView.getAppHeight();
			var gameMenuHeight = this.$game_menu.outerHeight(true);
			var viewPaddingMarginBorder = this.$view.borderPaddingMarginHeight();

			this.$view.height(appHeight - (gameMenuHeight + viewPaddingMarginBorder));

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