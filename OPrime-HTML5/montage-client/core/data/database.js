var Q = require("q");
CORS = require("core/cors").CORS;

exports.get = function(id) {
	return CORS.makeCORSRequest({
		method: "GET",
		url: this.databaseUrl + "/" + id
	});
};
exports.delete = function(options) {
	throw "Deleting data is not permitted.";
};
exports.set = function(key, value) {
	// if (!this.databaseUrl) {
	// 	throw "Database url is not defined.";
	// }
	value._id = key;
	return CORS.makeCORSRequest({
		method: "POST",
		data: value,
		url: this.databaseUrl
	});
};
exports.view = function(view, reduced) {
	return CORS.makeCORSRequest({
		method: "GET",
		url: this.databaseUrl + "/_design/psycholinguistics/_view/" + view
	});
};
