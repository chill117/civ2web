/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var GamesCollection = Backbone.Collection.extend({

		model: app.GameModel,

		localStorage: new Backbone.LocalStorage('Games')

	});

	app.GamesCollection = new GamesCollection();

})();