/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Lang = function() {

		/*
			List of language files that will be automatically loaded at run-time.
		*/
		var auto_load = [];

		/*
			The URL path to the language directory.
		*/
		var path = '/language';

		/*
			The language locale that will be used when loading language files.
		*/
		var lang_locale = 'en';

		/*
			Holds all lines of text that have been loaded.
		*/
		var lines = {};

		/*
			List of language files that have been loaded.
		*/
		var loaded = {};

		/*
			Loads a language file.
		*/
		function load(file, callbacks) {

			/*
				Stop here if the language file has already been loaded.
			*/
			if (isLoaded(file))
				if (callbacks !== undefined && callbacks.success !== undefined)
				{
					callbacks.success();

					return;
				}

			var url = path + '/' + lang_locale + '/' + file + '.json';

			$.ajax({
				type: 'GET',
				url: url,
				complete: function(response)
				{
					var status = response.status;
					var data = response.responseText;

					switch (status)
					{
						case 200:

							loaded[file] = true;

							for (var key in data)
							{
								var line = data[key];

								lines[key] = line;
							}

							if (callbacks !== undefined && callbacks.success !== undefined)
								callbacks.success();

						break;

						default:

							if (callbacks !== undefined && callbacks.error !== undefined)
								callbacks.error(status, data);

						break;
					}
				}
			});

		}

		/*
			Returns the corresponding line of text.
		*/
		function line(key) {

			return lines[key] !== undefined ? lines[key] : null;

		}

		function isLoaded(file) {

			return loaded[file] === true;

		}

		/*
			Auto-loads language files at run-time.
		*/
		function autoLoad() {

			if (auto_load.length > 0)
			{
				for (var i in auto_load)
				{
					var file = auto_load[i];
					
					load(file, {success: checkIfReady});
				}
			}
			else
			{
				// Don't need to auto-load anything.
				triggerReadyEvent();
			}

		}

		/*
			Triggers the 'lang:ready' event when all auto-load language files have loaded.
		*/
		function checkIfReady() {

			for (var i in auto_load)
			{
				var file = auto_load[i];

				if (!isLoaded(file))
					// Not ready yet.
					return;
			}

			// Good to go.
			triggerReadyEvent();

		}

		function triggerReadyEvent() {

			app.Event.trigger('lang:ready');

		}

		app.Event.on('app:load', autoLoad);

		// "Public" methods.
		this.load = load;
		this.line = line;

		return this;

	}

	app.Lang = new Lang();

})();