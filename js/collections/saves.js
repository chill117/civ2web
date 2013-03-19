/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Saves = Backbone.Collection.extend({

		model: function() {

			return new app.Save();

		},

		localStorage: new Backbone.LocalStorage('Saves')

	});

	app.Saves = new Saves();

})();