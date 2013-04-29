/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.TaxRateView = Backbone.View.extend({

		initialize: function() {

			_.bindAll(this);
			
			var html = app.Template.get('game/tax_rate');

			this.taxRateTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();
			this.resize();

			this.setCurrentValues();

		},

		render: function() {

			this.modal = new app.Modal(this.taxRateTemplate());

		},

		define_elements: function() {

			this.$sliders = this.modal.find('.sliders');

			this.$submit_button = this.modal.find('.submit.button');

		},

		observe: function() {

			$(window).on('resize.app', _.bind(this.resize, this));

			this.$submit_button.on('click', this.saveOptions);

		},

		resize: function() {

			this.modal.center();

		},

		destroy: function() {

			this.modal.remove();

			$(this.el).removeData().unbind();

		},

		setCurrentValues: function() {

			var options = app.Game.get('tax_rate');

			var _this = this;

			_.each(options, function(value, key) {

				var field = _this.$fields.filter('[name="' + key + '"]');

				field.prop('checked', value === 1);

			});

		},

		saveValues: function() {

			var values = this.getValues();

			app.Game.set('tax_rate', values);

			// Don't need this view anymore.
			this.destroy();

		},

		getValues: function() {

			var options = {};

			_.each(this.$fields, function(field) {

				options[$(field).attr('name')] = $(field).is(':checked') ? 1 : 0;

			});

			return options;

		}

	});

});