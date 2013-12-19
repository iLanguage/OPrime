/**
 * @module ui/report.reel
 * @requires core/contextualizable-component
 */
var ContextualizableComponent = require("core/contextualizable-component").ContextualizableComponent;

/**
 * @class Report
 * @extends ContextualizableComponent
 */
exports.Report = ContextualizableComponent.specialize( /** @lends Report# */ {
	constructor: {
		value: function Report() {
			this.super();

			/*
			load experiment messages
			*/
			var doneYet = window.contextualizer.addFiles([{
				"path": "ui/report.reel/locales/en/messages.json",
				"localeCode": "en"
			}, {
				"path": "ui/report.reel/locales/fr/messages.json",
				"localeCode": "fr"
			}]);

		}
	}
});