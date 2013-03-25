/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Template = function() {

		/*
			List of templates that will be automatically loaded at run-time.
		*/
		var auto_load = [
			'main_screen',
			'load_game',
			'list_of_saved_games',
			'pre_game/enter_your_name',
			'pre_game/select_barbarian_level',
			'pre_game/select_city_style',
			'pre_game/select_difficulty_level',
			'pre_game/select_gender',
			'pre_game/select_number_of_civs',
			'pre_game/select_tribe',
			'pre_game/select_world_size',
			'game',
			'game/map',
			'game/menu',
			'game/mini_map',
			'game/quit',
			'game/status'
		];

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
		function load(file, callbacks) {

			/*
				Stop here if the template has already been loaded.
			*/
			if (isLoaded(file))
			{
				if (callbacks !== undefined && callbacks.success !== undefined)
				{
					var html = get(file);

					callbacks.success(html);
				}

				return;
			}

			var url = path + '/' + file + '.html';

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
								callbacks.error(status, data);

						break;
					}
				}
			});

		}

		/*
			Returns the HTML of a template that has already been loaded.
		*/
		function get(file) {

			return isLoaded(file) ? templates[file] : null;

		}

		function isLoaded(file) {

			return templates[file] !== undefined;

		}

		/*
			Auto-loads templates at run-time.
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
			Triggers the 'templates:ready' event when all auto-load templates have loaded.
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

			app.Event.trigger('templates:ready');

		}

		app.Event.on('app:load', autoLoad);

		// "Public" methods.
		this.load 	= load;
		this.get 	= get;

		return this;

	}

	app.Template = new Template();

})();