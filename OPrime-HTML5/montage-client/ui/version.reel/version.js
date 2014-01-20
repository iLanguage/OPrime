/**
 * @module ui/version.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
    packageDetails = require("package.json");
/**
 * @class Version
 * @extends Component
 */
exports.Version = Component.specialize( /** @lends Version# */ {
    constructor: {
        value: function Version() {
            this.super();
        }
    },

    montageDescription: {
        get: function() {
            if (packageDetails.version) {
                return packageDetails.version;
            } else {
                return "Unknown";
            }
        }
    }
});
