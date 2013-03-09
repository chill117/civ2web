<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once BASEPATH . '/libraries/Session.php';

class MY_Session extends CI_Session
{

	function __construct()
	{
		$CI =& get_instance();

		$encryption_key = $CI->config->item('encryption_key');
		
		if (empty($encryption_key))
		{
			$encryption_key = htmlspecialchars($this->generate_encryption_key(), ENT_QUOTES);

			show_error('To use the session or encryption classes, you must set the encryption key in application/config/config.php:<br />' . $encryption_key);
		}

		parent::__construct();

		$this->CI->session = $this;
	}

	function sess_update()
	{
		// Do NOT update an existing session on AJAX calls.
		if (!$this->CI->input->is_ajax_request())
			return parent::sess_update();
	}

	protected function generate_encryption_key()
	{
		$length = 128;
		$charset = 	'abcdefghijklmnopqrstuvwxyz' . 
					'ABCDEFGHIJKLMNOPQRSTUVWXYZ' . 
					'0123456789' . 
					'~!@#$%^&*()-=+_[]{}|\/<>,.';

		return $this->generate_random_string($length, $charset);
	}

	protected function generate_random_string($length, $character_set)
	{
		$code = '';

		$charset_length = strlen($character_set);

		while (strlen($code) < $length)
			$code .= $this->get_random_character($character_set, $charset_length);

		return $code;
	}

	protected function get_random_character($string, $length)
	{
		return substr($string, mt_rand(0, $length - 1), 1);
	}

}

/* End of file MY_Session.php */
/* Location: ./application/libraries/MY_Session.php */