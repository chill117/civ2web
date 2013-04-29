<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Build
{

	function __construct()
	{
		$this->ci =& get_instance();
	}

	public function run($base_path, $file_paths, $type)
	{
		$builds_path 	= $base_path . '/builds';
		$builds_dir 	= BASE_DIR . $builds_path;

		$build_name = sha1(implode(',', $file_paths));

		$build_file = $builds_dir . '/' . $build_name . '.' . $type;

		$latest_mtime = 0;

		foreach ($file_paths as $i => $path)
		{
			if (!file_exists(BASE_DIR . '/' . $path))
			{
				unset($files[$i]);
				continue;
			}

			if (($mtime = filemtime(BASE_DIR . '/' . $path)) !== false && $mtime > $latest_mtime)
				$latest_mtime = $mtime;
		}

		if (!file_exists($build_file) || filemtime($build_file) < $latest_mtime)
		{
			// Reset the contents of the build file.
			file_put_contents($build_file, '');

			// Append the contents of each of the individual files.
			foreach ($file_paths as $path)
			{
				$contents = file_get_contents(BASE_DIR . '/' . $path);

				file_put_contents($build_file, $contents . "\n\n", FILE_APPEND);
			}

			switch ($type)
			{
				case 'css':
					$this->fix_relative_url_paths_in_css_file($build_file);
				break;
			}
		}

		return $builds_path . '/' . $build_name . '.' . $type;
	}

	/*
		Finds and fixes relative URL paths.

		Example:  url('../../images/some_image.png');
	*/
	protected function fix_relative_url_paths_in_css_file($file)
	{
		$css = file_get_contents($file);

		if (
				preg_match_all(
					'~url\((\'|")?((\.\.\/)[^\.]([^\)\'"]*))(\'|")?\)~',
					$css,
					$matches,
					PREG_OFFSET_CAPTURE
				) > 0
		)
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