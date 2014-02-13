/**
 * @module ui/audio.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Audio
 * @extends Component
 */
exports.Audio = Component.specialize( /** @lends Audio# */ {
	constructor: {
		value: function Audio() {
			this.super();
		}
	},

	_src: {
		value: null
	},

	/**
	 * @type {string}
	 * @default null
	 */
	src: {
		get: function() {
			return this._src;
		},
		set: function(value) {
			if (value && value.trim() && value.trim() === this._src) {
				return;
			}
			this._src = value;
			console.log("Changed audio source" + value);
		}
	},

	enterDocument: {
		value: function(firstTime) {
			this.super(firstTime);

			if (firstTime) {
				this.addOwnPropertyChangeListener("src", this);
				this._audioElement = this.templateObjects.owner.element;
				this._audioElement.src = this.src;
				this.addAudioEventAtTimePeriod();
			}
		}
	},

	handleSrcChange: {
		value: function(oldValue, newValue) {
			console.log("Handle audio source change ", oldValue, newValue);
		}
	},

	_audioElement: {
		value: null
	},

	play: {
		value: function(optionalSource, delay) {
			if (optionalSource) {
				this.src = optionalSource;
			}
			if (this._audioElement) {
				if (!this._audioElement.src || this._audioElement.src !== this.src) {
					this._audioElement.src = this.src;
				}

				var self = this,
					startTime = Date.now(),
					audioElementToPlay = this._audioElement;

				audioElementToPlay.removeEventListener('ended', window.audioEndListener);
				audioElementToPlay.removeEventListener('canplaythrough', window.actuallyPlayAudio);

				var audiourl = audioElementToPlay.src;
				window.audioEndListener = function() {
					audioElementToPlay.removeEventListener('ended', window.audioEndListener);
					console.log("audiourl is done " + audiourl);
				};

				window.actuallyPlayAudio = function() {
					audioElementToPlay.removeEventListener('canplaythrough', window.actuallyPlayAudio);

					if (!delay) {
						self._audioElement.play();
						self.audioPlayStarted = Date.now();
					} else {
						var timeToPrepareAudio = Date.now() - startTime;
						var newDelay = delay - timeToPrepareAudio;
						if (newDelay > 0) {
							window.setTimeout(function() {
								self._audioElement.play();
								self.audioPlayStarted = Date.now();
							}, newDelay);
						} else {
							console.warn("Audio was " + newDelay + " late.");
							self._audioElement.play();
							self.audioPlayStarted = Date.now();
						}
					}
				};
				console.log("Requested play of audio file " + audioElementToPlay.src);
				audioElementToPlay.addEventListener('ended', window.audioEndListener);
				audioElementToPlay.addEventListener('canplaythrough', window.actuallyPlayAudio);

			}
		}
	},

	pause: {
		value: function() {
			if (this._audioElement) {
				this._audioElement.pause();
			}
		}
	},

	stop: {
		value: function() {
			if (this._audioElement) {
				this._audioElement.pause();
				// this._audioElement.currentTime = 0;
			}
		}
	},

	audioEvents: {
		value: []
	},

	audioTimeUpdateFunction: {
		value: function() {
			console.log(this.currentTime);
			if (!this.audioEvents) {
				return;
			}
			for (var i = 0; i < this.audioEvents.length; i++) {
				if (this.currentTime > this.audioEvents[i].startTime - 0.15 && this.currentTime < this.audioEvents[i].endTime) {
					this.audioEvents[i].whatShouldHappen.call();
				}
			}
		}
	},

	addAudioEventAtTimePeriod: {
		value: function(whatShouldHappen, startTime, endTime) {
			if (this._audioElement) {
				this._audioElement.removeEventListener("timeupdate", this.audioTimeUpdateFunction);
			}

			if (!endTime) {
				endTime = startTime + 1000;
			}
			this.audioEvents.push({
				startTime: startTime,
				endTime: endTime,
				whatShouldHappen: whatShouldHappen
			});

			if (this._audioElement) {
				this._audioElement.addEventListener("timeupdate", this.audioTimeUpdateFunction);
			}
		}
	}
});
