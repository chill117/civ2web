/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Templates = function() {

		/*
			The URL path to the templates directory.
		*/
		var path = '/templates';

		/*
			Holds all templates that have been loaded.
		*/
		var templates = {};

		/*
			Loads a template file.
		*/
		this.load = function(file, callbacks) {

			/*
				Stop here if the template has already been loaded.
			*/
			if (isLoaded(file))
				if (callbacks !== undefined && callbacks.success !== undefined)
				{
					var html = getHTML(file);

					callbacks.success(html);

					return;
				}

			var url = path + '/' + file + '.template';

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

							var html = data;

							templates[file] = html;

							if (callbacks !== undefined && callbacks.success !== undefined)
								callbacks.success(html);

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
			Returns the HTML of a template that has already been loaded.
		*/
		function getHTML(file) {

			return isLoaded(file) ? templates[file] : null;

		}

		function isLoaded(file) {

			return templates[file] !== undefined;

		}

		return this;

	}

	app.Templates = new Templates();

})();