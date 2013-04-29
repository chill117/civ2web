/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var SessionDataCollection = Backbone.Collection.extend({

		model: app.SessionDataModel,

		localStorage: new Backbone.LocalStorage('Session')

	});

	app.SessionDataCollection = new SessionDataCollection();

})();