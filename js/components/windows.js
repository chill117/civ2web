app.components.windows = function()
{
	var 	Interface 	= {},
			callbacks 	= {};

	function prepare_window(_window)
	{
		title = _window.find('.title');
		menu = _window.find('.menu');
		content = _window.find('.content');

		var data = {};

		data.name = _window.data('name');
		data.title = title.html();
		data.menu = menu.html();
		data.content = content.html();

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