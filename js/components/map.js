app.components.map = function()
{
	"use strict";

	/*
		!!! DESCRIPTION
	*/

	var 	Interface 	= {},
			callbacks 	= {},
			elm 		= {},

			/*
				Holds an instance of the map helper object.
			*/
			map,

			/*
				The width of the map (# of tiles)
			*/
			width,

			/*
				The height of the map (# of tiles)
			*/
			height;

	/*
		Draws the map.
	*/
	function draw()
	{
		draw_tiles();

		if (app.debugging)
		{
			draw_coordinates();
		}
	}
	/*
		Draws text of (x,y) coordinates over each tile.
	*/
	function draw_coordinates()
	{
		// Draw (x,y) coordinates over each tile.
		for (var coordinates in map.get_all_tiles())
		{
			var position = map.calculate_tile_position(coordinates);

			$('#map')[0]
				.getContext('2d')
					.fillText(
						'(' + coordinates + ')',
						position[0] + 18,
						position[1] + 20
					);
		}
	}

	function draw_tiles()
	{
		/*
			Left-to-Right along top of X-Axis.
		*/
		for (var start_x = 0; start_x < width; start_x += 2)
		{
			var x = start_x;

			for (var y = 0; y <= start_x; y++, x--)
				draw_tile([x, y]);
		}

		var start_x = (width % 2 ? width : width - 1);

		/*
			Top-to-Bottom along right-side of Y-Axis.
		*/
		for (var start_y = 1; start_y < height; start_y += 2)
		{
			var y = start_y;

			for (var x = start_x; x >= 0; x--, y++)
				draw_tile([x, y]);
		}
	}

	function draw_tile(coordinates)
	{
		var tile = map.get_tile(coordinates);

		if (tile === null)
			return;

		/*
			Draw base for certain tile types.
		*/
		switch (tile.type)
		{
			/*
				These types have grassland as their base.
			*/
			case 'mountains':
			case 'hills':
			case 'forest':
				draw_to_tile('terrain', 'grassland', coordinates);
			break;
		}

		draw_to_tile('terrain', tile.type, coordinates);

		draw_shoreline(coordinates);

		dither_tile(coordinates);

		/*
			Draw its resource if it has one.
		*/
		if (tile.resource !== undefined)
			draw_to_tile('terrain', tile.type + '-resource' + tile.resource, coordinates);
	}

	/*
		Dithering adds "noise" to the edges of a tile.
	*/
	function dither_tile(coordinates)
	{
		// !!! Don't do dithering just yet.
		return;

		// Don't dither ocean tiles.
		if (map.is_ocean_tile(coordinates))
			return;

		var neighbors = map.get_neighboring_coordinates(coordinates);

		/*
			Exchange some pixels with Neighbor 1 and Neighbor 7
		*/
	}

	/*
		Draw the appropriate shoreline in the given tile.
	*/
	function draw_shoreline(coordinates)
	{
		// Only draw shorelines for ocean tiles.
		if (!map.is_ocean_tile(coordinates))
			return;

		var neighbors = map.get_neighboring_coordinates(coordinates);

		/*
			Determine what shoreline segment (if any) to place in each quadrant.

			|3 0|
			|2 1|
		*/
		for (var quadrant = 0; quadrant < 4; quadrant++)
		{
			var m = quadrant * 2;

			var a = (m > 0 ? m - 1 : neighbors.length - 1);
			var b = (a < (neighbors.length - 1) ? a + 1 : 0);
			var c = (b + 1);

			var configuration = '';

			var _neighbors = [neighbors[a], neighbors[b], neighbors[c]];

			for (var i in _neighbors)
			{
				if (
					_neighbors[i] !== null &&
					map.is_land_tile(_neighbors[i])
				)
					configuration += 'l';
				else
					configuration += 'w';
			}

			// Do we need to draw a shoreline?
			if (configuration !== 'www')
				draw_to_tile('shoreline', configuration + '-' + quadrant, coordinates, quadrant);
		}
	}

	function draw_to_tile(category, type, coordinates, quadrant)
	{
		var source 		= app.assets.get_source(category),
			context 	= $('#map')[0].getContext('2d'),

			src_position 	= app.assets.get_position(category, type),
			dest_position 	= map.calculate_tile_position(coordinates),

			src_x = src_position[0],
			src_y = src_position[1],

			dest_x = dest_position[0],
			dest_y = dest_position[1],
			
			dimensions = app.assets.get_dimensions(category),

			width 	= dimensions[0],
			height 	= dimensions[1];

		if (quadrant !== undefined)
			switch (quadrant)
			{
				case 0:
					dest_x += 16;
				break;

				case 1:
					dest_x += 32;
					dest_y += 8;
				break;

				case 2:
					dest_x += 16;
					dest_y += 16;
				break;

				case 3:
					dest_y += 8;
				break;
			}

		context.drawImage(source, src_x, src_y, width, height, dest_x, dest_y, width, height);
	}

	callbacks['assets:loaded'] = function()
	{
		var options = {
				'width' 		: 40,
				'height' 		: 50,
				'land_mass' 	: 'large',
				'land_form' 	: 'continents',
				'climate' 		: 'temperate',
				'temperature' 	: 'warm',
				'age' 			: '3b',
				'flat' 			: false,
				'num_civs' 		: 4,
			};

		width = options.width;
		height = options.height;

		var map_window = app.helpers.window('map');
		var status_window = app.helpers.window('status');
		var mini_map_window = app.helpers.window('mini-map');

		map_window.set_width('80%');
		status_window.set_width('20%');
		mini_map_window.set_width('20%');

		map_window.set_height('100%');
		status_window.set_height('80%');
		mini_map_window.set_height('20%');

		$('#map').
			attr({
				'width' 	: $('#map').parent().width(),
				'height' 	: $('#map').parent().height()
			});

		var map_generator = app.helpers.map_generator(options, function() {

			var tiles = map_generator.seed();

			map = app.helpers.map(tiles);

			draw();

		});
	}

	Interface.callbacks = callbacks;

	return Interface;
}