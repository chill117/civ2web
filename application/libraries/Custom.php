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
			'helpers/jquery.center.js',
			'helpers/jquery.borderPaddingMargin.js',
			'helpers/jquery.randomFilter.js',
			'libraries/event.js',
			'libraries/config.js',
			'libraries/lang.js',
			'libraries/template.js',
			'libraries/session.js',
			'app.js',
			'models/save.js',
			'models/session.js',
			'collections/saves.js',
			'collections/session.js',
			'views/app.js',
			'views/main_screen.js',
			'views/select_world_size.js',
			'views/select_difficulty_level.js',
			'views/select_number_of_civs.js',
			'views/select_barbarian_level.js',
			'views/select_tribe.js',
			'views/select_gender.js',
			'views/select_city_style.js',
			'views/enter_your_name.js',
			'views/game.js'
		);

		$this->ci->view_wrapper->load_js($paths);
	}

}