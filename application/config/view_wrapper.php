<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

$config = array();

switch (ENVIRONMENT)
{
	case 'development':
		$config['css_path'] 	= '/css';
		$config['js_path'] 		= '/js';
		$config['build_css'] 	= false;
		$config['build_js'] 	= false;
	break;

	case 'testing':
		$config['css_path'] 	= '/css';
		$config['js_path'] 		= '/js';
		$config['build_css'] 	= true;
		$config['build_js'] 	= true;
	break;

	case 'production':
		$config['css_path'] 	= '/css';
		$config['js_path'] 		= '/js';
		$config['build_css'] 	= true;
		$config['build_js'] 	= true;
	break;
}