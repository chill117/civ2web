/*global Backbone */
var app = app || {};

$(function ($) {

	'use strict';

	app.CityReportOptionsView = Backbone.View.extend({

		initialize: function() {

			_.bindAll(this);
			
			var html = app.Template.get('game/city_report_options');

			this.cityReportOptionsTemplate = _.template(html);

			this.render();
			this.define_elements();
			this.observe();
			this.resize();

			this.setSelected();

		},

		render: function() {

			this.modal = new app.Modal(this.cityReportOptionsTemplate());

		},

		define_elements: function() {

			this.$fields = this.modal.find(':input');

			this.$submit_button = this.modal.find('.submit.button');
			this.$cancel_button = this.modal.find('.cancel.button');

		},

		observe: function() {

			$(window).on('resize.app', _.bind(this.resize, this));

			this.$submit_button.on('click', this.saveOptions);
			this.$cancel_button.on('click', this.destroy);

		},

		resize: function() {

			this.modal.center();

		},

		destroy: function() {

			this.modal.remove();

			$(this.el).removeData().unbind();

		},

		setSelected: function() {

			var options = app.Game.get('cityReportOptions');

			var _this = this;

			_.each(options, function(value, key) {

				var field = _this.$fields.filter('[name="' + key + '"]');

				field.prop('checked', value === 1);

			});

		},

		saveOptions: function() {

			var options = this.getOptions();

			app.Game.set('cityReportOptions', options);

			// Don't need this view anymore.
			this.destroy();

		},

		getOptions: function() {

			var options = {};

			$.each(this.$fields, function(i, field) {

				options[$(field).attr('name')] = $(field).is(':checked') ? 1 : 0;

			});

			return options;

		}

	});

});