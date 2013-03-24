/*global Backbone */
var app = app || {};

(function () {

	'use strict';

	app.MapGenerator = function(options) {

		/*
			Holds an instance of the map object.
		*/
		var map;

		/*
			Holds full range of coordinates during seeding process.
		*/
		var full_range = [];

		/*
			The array from which land types are randomly selected.
		*/
		var seed_pool = [];

		/*
			Configuration information.
		*/
		var seed_rules;

		function initialize() {

			seed_rules = app.Config.get('seed_rules');

			prepare_range_of_coordinates();

			prepare_map_object();

			prepare_seed_pool();

		}

		/*
			Randomly seeds a playable map.
		*/
		function seed()
		{
			seed_base();
			seed_land_masses();
			seed_resources();

			return map.get_all_tiles();
		}

		function seed_resources()
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

		function seed_land_masses()
		{
			var land_masses = [];

			var percent_total_land_area = 20/* % of total map area */;

			switch (options.land_mass)
			{
				case 'small':
					percent_total_land_area = (percent_total_land_area * 0.5);
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

						var range = create_range_of_coordinates(from_x, to_x, from_y, to_y);

						var land_mass = define_land_mass(range, target_size);

						for (var i in land_mass)
							map.set_tile_type(land_mass[i], get_random_land_type());
					}

				break;
			}
		}

		/*
			Returns an array of coordinates that define a land mass starting with the origin.
		*/
		function define_land_mass(range, target_size)
		{
			while (true)
			{
				var origin = get_random_coordinates_from_range(range);

				if (map.is_ocean_tile(origin))
					break;
			}

			var land_mass = [];

			var ignore 		= {},
				last_added 	= [origin];

			land_mass.push(origin);

			/*
				!!! Figure out way to reliably prevent this from looping forever.
			*/
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

				var open_ocean_tiles = map.get_neighboring_open_ocean_tiles(start, true);

				for (var i in randomize_array(open_ocean_tiles))
				{
					var coordinates = open_ocean_tiles[i];

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
		function seed_base()
		{
			for (var i in full_range)
				map.set_tile_type(full_range[i], 'ocean');
		}

		function get_random_coordinates(from_x, to_x, from_y, to_y)
		{
			var range = create_range_of_coordinates(from_x, to_x, from_y, to_y);

			return get_random_coordinates_from_range(range);
		}

		function get_random_coordinates_from_range(range)
		{
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

		function tile_type_can_have_resource(type, number)
		{
			return app.assets.get_position('terrain', type + '-resource' + number) !== null;
		}

		function get_random_land_type()
		{
			var index = rand(0, seed_pool.length - 1);

			return seed_pool[index];
		}

		function prepare_map_object()
		{
			var tiles = {};

			for (var i in full_range)
			{
				var coordinates = full_range[i];

				tiles[coordinates.join(',')] = {};
			}

			map = new app.Map(tiles);
		}

		/*
			Prepares the range of coordinates used during the seeding process.
		*/
		function prepare_range_of_coordinates()
		{
			full_range = create_range_of_coordinates(0, options.width, 0, options.height);
		}

		/*
			Builds the seed pool array based on the seed rules.
		*/
		function prepare_seed_pool()
		{
			var weights = {};

			for (var type in seed_rules.base)
				weights[type] = seed_rules.base[type];

			for (var option in seed_rules.multipliers)
				for (var type in seed_rules.multipliers[option][options[option]])
				{
					var multiplier = seed_rules.multipliers[option][options[option]][type];

					weights[type] += ((seed_rules.base[type] * multiplier) - seed_rules.base[type]);
				}

			for (var type in weights)
				for (var x = 0; x < weights[type]; x++)
					seed_pool.push(type);
		}

		initialize();

		// "Public" methods.
		this.seed = seed;

		return this;

	}

})();