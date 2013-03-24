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

		},

		observe: function() {

			this.observeTopLevelAnchors();

		},

		observeTopLevelAnchors: function() {

			$(document).on('click', this.clickedDocument);

			var anchors = this.$top_level_items.find('.top-level-anchor');

			anchors.on('click', this.clickedTopLevelAnchor);

		},

		clickedDocument: function(e) {

			var _this = $(e.target);

			// Is this an active, top-level list item?
			if (_this.parents('.top-level-item.active').length === 0)
				this.$top_level_items.removeClass('active');

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

		render: function() {
		
			this.$el.html(this.gameMenuTemplate());
		
		}


	});

});