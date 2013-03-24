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

		},

		observe: function() {

		},

		render: function() {
		
			this.$el.html(this.gameMenuTemplate());
		
		}


	});

});