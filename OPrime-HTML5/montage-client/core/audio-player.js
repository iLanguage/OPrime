/**
 * @module core/audio-player
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
	MontageAudio = require("ui/audio.reel").Audio,
	CordovaAudio = require("lib/cordova-bridge").CordovaAudio;

/**
 * @class AudioPlayer
 * @extends Component
 */
exports.AudioPlayer = Component.specialize( /** @lends AudioPlayer# */ {
	constructor: {
		value: function AudioPlayer() {
			this.super();
			console.log(MontageAudio);
			console.log(CordovaAudio.play);
			this.mediaController = new MontageAudio();
		}
	},

	isPlaying: {
		get: function() {
			return this.mediaController.isPlaying;
		}
	},

	isPaused: {
		get: function() {
			return this.mediaController.isPaused;
		}
	},

	isCordova: {
		get: function() {
			try {
				if (!Media) {
					console.log("We are most likely in Cordova, using Cordova instead of HTML5 audio");
				}
				return true;
			} catch (e) {
				console.log("We are most likely not in Cordova, using HTML5 audio");
				return false;
			}
		}
	},

	getDuration: {
		value: function(src) {
			if (src && this.src.indexOf(src) > -1 && this.mediaController.src.indexOf(src) > -1) {
				return this.mediaController.duration || 0;
			} else {
				console.log("Duration wasn't clear, so returning 0");
				return 0;
			}
		}
	},

	_src: {
		value: null
	},

	src: {
		get: function() {
			return this._src;
		},
		set: function(value) {
			if (value && value.trim() && value.trim() === this._src) {
				return;
			}
			console.log("Changed audio source: " + value);
			if (this.isCordova && this.mediaController.library !== "Cordova") {
				this._src = value;
				this.mediaController = CordovaAudio;
			} else {
				if (!value.match(/^[^:]+:\/\//)) {
					this._src = document.location.href.replace(document.location.pathname, "/" + value);
				}
				if (!this.mediaController._audioElement) {
					//Try to use the full path to the audio file if its a relative path 
					if (document.getElementById("audio")) {
						this.mediaController._audioElement = document.getElementById("audio");
					} else {
						var audio = document.createElement("audio");
						audio.setAttribute("id", "audio");
						document.body.appendChild(audio);
						this.mediaController._audioElement = audio;
					}
				}
			}

			this.mediaController.src = this._src;
		}
	},

	play: {
		value: function(optionalSource, optionalDelay) {
			if (optionalSource) {
				this.src = optionalSource;
			}
			if (this.mediaController) {
				this.mediaController.play(this._src, optionalDelay);
			}
		}
	},

	pause: {
		value: function() {
			if (this.mediaController) {
				this.mediaController.pause();
			}
		}
	},

	togglePause: {
		value: function() {
			console.log("togglePause");
			if (this.mediaController) {
				if (this.mediaController.isPaused) {
					console.log("   playing");
					this.mediaController.play();
				} else {
					console.log("   paused");
					this.mediaController.pause();
				}
			}
		}
	},

	stop: {
		value: function() {
			if (this.mediaController) {
				this.mediaController.stop();
			}
		}
	},

	addEvent: {
		value: function(message, startTime, endTime) {
			if (this.mediaController) {
				this.mediaController.addAudioEventAtTimePeriod(message, startTime, endTime);
			}
		}
	}
});
