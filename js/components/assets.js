app.components.assets = function()
{
	"use strict";
	
	var 	Interface 	= {},
			callbacks 	= {},

			sources = {
				'advancements' 	: '/images/advancements.png',
				'cities' 		: '/images/cities.png',
				'misc' 			: '/images/misc.png',
				'improvements' 	: '/images/improvements.png',
				'people' 		: '/images/people.png',
				'terrain' 		: '/images/terrain.png',
				'units' 		: '/images/units.png',
			},

			assets = {
				'advancements' : {
					'source' 	: 'advancements',
					'imageObj' 	: false,
					'key' 		: {
					}
				},
				'cities' : {
					'source' 		: 'cities',
					'imageObj' 	: false,
					'key' 		: {
					}
				},
				'improvements' : {
					'source' 		: 'improvements',
					'imageObj' 	: false,
					'key' 		: {
					}
				},
				'misc' : {
					'source' 		: 'misc',
					'imageObj' 	: false,
					'key' 		: {
					}
				},
				'people' : {
					'source' 		: 'people',
					'imageObj' 	: false,
					'key' 		: {
					}
				},
				'terrain' : {
					'source' 			: 'terrain',
					'imageObj' 		: false,
					'dimensions' 	: [64, 32],

					'key' 			: {
						'desert' 				: [1, 1],
						'desert-alt' 			: [66, 1],
						'desert-resource1' 		: [131, 1],
						'desert-resource2' 		: [196, 1],

						'plains' 				: [1, 34],
						'plains-resource1' 		: [131, 34],
						'plains-resource2' 		: [196, 34],

						'forest' 				: [326, 133],
						'forest-resource1' 		: [131, 100],
						'forest-resource2' 		: [196, 100],

						'hills' 				: [326, 265],
						'hills-resource1' 		: [131, 133],
						'hills-resource2' 		: [196, 133],

						'mountains' 			: [326, 199],
						'mountains-resource1' 	: [131, 166],
						'mountains-resource2' 	: [196, 166],

						'grassland' 			: [1, 67],

						'tundra' 				: [1, 199],
						'tundra-resource1' 		: [131, 199],
						'tundra-resource2' 		: [196, 199],

						'glacier' 				: [1, 232],
						'glacier-resource1' 	: [131, 232],
						'glacier-resource2' 	: [196, 232],

						'swamp' 				: [1, 265],
						'swamp-resource1' 		: [131, 265],
						'swamp-resource2' 		: [196, 265],

						'jungle' 				: [1, 298],
						'jungle-alt' 			: [66, 298],
						'jungle-resource1' 		: [131, 298],
						'jungle-resource2' 		: [196, 298],

						'ocean' 				: [1, 331],
						'ocean-resource1' 		: [131, 331],
						'ocean-resource2' 		: [196, 331],

						'irritation' 			: [261, 1],
						'farmland' 				: [261, 34],
						'mine' 					: [261, 67],
						'pollution' 			: [261, 100],
						'shield' 				: [261, 133],
						'hut' 					: [261, 166],
					}
				},
				'shoreline' : {
					'source' 		: 'terrain',
					'imageObj' 		: false,
					'dimensions' 	: [32, 16],
					'key' 			: {
						'lww-0' : [67, 533],
						'lww-1' : [100, 567],
						'lww-2' : [67, 550],
						'lww-3' : [67, 567],

						'wlw-0' : [133, 533],
						'wlw-1' : [166, 567],
						'wlw-2' : [133, 550],
						'wlw-3' : [133, 567],
						
						'llw-0' : [199, 533],
						'llw-1' : [232, 567],
						'llw-2' : [199, 550],
						'llw-3' : [199, 567],
						
						'wwl-0' : [265, 533],
						'wwl-1' : [298, 567],
						'wwl-2' : [265, 550],
						'wwl-3' : [265, 567],
						
						'lwl-0' : [331, 533],
						'lwl-1' : [364, 567],
						'lwl-2' : [331, 550],
						'lwl-3' : [331, 567],
						
						'wll-0' : [397, 533],
						'wll-1' : [430, 567],
						'wll-2' : [397, 550],
						'wll-3' : [397, 567],
						
						'lll-0' : [463, 533],
						'lll-1' : [496, 567],
						'lll-2' : [463, 550],
						'lll-3' : [463, 567]
					}
				},
				'units' : {
					'source' 		: 'units',
					'imageObj' 	: false,
					'key' 		: {
					}
				}
			};

	function get_asset_source(name)
	{
		return assets[name].imageObj;
	}

	function get_tile_position(name, type)
	{
		return assets[name].key[type] !== undefined ? assets[name].key[type] : null;
	}

	function get_tile_dimensions(name)
	{
		return assets[name] !== undefined ? assets[name].dimensions : null;
	}

	function load_assets()
	{
		for (var name in assets)
			load_asset(name);
	}

	function load_asset(name)
	{
		var imageObj = new Image();

		imageObj.onload = function()
		{
			assets[name].imageObj = imageObj;

			if (all_assets_are_loaded())
				app.core.trigger('assets:loaded');
		}

		imageObj.src = sources[assets[name].source];
	}

	function all_assets_are_loaded()
	{
		var loaded = true;

		for (var name in assets)
		{
			var asset = assets[name];

			if (asset.imageObj === false)
				return false;
		}

		return loaded;
	}

	callbacks['app:ready'] = function()
	{
		load_assets();
	}

	Interface.get_asset_source 		= get_asset_source;
	Interface.get_tile_position 	= get_tile_position;
	Interface.get_tile_dimensions 	= get_tile_dimensions;
	Interface.callbacks 			= callbacks;

	return Interface;
}