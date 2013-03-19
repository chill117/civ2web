app.helpers.map = function(tiles)
{
	"use strict";

	/*
		This helper class contains methods for working with the map as defined by the tiles argument.
	*/
	
	var Interface = {};

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

	function set_tile_type(coordinates, type)
	{
		tiles[coordinates.join(',')].type = type;
	}

	function set_tile_resource(coordinates, resource)
	{
		tiles[coordinates.join(',')].resource = resource;
	}

	function get_all_tiles()
	{
		return tiles;
	}

	// "Public" methods.
	Interface.get_neighboring_open_ocean_tiles 	= get_neighboring_open_ocean_tiles;
	Interface.get_neighboring_ocean_tiles 		= get_neighboring_ocean_tiles;
	Interface.get_neighboring_coordinates 		= get_neighboring_coordinates;
	Interface.calculate_tile_position 			= calculate_tile_position;
	Interface.is_land_tile 						= is_land_tile;
	Interface.is_ocean_tile 					= is_ocean_tile;
	Interface.get_tile 							= get_tile;
	Interface.coordinates_are_valid 			= coordinates_are_valid;
	Interface.set_tile_type 					= set_tile_type;
	Interface.set_tile_resource 				= set_tile_resource;
	Interface.get_all_tiles 					= get_all_tiles;

	return Interface;
}