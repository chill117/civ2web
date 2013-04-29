/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Config = function() {

		/*
			List of configuration files that will be automatically loaded at run-time.
		*/
		var auto_load = [
			'cities',
			'civs',
			'leaders',
			'seed_rules',
			'sprites'
		];

		/*
			The URL path to the configurations directory.
		*/
		var path = '/config';

		/*
			Holds all config objects that have been loaded.
		*/
		var config_objects = {};

		/*
			Loads a configuration file.
		*/
		function load(file, callbacks) {

			/*
				Stop here if the configuration file has already been loaded.
			*/
			if (isLoaded(file))
			{
				if (callbacks !== undefined && callbacks.success !== undefined)
				{
					var config_object = get(file);

					callbacks.success(config_object);

				}
				
				return;
			}

			var url = path + '/' + file + '.json';

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

							var json = $.parseJSON(data);

							config_objects[file] = json;

							if (callbacks !== undefined && callbacks.success !== undefined)
								callbacks.success(json);

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
			Returns the Config Object of a configuration file that has already been loaded.
		*/
		function get(file) {

			return isLoaded(file) ? config_objects[file] : null;

		}

		function isLoaded(file) {

			return config_objects[file] !== undefined;

		}

		/*
			Auto-loads config files at run-time.
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
			Triggers the 'config:ready' event when all auto-load config files have loaded.
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

			app.Event.trigger('config:ready');

		}

		app.Event.on('app:load', autoLoad);

		// "Public" methods.
		this.load 	= load;
		this.get 	= get;

		return this;

	}

	app.Config = new Config();

})();