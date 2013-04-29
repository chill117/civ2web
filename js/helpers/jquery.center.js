/*
	Center element(s) within a container.

	Notes:
	- The element(s) being centered must be positioned absolutely.
	- The container within which the element(s) are centered, must be
	positioned relatively.
*/
$.fn.center = function(axes, container) {

	// Default to the body.
	container || (container = $('body'));

	// Default to both axes.
	axes || (axes = 'xy');

	for (var i = 0; i < this.length; i++)
	{
		var element = this.eq(i);

		if (axes.indexOf('x') !== -1)
		{
			var containerInnerWidth = container.innerWidth();
			var elementOuterWidth = element.outerWidth(true);

			var left = (containerInnerWidth - elementOuterWidth) / 2;

			element.css('left', left);
		}

		if (axes.indexOf('y') !== -1)
		{
			var containerInnerHeight = container.innerHeight();
			var elementOuterHeight = element.outerHeight(true);

			var top = (containerInnerHeight - elementOuterHeight) / 2;

			element.css('top', top);
		}
	}

	return this;
}