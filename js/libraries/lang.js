/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Lang = function() {

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
		this.load = function(file, callbacks) {

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
								callbacks.error();

						break;
					}
				}
			});

		};

		/*
			Returns the corresponding line of text.
		*/
		this.line = function(key) {

			return lines[key] !== undefined ? lines[key] : null;

		};

		function isLoaded(file) {

			return loaded[file] === true;

		}

		return this;

	}

	app.Lang = new Lang();

})();