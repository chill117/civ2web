/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	var Sprites = function() {

		/*
			List of sprite files that will be automatically loaded at run-time.
		*/
		var auto_load = {};

		/*
			Image Objects for spites that have been loaded.
		*/
		var imageObjects = {};

		/*
			Sprites configuration information.
		*/
		var sprites;

		function initialize() {

			sprites = app.Config.get('sprites');

			for (var name in sprites)
			{
				var file = sprites[name].source;

				auto_load[file] = true;
			}

			autoLoad();

		}

		/*
			Loads a sprite.
		*/
		function load(file, callbacks) {

			/*
				Stop here if the sprite file has already been loaded.
			*/
			if (isLoaded(file))
			{
				if (callbacks !== undefined && callbacks.success !== undefined)
				{
					var imageObject = get(name);

					callbacks.success(imageObject);
				}

				return;
			}

			var imageObj = new Image();

			imageObj.onload = function()
			{
				imageObjects[file] = imageObj;

				if (callbacks !== undefined && callbacks.success !== undefined)
					callbacks.success(imageObj);
			}

			imageObj.src = file;
		}

		/*
			Returns the sprite's Image Object by name.
		*/
		function get(name) {

			var file = sprites[name].source;

			return getImageObject(file);

		}

		/*
			Returns the sprite's Image Object by file.
		*/
		function getImageObject(file) {

			return imageObjects[file];

		}

		/*
			Returns the [x,y] position of an image from a sprite.
		*/
		function getPosition(name, type) {

			return sprites[name].key[type] !== undefined ? sprites[name].key[type] : null;

		}

		/*
			Returns the dimensions of all images within a sprite.
		*/
		function getDimensions(name) {

			return sprites[name] !== undefined ? sprites[name].dimensions : null;

		}

		function isLoaded(file) {

			return imageObjects[file] !== undefined;

		}

		/*
			Auto-loads sprites at run-time.
		*/
		function autoLoad() {

			if (object_size(auto_load) > 0)
			{
				for (var file in auto_load)
					load(file, {success: checkIfReady});
			}
			else
			{
				// Don't need to auto-load anything.
				triggerReadyEvent();
			}

		}

		/*
			Triggers the 'sprites:ready' event when all auto-load sprites have loaded.
		*/
		function checkIfReady() {

			for (var file in auto_load)
				if (!isLoaded(file))
					// Not ready yet.
					return;

			// Good to go.
			triggerReadyEvent();

		}

		function triggerReadyEvent() {

			app.Event.trigger('sprites:ready');

		}

		// Wait until the configuration files are ready.
		app.Event.on('config:ready', initialize);

		// "Public" methods.
		this.get 			= get;
		this.getPosition 	= getPosition;
		this.getDimensions 	= getDimensions;

		return this;

	}

	app.Sprites = new Sprites();

})();