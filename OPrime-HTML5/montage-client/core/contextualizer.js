var Montage = require("montage/montage").Montage;
var Q = require("q");

exports.Contextualizer = Montage.specialize( /** @lends Experiment# */ {

	constructor: {
		value: function Contextualizer(files) {
			this.super();

			this.defaultLocale = "en";
			window.currentLocale = this.defaultLocale;
			/* TODO get this out of the window */
			window.ContextualizedStrings = window.ContextualizedStrings || {
				"data": {},
				"get": function(message) {
					return message;
				}
			};
			window.contextualizer = this;

			return this;
		}
	},

	_require: {
		value: (typeof global !== "undefined") ? global.require : (typeof window !== "undefined") ? window.require : null
	},

	addFiles: {
		value: function(files) {
			var allDone = [];
			var self = this;
			var processJSON = function(contents) {
				return self.addMessagesToContextualizedStrings(contents, localeCode);
			};
			for (var f = 0; f < files.length; f++) {
				console.log("Loading " + files[f]);
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

			window.setTimeout(function() {
				if (!localeData) {
					deferred.reject("No data");
					return;
				}
				localeData = JSON.parse(localeData);
				window.ContextualizedStrings.data[localeCode] = window.ContextualizedStrings.data[localeCode] || {};
				/* make sure the get function works now that there is data */
				window.ContextualizedStrings.get = function(message) {
					return window.ContextualizedStrings.data[window.currentLocale][message].message;
				};
				for (var message in localeData) {
					if (localeData.hasOwnProperty(message)) {
						window.ContextualizedStrings.data[localeCode][message] = localeData[message];
					}
				}
				deferred.resolve("Okay");

			}, 100);

			return deferred.promise;
		}
	}

});