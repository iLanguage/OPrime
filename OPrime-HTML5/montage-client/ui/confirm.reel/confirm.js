/**
 * @module ui/confirm.reel
 * @requires montage/ui/Confirm
 */
var Confirm = require("matte/ui/popup/confirm.reel").Confirm;

/**
 * @class Confirm
 * @extends Confirm
 */
exports.Confirm = Confirm.specialize(/** @lends Confirm# */ {
    constructor: {
        value: function Confirm() {
            this.super();
        }
    },
     templateModuleId: {
        value: "ui/confirm.reel/confirm.html"
    }
});
