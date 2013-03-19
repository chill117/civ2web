/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Saves = Backbone.Collection.extend({

		model: function() {

			return new app.Save();

		},

		localStorage: new Backbone.LocalStorage('civ2web-saves'),

		initialize: function() {

		}

	});

	app.Saves = new Saves();

})();