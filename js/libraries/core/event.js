/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	/*
		A class for listening to and triggering callbacks on arbitrary events.
	*/

	var Event = function() {

		/*
			Object containing the callbacks to be fired when events are triggered.
		*/
		var listeners = {};

		function trigger(event) {

			if (!hasListeners(event))
				return;

			for (var i in listeners[event])
			{
				var callback = listeners[event][i];

				callback();
			}

		}

		function on(event, callback) {

			listeners[event] || (listeners[event] = []);

			listeners[event].push(callback);

		}

		function hasListeners(event) {

			return listeners[event] !== undefined && listeners[event].length > 0;

		}

		// "Public" methods.
		this.trigger 	= trigger;
		this.on 		= on;

		return this;

	}

	app.Event = new Event();

})();