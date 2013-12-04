/**
 * @module ui/experiment.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Experiment
 * @extends Component
 */
exports.Experiment = Component.specialize( /** @lends Experiment# */ {
	constructor: {
		value: function Experiment() {
			this.super();

			if (!this._locale) {
				this._locale = "en";
				var browserCurrentLanguage = (navigator.userLanguage || navigator.language).toLowerCase();
				var availableLocale = this.availableLocales.indexOf(browserCurrentLanguage);

				if (availableLocale > -1) {
					this._locale = browserCurrentLanguage;
				}
			}

		}
	},

	availableLocales: {
		value: ["en", "en-gb", "fr", "fr-ca"]
	},

	_locale: {
		value: null
	},

	locale: {
		get: function() {
			return this._locale;
		},
		set: function(value) {
			if (this.availableLocales.indexOf(value) === -1) {
				throw ("Request for unknown locale " + value);
			}
			this._locale = value;
		}
	},

	_description: {
		value: null
	},

	description: {
		get: function() {
			return this._description[this._locale];
		},
		set: function(value) {
			this._description = this._description || {};
			this._description[this._locale] = value;
		}
	}
});