<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Main_screen extends CI_Controller
{

	function __construct()
	{
		parent::__construct();
	}

	public function index()
	{
		$this->view_wrapper->stack('main_screen');
		$this->view_wrapper->push();
	}
	
}