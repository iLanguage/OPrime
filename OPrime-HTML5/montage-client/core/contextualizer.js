var Montage = require("montage/montage").Montage;
var Q = require("q");

exports.Contextualizer = Montage.specialize( /** @lends Experiment# */ {

	constructor: {
		value: function Contextualizer(files) {
			this.super();

			this.defaultLocale = "en";
			this.currentLocale = this.defaultLocale;
			/* TODO get this out of the window */
			var self = this;
			this._contextualizationHolder = this._contextualizationHolder || {
				"data": {},
				"gimme": function(message) {
					var def = Q.defer();
					var result = message;

					window.setTimeout(function() {
						if (self._contextualizationHolder.data[self.currentLocale] && self._contextualizationHolder.data[self.currentLocale][message] && self._contextualizationHolder.data[self.currentLocale][message].message !== undefined && self._contextualizationHolder.data[self.currentLocale][message].message) {
							result = self._contextualizationHolder.data[self.currentLocale][message].message;
							console.log("Resolving localization quickly", result);
							def.resolve(result);
						} else {

							window.setTimeout(function() {
								if (self._contextualizationHolder.data[self.currentLocale] && self._contextualizationHolder.data[self.currentLocale][message] && self._contextualizationHolder.data[self.currentLocale][message].message !== undefined && self._contextualizationHolder.data[self.currentLocale][message].message) {
									result = self._contextualizationHolder.data[self.currentLocale][message].message;
								} else if (self._contextualizationHolder.data[self.currentLocale] && self._contextualizationHolder.data[self.currentLocale][message] && self._contextualizationHolder.data[self.currentLocale][message].message !== undefined) {
									self._contextualizationHolder.data[self.currentLocale][message].message;
								}
								console.log("Resolving localization slowly", result);
								def.resolve(result);
								return;
							}, 1000);
							return;

						}
					}, 100);

					return def.promise;
				}
			};
			// window.ContextualizedStrings = this._contextualizationHolder;
			window.contextualizer = this;

			return this;
		}
	},

	_require: {
		value: (typeof global !== "undefined") ? global.require : (typeof window !== "undefined") ? window.require : null
	},

	_contextualizationHolder: {
		value: null
	},

	localize: {
		value: function(key) {
			return this._contextualizationHolder.gimme(key);
		}
	},

	addFiles: {
		value: function(files) {
			var allDone = [];
			var self = this;
			var processJSON = function(contents) {
				return self.addMessagesToContextualizedStrings(contents, localeCode);
			};
			for (var f = 0; f < files.length; f++) {
				this._contextualizationHolder.data[files[f].localeCode] = this._contextualizationHolder.data[files[f].localeCode] || {};

				console.log("Loading " + files[f].path);
				var promise = this._require.read(files[f].path);
				(function(localeCode) {
					promise.then(function(contents) {
						return self.addMessagesToContextualizedStrings(contents, localeCode);
					});
				})(files[f].localeCode);
				allDone.push(promise);
			}
			return Q.all(allDone);
		}
	},

	addMessagesToContextualizedStrings: {
		value: function(localeData, localeCode) {
			var deferred = Q.defer();

			var self = this;
			window.setTimeout(function() {
				if (!localeData) {
					deferred.reject("No data");
					return;
				}
				localeData = JSON.parse(localeData);

				for (var message in localeData) {
					if (localeData.hasOwnProperty(message)) {
						self._contextualizationHolder.data[localeCode][message] = localeData[message];
					}
				}
				deferred.resolve("Okay");

			}, 100);

			return deferred.promise;
		}
	}

});