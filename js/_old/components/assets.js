app.components.assets = function()
{
	"use strict";

	/*
		This component handles the loading and managing of image assets.
	*/
	
	var 	Interface 	= {},
			callbacks 	= {},
			sources 	= {},
			assets;

	function get_source(name)
	{
		return sources[assets[name].source];
	}

	function get_position(name, type)
	{
		return assets[name].key[type] !== undefined ? assets[name].key[type] : null;
	}

	function get_dimensions(name)
	{
		return assets[name] !== undefined ? assets[name].dimensions : null;
	}

	function load_assets()
	{
		/*
			Get assets JSON object.
		*/
		app.request.get('/data/assets.json', null, function(status, data) {

			if (status === 200)
			{
				assets = data;

				for (var name in assets)
					load_asset(name);
			}

		});
	}

	function load_asset(name)
	{
		var imageObj = new Image();

		var source = assets[name].source;

		imageObj.onload = function()
		{
			sources[source] = imageObj;

			if (all_assets_are_loaded())
				app.core.trigger('assets:loaded');
		}

		imageObj.src = source;
	}

	function all_assets_are_loaded()
	{
		for (var name in assets)
		{
			var asset = assets[name];
			var source = asset.source;

			if (sources[source] === undefined)
				return false;
		}

		return true;
	}

	callbacks['app:ready'] = function()
	{
		load_assets();
	}

	Interface.get_source 		= get_source;
	Interface.get_position 		= get_position;
	Interface.get_dimensions 	= get_dimensions;
	Interface.callbacks 		= callbacks;

	return Interface;
}