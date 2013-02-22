<?php

function cache_buster($path)
{
	$file = BASE_DIR . $path;

	return file_exists($file) ? '?' . sha1(filemtime($file)) : '';
}