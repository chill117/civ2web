<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Custom
{

	function __construct()
	{
		$this->ci =& get_instance();

		$this->prepare_view_data();
	}

	protected function prepare_view_data()
	{
		$this->prepare_view_data__css_files();
		$this->prepare_view_data__js_files();
	}

	/*
		Passes the CSS Files to be loaded to the View Wrapper.
	*/
	protected function prepare_view_data__css_files()
	{
		$paths = array(
			'reset.css',
			'style.css',
			'responsive.css',
			'advancements.css',
			'improvements.css',
			'cities.css'
		);

		$this->ci->view_wrapper->load_css($paths);
	}

	/*
		Passes the JavaScript Files to be loaded to the View Wrapper.
	*/
	protected function prepare_view_data__js_files()
	{
		$paths = array(
			'third_party/underscore.js',
			'third_party/backbone.js',
			'third_party/backbone.localStorage.js',
			'helpers/backbone._super.js',
			'helpers/jquery.borderPaddingMargin.js',
			'helpers/jquery.center.js',
			'helpers/jquery.random.js',
			'libraries/core/event.js',
			'libraries/core/sprites.js',
			'libraries/core/config.js',
			'libraries/core/lang.js',
			'libraries/core/template.js',
			'libraries/core/session.js',
			'libraries/games.js',
			'libraries/map.js',
			'libraries/map_draw.js',
			'libraries/map_generator.js',
			'libraries/window.js',
			'libraries/modal.js',
			'app.js',
			'models/game.js',
			'models/session.js',
			'collections/games.js',
			'collections/session.js',
			'views/app.js',
			'views/main_screen.js',
			'views/load_game.js',
			'views/pre_game/select_world_size.js',
			'views/pre_game/select_difficulty_level.js',
			'views/pre_game/select_number_of_civs.js',
			'views/pre_game/select_barbarian_level.js',
			'views/pre_game/select_tribe.js',
			'views/pre_game/select_gender.js',
			'views/pre_game/select_city_style.js',
			'views/pre_game/enter_your_name.js',
			'views/game/city_report_options.js',
			'views/game/game_options.js',
			'views/game/map.js',
			'views/game/menu.js',
			'views/game/mini_map.js',
			'views/game/quit.js',
			'views/game/status.js',
			'views/game.js'
		);

		$this->ci->view_wrapper->load_js($paths);
	}

}