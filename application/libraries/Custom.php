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
			'helpers/extend.backbone.js',
			'libraries/lang.js',
			'libraries/templates.js',
			'libraries/session.js',
			'models/save.js',
			'models/session.js',
			'collections/saves.js',
			'collections/session.js',
			'views/app.js',
			'views/main_screen.js',
			'views/game.js',
			'app.js'
		);

		$this->ci->view_wrapper->load_js($paths);
	}

}