/**
 * @module ui/four-image-stimulus.reel
 * @requires core/contextualizable-component
 */
var ContextualizableComponent = require("core/contextualizable-component").ContextualizableComponent,
	AbstractStimulus = require("core/abstract-stimulus").AbstractStimulus;


/**
 * @class TdfpStimulus
 * @extends AbstractStimulus
 */
exports.TdfpStimulus = AbstractStimulus.specialize(/** @lends TdfpStimulus# */ {
    constructor: {
        value: function TdfpStimulus() {
            this.super();
			this.confirmResponseChoiceMessage = "Es tu sûr?";
			this.primeImage = "";
			this.audioFile = "";

        }
    },

    load: {
		value: function(stimulus) {
			var imagePath = this.imageAssetsPath || "missingpath";
			imagePath += "/";
			
			var audioPath = this.audioAssetsPath || "missingpath";
			audioPath += "/";

			stimulus.audioFile = audioPath + stimulus.audioFile;
			stimulus.primeImage = imagePath + stimulus.primeImage;
			this.super(stimulus);

		}
			


			
	},


	spontaneousQuestion1: {
		value: function() {
			console.log("Button 1 is pressed ");

			var audioPath = this.audioAssetsPath || "missingpath";
			audioPath += "/";
			this.audioFile = audioPath+"TCPP_Paul3.mp3";
			this.audioElement.src = this.audioFile;
			this.playAudio();
			this.canPlayButton2 = true;

		}
	},


	spontaneousQuestion2: {
		value: function() {
			console.log("Button 2 is pressed ");

			var audioPath = this.audioAssetsPath || "missingpath";
			audioPath += "/";
			this.audioFile = audioPath+"TCPP_Lou3.mp3";
			this.audioElement.src = this.audioFile;

			this.playAudio();

		}
	},

	delayedImitation: {
		value: function() {
			console.log(" Button 3 is pressed ");

			var audioPath = this.audioAssetsPath || "missingpath";
			audioPath += "/";
			this.audioFile = audioPath+"TCPP_Lucas3.mp3";
			this.audioElement.src = this.audioFile;

			this.playAudio();

		}
	},

	immediateImitation: {
		value: function() {
			console.log(" Button 4 is pressed ");

			var audioPath = this.audioAssetsPath || "missingpath";
			audioPath += "/";
			this.audioFile = audioPath+"TCPP_Guy3.mp3";
			this.audioElement.src = this.audioFile;

			this.playAudio();

		}
	},




});
