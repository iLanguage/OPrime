/**
 * @module ui/image-button.reel
 * @requires montage/ui/component
 */
var Button = require("digit/ui/button").Button;

/**
 * @class ImageButton
 * @extends Button
 */
exports.ImageButton = Button.specialize(/** @lends ImageButton# */ {
    constructor: {
        value: function ImageButton() {
            this.super();
        }
    }
});
