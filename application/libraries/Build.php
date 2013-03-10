<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Build
{

	protected $js_files = 	array(
								'core.js',
								'components/request.js',
								'components/assets.js',
								'components/map.js',
								'components/windows.js',
								'components/template.js',
								'helpers/map.js',
								'helpers/map_generator.js',
								'helpers/window.js',
							);

	protected $css_files = 	array(
								'reset.css',
								'style.css',
								'advancements.css',
								'cities.css',
								'improvements.css',
							);

	protected $css_path = '/css';

	protected $js_path = '/js';

	function __construct()
	{
		$this->ci =& get_instance();

		$this->ci->load->helper('cache_buster');

		switch (ENVIRONMENT)
		{
			case 'development':
				$this->combine_css 	= false;
				$this->combine_js 	= false;
			break;

			case 'testing':
				$this->combine_css 	= true;
				$this->combine_js 	= true;
			break;
			
			case 'production':
				$this->combine_css 	= true;
				$this->combine_js 	= true;
			break;
		}

		$this->load_css_files();
		$this->load_js_files();
	}

	private function load_css_files()
	{
		$files = $this->css_files;

		if ($this->combine_css)
		{
			$build_file_path = $this->combine_css($files);

			$load_css[] = $build_file_path . cache_buster($build_file_path);
		}
		else
		{
			foreach ($files as $file)
			{
				$file_path = $this->css_path . '/' . $file;

				$load_css[] = $file_path . cache_buster($file_path);
			}
		}

		$this->ci->view_wrapper->append_to_wrapper_variable('header', 'load_css', $load_css);
	}

	private function load_js_files()
	{
		$files = $this->js_files;

		if ($this->combine_js)
		{
			$build_file_path = $this->combine_js($files);

			$load_js[] = $build_file_path . cache_buster($build_file_path);
		}
		else
		{
			foreach ($files as $file)
			{
				$file_path = $this->js_path . '/' . $file;

				$load_js[] = $file_path . cache_buster($file_path);
			}
		}

		$this->ci->view_wrapper->append_to_wrapper_variable('footer', 'load_js', $load_js);
	}

	private function combine_css($files)
	{
		return $this->compile_build_file($this->css_path, $files, 'css');
	}

	private function combine_js($files)
	{
		return $this->compile_build_file($this->js_path, $files, 'js');
	}

	private function compile_build_file($base_path, $files, $type)
	{
		$builds_path 	= $base_path . '/builds';

		$base_dir 		= BASE_DIR . $base_path;
		$builds_dir 	= BASE_DIR . $builds_path;

		$build_name = sha1(implode(',', $files));

		$build_file = $builds_dir . '/' . $build_name . '.' . $type;

		$latest_mtime = 0;

		foreach ($files as $i => $file)
		{
			if (!file_exists($base_dir . '/' . $file))
			{
				unset($files[$i]);
				continue;
			}

			if (($mtime = filemtime($base_dir . '/' . $file)) !== false && $mtime > $latest_mtime)
				$latest_mtime = $mtime;
		}

		if (!file_exists($build_file) || filemtime($build_file) < $latest_mtime)
		{
			// Reset the contents of the build file.
			file_put_contents($build_file, '');

			// Append the contents of each of the individual files.
			foreach ($files as $file)
			{
				$contents = file_get_contents($base_dir . '/' . $file);

				file_put_contents($build_file, $contents . "\n\n", FILE_APPEND);
			}

			if ($type === 'css')
				$this->fix_relative_url_paths_in_css_file($build_file);
		}

		return $builds_path . '/' . $build_name . '.' . $type;
	}

	private function fix_relative_url_paths_in_css_file($file)
	{
		$css = file_get_contents($file);

		if (preg_match_all('~url\((\'|")?((\.\.\/)[^\.]([^\)\'"]*))(\'|")?\)~', $css, $matches, PREG_OFFSET_CAPTURE) > 0)
		{
			$delta = 0;

			$relative_urls = $matches[2];

			foreach ($relative_urls as $url)
			{
				$old_url = $url[0];
				$pos = $url[1] + $delta;

				// We need to go up another folder.
				$fixed_url = '../' . $old_url;

				$delta += 3;

				$css = substr_replace($css, $fixed_url, $pos, strlen($old_url));
			}

			file_put_contents($file, $css);
		}
	}

}