app.components.map_generator = function()
{
	"use strict";
	
	var 	Interface 		= {},
			callbacks 		= {},
			elm 			= {},
			tiles 			= {},

			debugging 		= true,

			land = {

				/*
					This is the seed pool from which land types are randomly selected.
				*/
				'pool' : [],

				/*
					This is populated with the coordinates of land tiles (as the keys).
				*/
				'tiles' : {},

				'base' : {
					'desert' 		: 6,
					'plains' 		: 14,
					'grassland' 	: 16,
					'tundra' 		: 6,
					'glacier' 		: 4,
					'hills' 		: 12,
					'mountains' 	: 8,
					'forest' 		: 12,
					'swamp' 		: 6,
					'jungle' 		: 6,
				},

				'multipliers' : {

					'climate' : {

						'arid' : {
							'desert' 		: 2,
							'plains' 		: 1.5,
							'grassland' 	: 0.75,
							'tundra' 		: 1.25,
							'glacier' 		: 1,
							'hills' 		: 1,
							'mountains' 	: 1,
							'forest' 		: 0.75,
							'swamp' 		: 0.05,
							'jungle' 		: 0.05,
						},

						'normal' : {
							'desert' 		: 1,
							'plains' 		: 1,
							'grassland' 	: 1,
							'tundra' 		: 1,
							'glacier' 		: 1,
							'hills' 		: 1,
							'mountains' 	: 1,
							'forest' 		: 1,
							'swamp' 		: 1,
							'jungle' 		: 1,
						},

						'wet' : {
							'desert' 		: 0.05,
							'plains' 		: 0.75,
							'grassland' 	: 1.5,
							'tundra' 		: 0.5,
							'glacier' 		: 1,
							'hills' 		: 1,
							'mountains' 	: 1,
							'forest' 		: 1.5,
							'swamp' 		: 2,
							'jungle' 		: 2,
						}

					},

					'temperature' : {

						'cool' : {
							'desert' 		: 0.5,
							'plains' 		: 0.75,
							'grassland' 	: 0.75,
							'tundra' 		: 1.75,
							'glacier' 		: 2,
							'hills' 		: 1,
							'mountains' 	: 1,
							'forest' 		: 0.75,
							'swamp' 		: 0.25,
							'jungle' 		: 0.25,
						},

						'temperate' : {
							'desert' 		: 1,
							'plains' 		: 1,
							'grassland' 	: 1,
							'tundra' 		: 1,
							'glacier' 		: 1,
							'hills' 		: 1,
							'mountains' 	: 1,
							'forest' 		: 1,
							'swamp' 		: 1,
							'jungle' 		: 1,
						},

						'warm' : {
							'desert' 		: 1.5,
							'plains' 		: 1.25,
							'grassland' 	: 1.25,
							'tundra' 		: 0.25,
							'glacier' 		: 0.05,
							'hills' 		: 1,
							'mountains' 	: 1,
							'forest' 		: 1.25,
							'swamp' 		: 1.75,
							'jungle' 		: 1.75,
						}

					},

					'age' : {

						'3b' : {
							'desert' 		: 1,
							'plains' 		: 1,
							'grassland' 	: 1,
							'tundra' 		: 1,
							'glacier' 		: 1,
							'hills' 		: 0.25,
							'mountains' 	: 1.75,
							'forest' 		: 1,
							'swamp' 		: 1,
							'jungle' 		: 1,
						},

						'4b' : {
							'desert' 		: 1,
							'plains' 		: 1,
							'grassland' 	: 1,
							'tundra' 		: 1,
							'glacier' 		: 1,
							'hills' 		: 1,
							'mountains' 	: 1,
							'forest' 		: 1,
							'swamp' 		: 1,
							'jungle' 		: 1,
						},

						'5b' : {
							'desert' 		: 1,
							'plains' 		: 1,
							'grassland' 	: 1,
							'tundra' 		: 1,
							'glacier' 		: 1,
							'hills' 		: 1.75,
							'mountains' 	: 0.25,
							'forest' 		: 1,
							'swamp' 		: 1,
							'jungle' 		: 1,
						}

					}

				}

			},

			/*
				'width' 		: (INT) Number of Tiles on X Axis
				'height' 		: (INT) Number of Tiles on Y Axis
				'land_mass' 	: (STRING) 'small' or 'normal' or 'large'
				'land_form' 	: (STRING) 'archipelago' or 'varied' or 'continents'
				'climate' 		: (STRING) 'arid' or 'normal' or 'wet'
				'temperature' 	: (STRING) 'cool' or 'temperate' or 'warm'
				'age' 			: (STRING) '3b' or '4b' or '5b'
				'num_civs' 		: (INT) Number of Players
			*/
			options = {
				'width' 		: 40,
				'height' 		: 40,
				'land_mass' 	: 'large',
				'land_form' 	: 'continents',
				'climate' 		: 'temperate',
				'temperature' 	: 'warm',
				'age' 			: '3b',
				'num_civs' 		: 4,
			};

	function init()
	{
		define_elements();

		elm.map.attr({
			'width' 	: 32 * (options.width + 1),
			'height' 	: 16 * (options.width + 1)
		});
	}

	function define_elements()
	{
		elm.map = $('#map');
	}

	/*
		Randomly generate a playable map.
	*/
	function generate()
	{
		prepare_land_pool();

		_seed_base();
		_seed_land();
		_seed_resources();

		build();
	}

	function build()
	{
		for (var coordinates in tiles)
			draw_tile(coordinates, tiles[coordinates]);

		draw_shorelines();

		if (debugging)
		{
			draw_coordinates();
		}
	}

	/*
	*/
	function _seed_resources()
	{
		/*for (var y = 1; y < options.height; y += 2)
			for (var x = 3; x < options.width; x += 16)
			{
				var coordinates = [x, y].join(',');

				var tile = tiles[coordinates];

				var type = tile.type;

				var resource = rand(1, 2);

				if (tile_type_can_have_resource(type, resource))
					tile.resource = resource;
			}*/
	}

	function tile_type_can_have_resource(type, number)
	{
		return app.assets.get_position('terrain', type + '-resource' + number) !== null;
	}

	/*
		Place land-masses.
	*/
	function _seed_land()
	{
		/*
		// !!! Randomly place land on all tiles.
		for (var coordinates in tiles)
		{
			var tile = tiles[coordinates];

			tile.type = get_random_land_type();
		}

		return;
		*/

		/*
		// !!! Manually place some land tiles.
		tiles['6,6'].type = get_random_land_type();
		tiles['10,10'].type = get_random_land_type();

		return;
		*/

		var land_masses = [];

		var percent_total_land_area = 20/* % of total map area */;

		switch (options.land_mass)
		{
			case 'small':
				percent_total_land_area = (percent_total_land_area * 0.5);
			break;

			case 'normal':
			break;

			case 'large':
				percent_total_land_area = (percent_total_land_area * 2);
			break;
		}

		var total_map_area = ((options.width * options.height) / 2);

		switch (options.land_form)
		{
			case 'continents':

				var num_continents = Math.floor(options.num_civs / 2);

				var target_size = (total_map_area * (percent_total_land_area / 100));

				target_size = (target_size / num_continents);

				var increment = Math.floor(options.width / num_continents);

				// Create continents.
				for (var n = 0; n < num_continents; n++)
				{
					var from_x = n * increment;
					var to_x = (n + 1) * increment;
					var from_y = n * increment;
					var to_y = (n + 1) * increment;

					while (true)
					{
						var origin = get_random_coordinates(from_x, to_x, from_y, to_y);

						if (is_ocean_tile(origin))
							break;
					}

					var land_mass = define_land_mass(origin, target_size);

					for (var i in land_mass)
						set_tile(land_mass[i], get_random_land_type());
				}

			break;
		}
	}

	/*
		Returns an array of coordinates that define a land mass starting with the origin.
	*/
	function define_land_mass(origin, target_size)
	{
		var land_mass = [];

		var ignore 		= {},
			last_added 	= [origin];

		land_mass.push(origin);

		while (object_size(ignore) < target_size)
		{
			var add = extend_land_mass(last_added, ignore);

			var add_to_land_mass 	= add[0],
				add_to_ignore 		= add[1];

			for (var i in add_to_land_mass)
				land_mass.push(add_to_land_mass[i]);

			for (var i in add_to_ignore)
				ignore[add_to_ignore[i].join(',')] = true;

			last_added = add_to_land_mass;
		}

		return land_mass;
	}

	/*
		Extend a land mass out from the last added tiles.
	*/
	function extend_land_mass(last_added, ignore)
	{
		var add_to_land_mass 	= [],
			add_to_ignore 		= [];

		for (var m in last_added)
		{
			var start = last_added[m];

			var open_ocean_tiles = get_neighboring_open_ocean_tiles(start, true);

			for (var i in randomize_array(open_ocean_tiles))
			{
				var coordinates = open_ocean_tiles[i];

				// Skip some.
				if (rand(1, 5) === 1)
				{
					add_to_ignore.push(coordinates);

					ignore[coordinates.join(',')] = true;

					continue;
				}

				if (ignore[coordinates.join(',')] !== true)
				{
					add_to_land_mass.push(coordinates);
					add_to_ignore.push(coordinates);

					ignore[coordinates.join(',')] = true;
				}
			}
		}

		return [add_to_land_mass, add_to_ignore];
	}


	/*
		Defines all tiles with the default tile type.
	*/
	function _seed_base()
	{
		var range = create_range_of_coordinates(0, options.width, 0, options.height);

		for (var i in range)
			set_tile(range[i], 'ocean');
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
			var neighbors = get_neighboring_tiles(ocean_neighbors[m], true);

			var borders_land = false;

			for (var i in neighbors)
				if (
					neighbors[i] !== null &&
					is_valid_tile(neighbors[i]) &&
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
		var neighbors = get_neighboring_tiles(origin, adjacent_only);

		var ocean_neighbors = [];

		// Find all the neighbors that are ocean tiles.
		for (var i in neighbors)
			if (
				neighbors[i] !== null &&
				is_valid_tile(neighbors[i]) &&
				is_ocean_tile(neighbors[i])
			)
				ocean_neighbors.push(neighbors[i]);

		return ocean_neighbors;
	}

	/*
		Returns a string with the configuration of the given neighbors:

		Examples: 'www', 'llw', 'lwl', etc..
	*/
	function get_neighbor_configuration(neighbors)
	{
		var configuration = '';

		for (var i in neighbors)
		{
			if (
				neighbors[i] !== null &&
				is_valid_tile(neighbors[i]) &&
				is_land_tile(neighbors[i])
			)
				configuration += 'l';
			else
				configuration += 'w';
		}

		return configuration;
	}

	/*
		\ 6 \ 7 \ 0 \
		 \ 5 \ X \ 1 \
		  \ 4 \ 3 \ 2 \
	*/
	function get_neighboring_tiles(coordinates, adjacent_only)
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
		Builds array of base land types based on current options.
	*/
	function prepare_land_pool()
	{
		var weights = {};

		for (var type in land.base)
			weights[type] = land.base[type];

		for (var option in land.multipliers)
			for (var type in land.multipliers[option][options[option]])
			{
				var multiplier = land.multipliers[option][options[option]][type];

				weights[type] += ((land.base[type] * multiplier) - land.base[type]);
			}

		for (var type in weights)
			for (var x = 0; x < weights[type]; x++)
				land.pool.push(type);
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

	/*
		Draw the appropriate shoreline around every land tile.
	*/
	function draw_shorelines()
	{
		for (var coordinates in tiles)
		{
			var tile = tiles[coordinates];

			// Only ocean tiles.
			if (tile.type !== 'ocean')
				continue;

			coordinates = coordinates.split(',');

			var neighbors = get_neighboring_tiles(coordinates);

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

				var configuration = get_neighbor_configuration([
										neighbors[a],
										neighbors[b],
										neighbors[c]
									]);

				// Do we need to draw a shoreline?
				if (configuration !== 'www')
					draw_to_tile('shoreline', configuration + '-' + quadrant, coordinates, quadrant);
			}

		}
	}

	/*
		Draws a tile, with all of its layers, to the map.
	*/
	function draw_tile(coordinates, tile)
	{
		/*
			Place base terrain.
		*/
		switch (tile.type)
		{
			case 'mountains':
			case 'hills':
			case 'forest':

				draw_to_tile('terrain', 'grassland', coordinates);

			break;
		}

		draw_to_tile('terrain', tile.type, coordinates);

		if (tile.resource !== undefined)
			draw_to_tile('terrain', tile.type + '-resource' + tile.resource, coordinates);
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

	function get_random_coordinates(from_x, to_x, from_y, to_y)
	{
		var range = create_range_of_coordinates(from_x, to_x, from_y, to_y);

		return range[rand(0, range.length - 1)];
	}

	/*
		Returns a range of valid coordinates given the provided constraints.
	*/
	function create_range_of_coordinates(from_x, to_x, from_y, to_y)
	{
		var range = [];

		if (from_x % 2)// Is Odd
		{
			var start_x_odd = from_x;
			var start_x_even = from_x + 1;
		}
		else
		{
			var start_x_even = from_x;
			var start_x_odd = from_x + 1;
		}

		if (from_y % 2)// Is Odd
		{
			var start_y_odd = from_y;
			var start_y_even = from_y + 1;
		}
		else
		{
			var start_y_even = from_y;
			var start_y_odd = from_y + 1;
		}

		/*
			Create even coordinates.
		*/
		for (var x = start_x_even; x < to_x; x += 2)
			for (var y = start_y_even; y < to_y; y += 2)
				range.push([x, y]);

		/*
			Create odd coordinates.
		*/
		for (var x = start_x_odd; x < to_x; x += 2)
			for (var y = start_y_odd; y < to_y; y += 2)
				range.push([x, y]);
		
		return range;
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

	function get_random_land_type()
	{
		var index = rand(0, land.pool.length - 1);

		return land.pool[index];
	}

	function set_tile(coordinates, type)
	{
		tiles[coordinates.join(',')] = {'type': type};
	}

	function set_tile_resource(coordinates, resource)
	{
		tiles[coordinates.join(',')].resource = resource;
	}

	function is_ocean_tile(coordinates)
	{
		return tiles[coordinates.join(',')].type === 'ocean';
	}

	function is_land_tile(coordinates)
	{
		return tiles[coordinates.join(',')].type !== 'ocean';
	}

	function is_valid_tile(coordinates)
	{
		return tiles[coordinates.join(',')] !== undefined;
	}

	callbacks['assets:loaded'] = function()
	{
		generate();
	}

	Interface.init 			= init;
	Interface.callbacks 	= callbacks;

	return Interface;
}