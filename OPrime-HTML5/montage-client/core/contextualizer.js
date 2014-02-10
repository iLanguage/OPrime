var Montage = require("montage/montage").Montage;
var Q = require("q");

exports.Contextualizer = Montage.specialize( /** @lends Contextualizer# */ {

	constructor: {
		value: function Contextualizer(files) {
			this.super();

			this.defaultLocale = "en";
			this.currentLocale = this.defaultLocale;
			return this;
		}
	},

	_require: {
		value: (typeof global !== "undefined") ? global.require : (typeof window !== "undefined") ? window.require : null
	},

	data: {
		value: {}
	},

	localize: {
		value: function(message) {
			console.log("Resolving localization ");
			var result = message;
			if (!this.data) {
				console.warn("No localizations available, resolving the key itself: ", result);
				return result;
			}

			if (this.data[this.currentLocale] && this.data[this.currentLocale][message] && this.data[this.currentLocale][message].message !== undefined && this.data[this.currentLocale][message].message) {
				result = this.data[this.currentLocale][message].message;
				console.log("Resolving localization using requested language: ", result);
			} else {
				if (this.data[this.defaultLocale] && this.data[this.defaultLocale][message] && this.data[this.defaultLocale][message].message !== undefined && this.data[this.defaultLocale][message].message) {
					result = this.data[this.defaultLocale][message].message;
					console.warn("Resolving localization using default: ", result);
				} 
			}
			return result;
		}
	},

	/*
	TODO this doesnt work in a chrome app sandbox, so use the addMessagesToContextualizedStrings instead
	 */
	addFiles: {
		value: function(files) {
			var allDone = [],
				self = this,
				promise;

			var processJSON = function(localeCode) {
				promise.then(function(contents) {
					contents = JSON.parse(contents);
					return self.addMessagesToContextualizedStrings(contents, localeCode);
				});
			};
			for (var f = 0; f < files.length; f++) {
				this.data[files[f].localeCode] = this.data[files[f].localeCode] || {};

				console.log("Loading " + files[f].path);
				promise = this._require.read(files[f].path);
				processJSON(files[f].localeCode); //TODO test this
				allDone.push(promise);
			}
			return Q.all(allDone);
		}
	},

	addMessagesToContextualizedStrings: {
		value: function(localeData, localeCode) {
			if (!localeData) {
				return;
			}

			for (var message in localeData) {
				if (localeData.hasOwnProperty(message)) {
					this.data[localeCode] = this.data[localeCode] || {};
					this.data[localeCode][message] = localeData[message];
				}
			}
		}
	}

});
