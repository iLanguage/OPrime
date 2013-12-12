var Montage = require("montage/montage").Montage;
var Q = require("q");

exports.Contextualizer = Montage.specialize( /** @lends Experiment# */ {

	constructor: {
		value: function Contextualizer(files) {
			this.super();

			this.defaultLocale = "en";
			this.currentLocale = this.defaultLocale;
			/* TODO get this out of the window */
			this._contextualizationHolder = this._contextualizationHolder || {
				"data": {},
				"gimme": function(message) {
					return message;
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
				
				/* make sure the get function works now that there is data */
				self._contextualizationHolder.gimme = function(message) {
					return self._contextualizationHolder.data[self.currentLocale][message].message;
				};
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