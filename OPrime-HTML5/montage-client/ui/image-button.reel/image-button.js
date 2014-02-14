/**
 * @module ui/image-button.reel
 * @requires montage/ui/component
 */
var AbstractButton = require("montage/ui/base/abstract-button").AbstractButton;


/**
 * @class ImageButton
 * @extends AbstractButton
 */
exports.ImageButton = AbstractButton.specialize( /** @lends ImageButton# */ {
	constructor: {
		value: function ImageButton() {
			this.super();
		}
	}

	// prepareForActivationEvents: {
	// 	value: function() {
	// 		this._pressComposer.addEventListener("pressStart", this, false);
	// 		this._pressComposer.addEventListener("press", this, false);
	// 		this._pressComposer.addEventListener("pressCancel", this, false);
	// 	}
	// },

	// enterDocument: {
	// 	value: function(firstTime) {
	// 		this.super(firstTime);

	// 		if (firstTime) {
	// 			console.log(this.src);
	// 		}
	// 	}
	// },

	// handlePress: {
	// 	value: function(e) {
	// 		console.log("The image button has been pressed: ");
	// 	}
	// }

});
