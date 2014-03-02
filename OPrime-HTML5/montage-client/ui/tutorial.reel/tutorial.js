/**
 * @module ui/tutorial.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Tutorial
 * @extends Component
 */
exports.Tutorial = Component.specialize( /** @lends Tutorial# */ {
	constructor: {
		value: function Tutorial() {
			this.super();
		}
	},

	playInstructions: {
		value: function() {
			this.playAudioOnLoad = false;
			if (this.audio && this.audio.delay >= 0 && this.audio.audioFiles) {
				this.playAudioOnLoad = true;
				this.currentAudioFile = -1;
				this.application.addEventListener("playInstructionsAudioFile", this);
				// Play the first audio
				this.handlePlayInstructionsAudioFile();
			} else {
				console.log("Not auto playing instructions");
			}
		}
	},

	handlePlayInstructionsAudioFile: {
		value: function() {
			if (!this.playAudioOnLoad) {
				return;
			}
			if (this.currentAudioFile >= this.audio.audioFiles.length -1) {
				return;
			}
			this.currentAudioFile++;
			var audioFilePath = this.audio.path + "/" + this.audio.audioFiles[this.currentAudioFile];
			this.application.audioPlayer.addEvent("playInstructionsAudioFile:::" + this.audio.audioFiles[this.currentAudioFile], "end");

			console.log("Play instructions audio " + this.currentAudioFile, audioFilePath);
			this.application.audioPlayer.play(audioFilePath);

		}
	},

	handleInstructionsAudioFileAction: {
		value: function(evt) {
			var audioFilePath = this.audio.path + "/" + evt.target.filename;
			console.log("Play instructions audio", audioFilePath);
			this.application.audioPlayer.play(audioFilePath);

		}
	}
});
