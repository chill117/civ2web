<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en-US">

<head profile="http://gmpg.org/xfn/11">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	
	<title><?= @$meta['title'] ?></title>
	
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	
<?php if (count($load_css) > 0): foreach ($load_css as $href): ?>

	<link rel="stylesheet" href="<?= $href ?>" /><?php endforeach; endif; ?>

<?php if (ENVIRONMENT !== 'development'): ?>
	<script src="https://ajax.googleapis.com/ajax/third_party/jquery/1.9.1/jquery.min.js"></script><?php else: ?>
	<script>window.jQuery || document.write('<script src="/js/third_party/jquery.js<?= cache_buster('/js/third_party/jquery.js'); ?>">\x3C/script>')</script><?php endif; ?>

	
	<!--[if (gte IE 6)&(lte IE 8)]>
		<script src="/js/third_party/selectivizr.js<?= cache_buster('/js/third_party/selectivizr.js'); ?>"></script>
	<![endif]-->
	
	<script src="/js/third_party/modernizr.js<?= cache_buster('/js/third_party/modernizr.js'); ?>"></script>
	
</head>

<body<?php if (($uri_string = $this->uri->uri_string()) != '/'): ?> class="<?= str_replace('/', ' ', $uri_string) ?>"<?php endif; ?>>

