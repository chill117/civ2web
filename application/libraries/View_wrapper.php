<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class View_wrapper
{

	protected $page_title_delimiter = ' - ';

	protected $_wrappers = array(
		'above' => array('header'),
		'below' => array('footer')
	);

	protected $_vars = array(
		'wrappers' => array(),
		'global' => array()
	);

	protected $_stack = array();
	protected $_sticky = array();

	function __construct()
	{
		$this->ci =& get_instance();

		$this->ci->load->helper('array_replace_recursive');

		$meta = array();

		$meta['title'] 			= $this->ci->config->item('site_name');
		$meta['description'] 	= $this->ci->config->item('site_description');
		$meta['robots'] 		= 'index,follow';

		$this->set_meta_information($meta);
	}

	public function push($return = false)
	{
		$html = '';

		$html .= $this->push_wrappers('above', true);

		if (count($this->_sticky) > 0)
			foreach ($this->_sticky as $args)
				$this->prepend_to_stack($args['view'], $args['data']);

		if (count($this->_stack) > 0)
			foreach ($this->_stack as $args)
				$html .= $this->ci->load->view($args['view'], $args['data'], true);
		
		$html .= $this->push_wrappers('below', true);

		if ($return)
			return $html;

		echo $html;
	}

	public function set_page_title($title)
	{
		$this->set_meta_variable('title', $title);
	}

	public function append_to_page_title($title)
	{
		$current = $this->get_meta_variable('title');

		if (!empty($current))
			$current .= $this->page_title_delimiter . $title;
		else
			$current = $title;

		$this->set_meta_variable('title', $current);
	}

	public function sticky($view, $data = array())
	{
		$this->_sticky[] = array('view' => $view, 'data' => $data);
	}

	public function stack($view, $data = array())
	{
		$this->append_to_stack($view, $data);
	}

	public function append_to_stack($view, $data = array())
	{
		$this->_stack[] = array('view' => $view, 'data' => $data);
	}

	public function prepend_to_stack($view, $data = array())
	{
		array_unshift($this->_stack, array('view' => $view, 'data' => $data));
	}

	public function append_wrapper($where, $wrapper)
	{
		$this->_wrappers[$where][] = $wrapper;

		$this->_vars['wrappers'][$wrapper] = array();
	}

	public function prepend_wrapper($where, $wrapper)
	{
		array_unshift($this->_wrappers[$where], $wrapper);

		$this->_vars['wrappers'][$wrapper] = array();
	}

	public function set_wrappers($where, $wrappers)
	{
		$this->_wrappers[$where] = $wrappers;
	}

	public function prepend_to_wrapper_variable($wrapper, $variable_name, $value)
	{
		$current = $this->get_wrapper_variable($wrapper, $variable_name);

		if (!is_array($current))
			show_error('Cannot prepend to a wrapper variable that is not an array.');

		if (!is_array($value))
			$value = array($value);

		foreach ($value as $val)
			array_unshift($current, $val);

		$this->set_wrapper_variable($wrapper, $variable_name, $current);
	}

	public function append_to_wrapper_variable($wrapper, $variable_name, $value)
	{
		$current = $this->get_wrapper_variable($wrapper, $variable_name);

		if (!is_array($current))
			show_error('Cannot append to a wrapper variable that is not an array.');

		if (!is_array($value))
			$value = array($value);

		foreach ($value as $val)
			$current[] = $val;

		$this->set_wrapper_variable($wrapper, $variable_name, $current);
	}

	public function set_wrapper_variable($wrapper, $variable_name, $value)
	{
		$this->_vars['wrappers'][$wrapper][$variable_name] = $value;
	}

	public function get_wrapper_variable($wrapper, $variable_name)
	{
		return 	isset($this->_vars['wrappers'][$wrapper][$variable_name]) ?
					$this->_vars['wrappers'][$wrapper][$variable_name] :
						array();
	}

	public function set_global_variable($name, $value)
	{
		$this->_vars['global'][$name] = $value;
	}

	public function get_global_variable($name)
	{
		return 	isset($this->_vars['global'][$name]) ?
					$this->_vars['global'][$name] :
						null;
	}

	public function set_meta_variable($name, $value)
	{
		$meta = $this->get_meta_information();

		$meta[$name] = $value;

		$this->set_meta_information($meta);
	}

	public function get_meta_variable($name)
	{
		$meta = $this->get_meta_information();

		return $meta[$name];
	}

	public function get_meta_information()
	{
		return $this->get_wrapper_variable('header', 'meta');
	}

	public function set_meta_information($meta)
	{
		$this->get_wrapper_variable('header', 'meta', $meta);
	}

	protected function push_wrappers($where, $return)
	{
		$html = '';

		$wrappers = $this->_wrappers[$where];

		if (!is_array($wrappers))
			$wrappers = explode(',', $wrappers);

		if (count($wrappers) > 0)
			foreach ($wrappers as $k => $view)
				$wrappers[$k] = trim($view);

		if (count($wrappers) > 0)
			foreach ($wrappers as $wrapper)
			{
				$vars = isset($this->_vars['wrappers'][$wrapper]) ?
							$this->_vars['wrappers'][$wrapper] :
								array();

				$vars = array_replace_recursive($this->_vars['global'], $vars);

				$html .= $this->ci->load->view($wrapper, $vars, $return);
			}

		return $html;
	}

	/*
		!!!
		Deprecated Methods
	*/
	public function get_wrapper_vars()
	{
		show_error('get_wrapper_vars() has been deprecated. Use get_wrapper_variable() instead.');
	}

	public function set_wrapper_vars()
	{
		show_error('set_wrapper_vars() has been deprecated. Use set_wrapper_variable() instead.');
	}

	public function set_wrappers_above()
	{
		show_error('set_wrappers_above() has been deprecated. Use set_wrappers() instead.');
	}

	public function set_wrappers_below()
	{
		show_error('set_wrappers_below() has been deprecated. Use set_wrappers() instead.');
	}

	public function set_global_vars()
	{
		show_error('set_global_vars() has been deprecated. Use set_global_variable() instead.');
	}
	
	public function set_meta_tag()
	{
		show_error('set_meta_tag() has been deprecated. Use set_meta_variable() instead.');
	}

}