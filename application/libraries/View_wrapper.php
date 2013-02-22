<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class View_wrapper
{
	private $stack = array();
	private $sticky = array();

	private $wrappers = array(
		'above' => array('header'),
		'below' => array('footer')
	);

	private $vars = array(
		'wrappers' => array(),
		'global' => array()
	);

	private $page_title_delimiter 				= ' - ';
	private $noindex_when_query_string_exists 	= true;

	public function __construct()
	{
		$this->ci =& get_instance();

		$this->ci->load->helper('array_replace_recursive');

		$global_vars = array(
			'debugging' => ENVIRONMENT === 'development',
			'host' => $_SERVER['HTTP_HOST'],
			'site_url' => $this->ci->config->config['base_url'],
			'site_name' => $this->ci->config->item('site_name'),
			'site_description' => $this->ci->config->item('site_description'),
			'google_analytics' => $this->ci->config->item('site_google_analytics'),
		);

		$global_vars['body_classes'] = array();

		if (count(($uri_segments = $this->ci->uri->rsegment_array())) > 0)
			foreach ($uri_segments as $segment)
				if ($segment != 'index')
					$global_vars['body_classes'][] = $segment;

		$this->set_global_vars($global_vars);
		$this->set_default_meta_information();
	}

	public function push($return = false)
	{
		$html = '';

		$this->override_meta_information();

		$html .= $this->push_wrappers('above', true);

		if (count($this->sticky) > 0)
			foreach ($this->sticky as $args)
				$this->prepend_to_stack($args['view'], $args['data']);

		if (count($this->stack) > 0)
			foreach ($this->stack as $args)
				$html .= $this->ci->load->view($args['view'], $args['data'], true);
		
		$html .= $this->push_wrappers('below', true);

		if ($return)
			return $html;

		echo $html;
	}

	public function set_page_title($title)
	{
		$meta = $this->get_meta_information();
		$meta['title'] = $title;
		$this->set_meta_information($meta);
	}

	public function append_to_page_title($title)
	{
		$meta = $this->get_meta_information();

		if (!empty($meta['title']))
			$meta['title'] .= $this->page_title_delimiter . $title;
		else
			$meta['title'] = $title;

		$this->set_meta_information($meta);
	}

	public function sticky($view, $data = array())
	{
		$this->sticky[] = array('view' => $view, 'data' => $data);
	}

	public function stack($view, $data = array())
	{
		$this->append_to_stack($view, $data);
	}

	public function append_to_stack($view, $data = array())
	{
		$this->stack[] = array('view' => $view, 'data' => $data);
	}

	public function prepend_to_stack($view, $data = array())
	{
		array_unshift($this->stack, array('view' => $view, 'data' => $data));
	}

	public function set_wrappers_above($views)
	{
		$this->wrappers['above'] = $views;
	}

	public function set_wrappers_below($views)
	{
		$this->wrappers['below'] = $views;
	}

	public function get_wrapper_vars($wrapper)
	{
		return isset($this->vars['wrappers'][$wrapper]) ? $this->vars['wrappers'][$wrapper] : array();
	}

	public function set_wrapper_vars($wrapper, $vars)
	{
		if (!isset($this->vars['wrappers'][$wrapper]))
			$this->vars['wrappers'][$wrapper] = array();

		$this->vars['wrappers'][$wrapper] = array_replace_recursive($this->vars['wrappers'][$wrapper], $vars);
	}

	public function set_global_vars($vars)
	{
		if (!isset($this->vars['global']))
			$this->vars['global'] = array();

		$this->vars['global'] = array_replace_recursive($this->vars['global'], $vars);
	}

	public function get_meta_information()
	{
		$header_vars = $this->get_wrapper_vars('header');

		return isset($header_vars['meta']) ? $header_vars['meta'] : array();
	}

	public function set_meta_information($meta)
	{
		$this->set_wrapper_vars('header', array('meta' => $meta));
	}

	public function set_meta_tag($tag, $value)
	{
		$meta = $this->get_meta_information();
		$meta[$tag] = $value;
		$this->set_meta_information($meta);
	}

	private function push_wrappers($where, $return)
	{
		$html = '';
		$wrappers = $this->wrappers[$where];

		if (!is_array($wrappers))
			$wrappers = explode(',', $wrappers);

		if (count($wrappers) > 0)
			foreach ($wrappers as $k => $view)
				$wrappers[$k] = trim($view);

		if (count($wrappers) > 0)
			foreach ($wrappers as $wrapper)
			{
				$vars = isset($this->vars['wrappers'][$wrapper]) ? $this->vars['wrappers'][$wrapper] : array();
				$vars = array_replace_recursive($this->vars['global'], $vars);

				$html .= $this->ci->load->view($wrapper, $vars, $return);
			}

		return $html;
	}

	private function set_default_meta_information()
	{
		$meta = array();
		$meta['title'] = $this->ci->config->item('site_name');
		$meta['description'] = $this->ci->config->item('site_description');
		$meta['robots'] = 'index,follow';

		$this->set_wrapper_vars('header', array('meta' => $meta));
	}

	private function override_meta_information()
	{
		if (
			$this->noindex_when_query_string_exists &&
			!empty($_SERVER['QUERY_STRING'])
		)
		{
			$meta = array('robots' => 'noindex,follow');

			$this->set_wrapper_vars('header', array('meta' => $meta));
		}
	}

}