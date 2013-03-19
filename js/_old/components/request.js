app.components.request = function()
{
	var Interface = {};

	function get(url, data, callback)
	{
		request('GET', url, data, callback);
	}

	function post(url, data, callback)
	{
		request('POST', url, data, callback);
	}

	function request(verb, url, data, callback)
	{
		$.ajax({
			type: verb,
			url: url,
			data: data,
			complete: function(response)
			{
				var status = response.status;
				var data = parse_response(response);

				if (
					callback !== undefined &&
					typeof callback === 'function'
				)
					callback(status, data);
			}
		});
	}

	function parse_response(response)
	{
		return response.responseText !== null ? $.parseJSON(response.responseText) : {};
	}

	// "Public" methods
	Interface.get 	= get;
	Interface.post 	= post;

	return Interface;
}