/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.GameMenuView = Backbone.View.extend({

		initialize: function() {

			_.bindAll(this);
			
			var html = app.Template.get('game/menu');

			this.gameMenuTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();

		},

		define_elements: function() {

			this.$top_level_items = this.$('.top-level-item');
			this.$sub_menu_items = this.$('.sub-menu-item');

		},

		render: function() {
		
			this.$el.html(this.gameMenuTemplate());
		
		},

		observe: function() {

			this.observeTopLevelAnchors();

		},

		observeTopLevelAnchors: function() {

			$(document).on('click', this.clickedDocument);

			var anchors = this.$top_level_items.find('.top-level-anchor');

			anchors.on('click', this.clickedTopLevelAnchor);

			this.$sub_menu_items.on('click', this.clickedSubMenuItem);

		},

		hideAllSubMenus: function() {

			this.$top_level_items.removeClass('active');

		},

		clickedDocument: function(e) {

			var _this = $(e.target);

			// Is this an active, top-level list item?
			if (_this.parents('.top-level-item.active').length === 0)
				this.hideAllSubMenus();

		},

		clickedTopLevelAnchor: function(e) {

			var _this = $(e.target);

			var list_item = _this.parents('.top-level-item');

			// Is this Sub Menu already active?
			if (list_item.hasClass('active'))
				list_item.removeClass('active');
			else
			{
				// Clear the current active, top-level list item.
				this.$top_level_items.filter('.active').removeClass('active');

				list_item.addClass('active');
			}

		},

		clickedSubMenuItem: function(e) {

			var _this = $(e.target);

			var action = _this.data('action');

			this.hideAllSubMenus();

			switch (action)
			{
				case 'game_options':

					// Show the Game Options view.
					new app.GameOptionsView();

				break;

				case 'city_report_options':

					// Show the City Report Options view.
					new app.CityReportOptionsView();

				break;

				case 'save_game':
				break;

				case 'load_game':

					// Show the Load Game view.
					new app.LoadGameView();

				break;

				case 'retire':
				break;

				case 'quit':

					// Show the Quit Game view.
					new app.QuitGameView();

				break;

				case 'tax_rate':
				break;

				case 'find_city':
				break;

				case 'revolution':
				break;

				case 'move_pieces':
				break;

				case 'view_pieces':
				break;

				case 'civilopedia_advances':
				break;

				case 'civilopedia_improvements':
				break;

				case 'civilopedia_wonders':
				break;

				case 'civilopedia_units':
				break;

				case 'civilopedia_governments':
				break;

				case 'civilopedia_terrain':
				break;

				case 'civilopedia_game_concepts':
				break;
			}

		}


	});

});