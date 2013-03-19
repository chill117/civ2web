app.components.windows = function()
{
	var 	Interface 	= {},
			callbacks 	= {};

	function prepare_window(_window)
	{
		var data = {};

		data.name 		= _window.data('name');
		data.title 		= _window.find('.title').html();
		data.content 	= _window.find('.content').html();
		data.menu 		= _window.find('.menu').html();
		data.buttons 	= _window.find('.buttons').html();

		var html = app.template.parse('window', data);

		_window.replaceWith(html);
	}

	callbacks['document:ready'] = function()
	{
		var windows = $('.window');

		$.each(windows, function(i, _window) {

			prepare_window($(_window));

		});
	}

	// "Public" methods
	Interface.prepare_window 	= prepare_window;
	Interface.callbacks 		= callbacks;

	return Interface;
}