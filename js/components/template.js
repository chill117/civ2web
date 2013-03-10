app.components.template = function()
{
	"use strict";
	
	var 	Interface 	= {};

	function parse(name, data)
	{
		var template = $('script.template[data-name="' + name + '"]');

		if (template.length === 0)
			return '';

		if (data === undefined || data === null)
			data = {};

		var html = $.trim(template.html());

		html = evaluate_if_statements(html, data);

		html = replace_variables(html, data);

		return html;
	}

	function evaluate_if_statements(html, data)
	{
		var regex = /\{if (\!?[a-zA-Z0-9_:]+)( ([\!=<>]+) ([a-zA-Z0-9_:'"]+))?\}([^\{\}]*)\{\/if\}/g;

		return html.replace(regex, function(full_match, key, conditional, operator, condition, inner) {

			var value = get_value(data, key);

			// Use conditional, if there is one.
			if (conditional !== undefined)
				return evaluate_conditional(value, operator, condition, data) ? inner : '';

			var negated = key.substr(0, 1) == '!';

			if (negated)
				key = key.substr(1, key.length - 1);

			if (
				(!negated && value === true) ||
				(negated && value !== true)
			)
				return inner;

			return '';
		});
	}

	function evaluate_conditional(value, operator, condition, data)
	{
		condition = auto_cast_condition(condition, data);

		if (operator == '==')
			return value == condition;

		if (operator == '!=')
			return value != condition;

		if (operator == '===')
			return value === condition;

		if (operator == '!==')
			return value !== condition;

		if (typeof condition === 'number')
		{
			if (operator == '>')
				return value > condition;

			if (operator == '>=')
				return value >= condition;

			if (operator == '<')
				return value < condition;

			if (operator == '<=')
				return value <= condition;
		}

		return false;
	}

	function auto_cast_condition(condition, data)
	{
		var match;

		// Is it a hard-coded string within the conditional?
		if ((match = condition.match(/('([^']*)'|"([^"]*)")/)) !== null)
			// Return the contents of the quotes.
			return (match[2] !== undefined ? match[2] : match[3]).toString();

		// Is it a number?
		if ((match = condition.match(/-?[0-9\.]+/)) !== null)
			// Is it a floating point number or an integer?
			return match[0].search('.') !== -1 ? parseFloat(match[0]) : parseInt(match[0]);

		// Last, we assume it is a variable from the data object.
		return get_value(condition, data);
	}

	function replace_variables(html, data)
	{
		return html.replace(/\{([a-zA-Z0-9_:]+)\}/g, function(full_match, key) {

			var value = get_value(data, key);

			return value !== null ? value : '';
			
		});
	}

	function get_value(data, key)
	{
		var pos;

		if ((pos = key.search(':')) === -1)
			return data[key] !== undefined ? data[key] : null;

		var base_key = key.substr(0, pos);

		if (data[base_key] === undefined)
			return null;

		return get_value(data[base_key], key.substr(pos + 1, key.length - pos));
	}

	// "Public" methods
	Interface.parse = parse;

	return Interface;
}