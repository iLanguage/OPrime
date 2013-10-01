/**
 * @module ui/experimenter.reel
 * @requires ui/user.reel
 */
var User = require("ui/user.reel").User;

/**
 * @class Experimenter
 * @extends User
 */
exports.Experimenter = User.specialize(/** @lends Experimenter# */ {
    constructor: {
        value: function Experimenter() {
            this.super();
        }
    },

    templateModuleId: {
        value: "ui/user.reel/user.html"
    }
});
