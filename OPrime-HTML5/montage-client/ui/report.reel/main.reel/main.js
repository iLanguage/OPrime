/**
 * @module ui/report.reel/main.reel
 * @requires core/contextualizable-component
 */
var ContextualizableComponent = require("core/contextualizable-component").ContextualizableComponent;

var enLocales = require("locale/en/messages.json");
var frLocales = require("locale/fr/messages.json");

/**
 * @class Main
 * @extends ContextualizableComponent
 */
exports.Main = ContextualizableComponent.specialize( /** @lends Main# */ {
	constructor: {
		value: function Main() {
			this.super();

			this.contextualizer.addMessagesToContextualizedStrings(enLocales, "en");
			this.contextualizer.addMessagesToContextualizedStrings(frLocales, "fr");
		}
	},

	handleLocalesAction: {
		value: function(e) {
			console.log("handleLocalesAction", e);
			this.contextualizer.currentLocale = e.target.value.iso;
			this.needsDraw = true;
		}
	},

	locales: {
		value: [{
			"iso": "en",
			"label": "English",
		}, {
			"iso": "fr",
			"label": "Français",
		}]
	}

});
