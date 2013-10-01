/**
 * @module ui/participant.reel
 * @requires ui/user.reel
 */
var User = require("ui/user.reel").User;

/**
 * @class Participant
 * @extends User
 */
exports.Participant = User.specialize(/** @lends Participant# */ {
    constructor: {
        value: function Participant() {
            this.super();
        }
    },

    jsonType: {
        value: "participant"
    },

    templateModuleId: {
        value: "ui/user.reel/user.html"
    }
});
