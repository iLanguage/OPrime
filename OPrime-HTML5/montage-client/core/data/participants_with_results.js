exports.emit = function(key, value) {
	console.log(key, value);
}
exports.map = function(doc) {
	emit = emit || this.emit;

	try {
		if (doc.jsonType === "experiment") {
			var participant = doc.participants[doc.participants.length - 1];
			for (var i = doc.participants.length - 1; i >= 0; i--) {
				emit(doc.participants[i], doc._id);
			};
		}
	} catch (e) {
		emit(e, 1);
	}
}

// exports.reduce = function(values) {
// 	return values.length;
// }
