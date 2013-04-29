/*
	Get the combined vertical border, padding, and margin.
*/
$.fn.borderPaddingMarginHeight = function() {

	return (this.outerHeight(true) - this.height());

}

/*
	Get the combined horizontal border, padding, and margin.
*/
$.fn.borderPaddingMarginWidth = function() {

	return (this.outerWidth(true) - this.width());

}