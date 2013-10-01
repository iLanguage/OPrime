/**
 * @module ui/experiment.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;
var RangeController = require("montage/core/range-controller").RangeController;
var Participant = require("ui/participant.reel").Participant;

/**
 * @class Experiment
 * @extends Component
 */
exports.Experiment = Component.specialize( /** @lends Experiment# */ {
    constructor: {
        value: function Experiment() {
            this.super();
            this.load();
        }
    },

    load: {
        value: function() {
            var participant1 = new Participant();
            participant1.username = "why doesnt any thing show up?";
            console.log("participant1", participant1);
            window.participant1 = participant1;
            this.participantsController = RangeController.create().initWithContent([{
                username: "participant1"
            },{
                username: "participant2"
            }]);
            this.participantsController.add(participant1);
            // this.participantsController.add({
            //     "username": "Adam"
            // });
            // this.participantsController.add({
            //     "username": "Belinda"
            // });
            window.participantsController = this.participantsController;
            console.log("participantsController", this.participantsController);

        }
    },
    participantsController: {
        value: null
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