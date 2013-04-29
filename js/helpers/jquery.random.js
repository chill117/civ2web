/*
	Return one random element from a set of elements.
*/
$.fn.random = function() {

	var from = 0;
	var to = this.length - 1;

	var index = Math.floor(Math.random() * (to - from + 1) + from);

	return this.eq(index);

}