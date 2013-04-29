/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	app.Modal = function(html) {

		function initialize() {

			reset();

			populate(html);

		}

		function populate(html) {

			$('#modal').html(html);

		}

		function reset() {

			$('#modal').remove();

			$('body').prepend('<div id="modal" />');

		}

		function get() {

			return $('#modal');

		}

		initialize();

		return get();

	}

})();

