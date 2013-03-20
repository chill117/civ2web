Backbone.Model.prototype._super = function(funcName, args) {
	if (args === undefined)
		args = _.rest(arguments);

	return this.constructor.__super__[funcName].apply(this, args);
}

Backbone.Collection.prototype._super = function(funcName, args) {
	if (args === undefined)
		args = _.rest(arguments);

	return this.constructor.__super__[funcName].apply(this, args);
}

Backbone.View.prototype._super = function(funcName, args) {
	if (args === undefined)
		args = _.rest(arguments);

	return this.constructor.__super__[funcName].apply(this, args);
}