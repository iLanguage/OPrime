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
        }
    },
    title: {
        value: "Experiment title"
    },
    description: {
        value: "Experiment description"
    },
    experimenters: {
        value: [{
            username: "experimenter",
            gravatar: "3b2aea0bec2e4e6588c61eaa1c6e05e0"
        }, {
            username: "assistant"
        }, {
            username: "observer"
        }]
    },
    participants: {
        value: [{
            username: "participant1"
        }]
    }
});