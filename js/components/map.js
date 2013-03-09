app.components.map = function()
{
	"use strict";

	/*
		!!! DESCRIPTION
	*/

	var 	Interface 	= {},
			callbacks 	= {},
			elm 		= {},
			tiles,
			width,
			height;

	function init()
	{
		define_elements();
	}

	function define_elements()
	{
		elm.map = $('#map');
	}

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
		for (var coordinates in tiles)
		{
			var position = calculate_tile_position(coordinates);

			elm.map[0]
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
		if (!coordinates_are_valid(coordinates))
			return;

		var tile = get_tile(coordinates);

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
		// Don't dither ocean tiles.
		if (is_ocean_tile(coordinates))
			return;

		var neighbors = get_neighboring_coordinates(coordinates);

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
		if (!is_ocean_tile(coordinates))
			return;

		var neighbors = get_neighboring_coordinates(coordinates);

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

			var configuration = get_neighbor_configuration_for_water_or_land([
									neighbors[a],
									neighbors[b],
									neighbors[c]
								]);

			// Do we need to draw a shoreline?
			if (configuration !== 'www')
				draw_to_tile('shoreline', configuration + '-' + quadrant, coordinates, quadrant);
		}
	}

	function draw_to_tile(category, type, coordinates, quadrant)
	{
		var source 		= app.assets.get_source(category),
			context 	= elm.map[0].getContext('2d'),

			src_position 	= app.assets.get_position(category, type),
			dest_position 	= calculate_tile_position(coordinates),

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

	/*
		Returns array of coordinates of neighboring tiles
		that are ocean and do not border land.
	*/
	function get_neighboring_open_ocean_tiles(origin, adjacent_only)
	{
		var open_ocean_neighbors = [];

		var ocean_neighbors = get_neighboring_ocean_tiles(origin, adjacent_only);

		for (var m in ocean_neighbors)
		{
			var neighbors = get_neighboring_coordinates(ocean_neighbors[m], true);

			var borders_land = false;

			for (var i in neighbors)
				if (
					neighbors[i] !== null &&
					is_land_tile(neighbors[i])
				)
					borders_land = true;

			if (!borders_land)
				open_ocean_neighbors.push(ocean_neighbors[m]);
		}

		return open_ocean_neighbors;
	}

	/*
		Returns array of coordinates of neighboring tiles that are ocean.
	*/
	function get_neighboring_ocean_tiles(origin, adjacent_only)
	{
		var neighbors = get_neighboring_coordinates(origin, adjacent_only);

		var ocean_neighbors = [];

		// Find all the neighbors that are ocean tiles.
		for (var i in neighbors)
			if (
				neighbors[i] !== null &&
				is_ocean_tile(neighbors[i])
			)
				ocean_neighbors.push(neighbors[i]);

		return ocean_neighbors;
	}

	/*
		\ 6 \ 7 \ 0 \
		 \ 5 \ X \ 1 \
		  \ 4 \ 3 \ 2 \
	*/
	function get_neighboring_coordinates(coordinates, adjacent_only)
	{
		var neighbors = [];

		var x = parseInt(coordinates[0]),
			y = parseInt(coordinates[1]);

		if (adjacent_only !== true)
		{
			neighbors.push([ 	x 		, 	y - 2 	]);// 0
			neighbors.push([ 	x + 1 	, 	y - 1 	]);// 1
			neighbors.push([ 	x + 2 	, 	y 		]);// 2
			neighbors.push([ 	x + 1 	, 	y + 1 	]);// 3
			neighbors.push([ 	x 		, 	y + 2 	]);// 4
			neighbors.push([ 	x - 1 	, 	y + 1 	]);// 5
			neighbors.push([ 	x - 2 	, 	y 		]);// 6
			neighbors.push([ 	x - 1 	, 	y - 1 	]);// 7
		}
		else
		{
			neighbors.push(null);// 0
			neighbors.push([ 	x + 1 	, 	y - 1 	]);// 1
			neighbors.push(null);// 2
			neighbors.push([ 	x + 1 	, 	y + 1 	]);// 3
			neighbors.push(null);// 4
			neighbors.push([ 	x - 1 	, 	y + 1 	]);// 5
			neighbors.push(null);// 6
			neighbors.push([ 	x - 1 	, 	y - 1 	]);// 7
		}

		return neighbors;
	}

	/*
		Returns a string with the configuration of the given neighbors:

		Examples: 'www', 'llw', 'lwl', etc..
	*/
	function get_neighbor_configuration_for_water_or_land(neighbors)
	{
		var configuration = '';

		for (var i in neighbors)
		{
			if (
				neighbors[i] !== null &&
				is_land_tile(neighbors[i])
			)
				configuration += 'l';
			else
				configuration += 'w';
		}

		return configuration;
	}

	function calculate_tile_position(coordinates)
	{
		var position = [0, 0];

		if (typeof coordinates === 'string')
			coordinates = coordinates.split(',');

		position[0] += parseInt(coordinates[0]) * 32;
		position[1] += parseInt(coordinates[1]) * 16;

		return position;
	}

	function is_ocean_tile(coordinates)
	{
		var tile = get_tile(coordinates);

		return 	tile !== null &&
				tile.type === 'ocean';
	}

	function is_land_tile(coordinates)
	{
		var tile = get_tile(coordinates);

		return 	tile !== null &&
				tile.type !== 'ocean';
	}

	function get_tile(coordinates)
	{
		return !coordinates_are_valid(coordinates) ? null : tiles[coordinates.join(',')];
	}

	function coordinates_are_valid(coordinates)
	{
		return tiles[coordinates.join(',')] !== undefined;
	}

	callbacks['assets:loaded'] = function()
	{
		var options = {
				'width' 		: 80,
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

		elm.map.attr({
			'width' 	: 32 * (width + 1),
			'height' 	: 16 * (height + 1)
		});

		var map_generator = app.helpers.map_generator(options, function() {

			tiles = map_generator.seed();

			draw();

		});
	}

	Interface.init 							= init;
	Interface.callbacks 					= callbacks;
	Interface.get_neighboring_coordinates 	= get_neighboring_coordinates;

	return Interface;
}