/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.QuitGameView = Backbone.View.extend({

		initialize: function() {

			_.bindAll(this);

			this.render();
			this.define_elements();
			this.observe();
			this.resize();

		},

		render: function() {
			
			var html = app.Template.get('game/quit');

			this.quitGameTemplate = _.template(html);

			this.modal = new app.Modal(this.quitGameTemplate());

		},

		define_elements: function() {

			this.$fields = this.modal.find('input[name="response"]');
			this.$submit_button = this.modal.find('.submit.button');

		},

		observe: function() {

			$(window).on('resize.app', _.bind(this.resize, this));

			this.$submit_button.on('click', this.formSubmitted);

		},

		resize: function() {

			this.modal.center();

		},

		formSubmitted: function() {

			var response = this.getResponse();

			if (response === 'yes')
				this.quitGame();

			// Either way, this view is getting destroyed.
			this.destroy();

		},

		getResponse: function() {

			var checked = this.$fields.filter(':checked');

			return checked.length > 0 ? checked.val() : null;

		},

		quitGame: function() {

			app.Session.set('gameInProgress', null);

			// Show the Main Screen view.
			new app.MainScreenView();

		},

		destroy: function() {

			this.modal.remove();

			$(this.el).removeData().unbind();

		}

	});

});