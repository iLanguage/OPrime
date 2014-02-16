function(doc) {
	if (doc.jsonType === "experiment") {
		emit(doc.timestamp, doc);
	}
}
