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
            // this.endAudioEvents = [];
            // this.audioEvents = [];
        }
    },

    matchesSource: {
        value: function(value) {
            return this._src.indexOf(value) > -1;
        }
    },

    enterDocument: {
        value: function(firstTime) {
            this.super(firstTime);

            if (firstTime) {
                this.addOwnPropertyChangeListener("src", this);
                this._audioElement = this.templateObjects.owner.element;
                this._audioElement.src = this.src;
                // this.addAudioEventAtTimePeriod();
            }
        }
    },

    handleSrcChange: {
        value: function(oldValue, newValue) {
            console.log("Handle audio source change ", oldValue, newValue);
        }
    },

    duration: {
        get: function() {
            if (this._audioElement && this._audioElement.duration) {
                return this._audioElement.duration;
            } else {
                return 0;
            }
        }
    },

    _audioElement: {
        value: null
    },

    isPlaying: {
        value: null
    },

    isPaused: {
        value: null
    },

    play: {
        value: function(optionalSource, delay) {
            if (optionalSource) {
                this.src = optionalSource;
            }
            console.log("Requested play of audio file " + optionalSource);

            if (this._audioElement) {
                if(this._audioElement.src === this.src && this.isPaused){
                    this._audioElement.play();
                    this.isPaused = false;
                    this.isPlaying = true;
                    return;
                }
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
                    self.isPlaying = false;
                    self.isPaused = false;
                    for (var i = 0; i < self.endAudioEvents.length; i++) {
                        // self.endAudioEvents[i].whatShouldHappen.call();
                        var eventName = self.endAudioEvents[i].whatShouldHappen;
                        if (self.matchesSource(self.endAudioEvents[i].audioFile)) {
                            console.log("Dispatching " + eventName);
                            self.application.dispatchEventNamed(eventName, true, false);
                        }
                    }
                };

                window.actuallyPlayAudio = function() {
                    audioElementToPlay.removeEventListener('canplaythrough', window.actuallyPlayAudio);

                    if (!delay) {
                        self._audioElement.play();
                        self.isPlaying = true;
                        self.isPaused = false;
                        self.audioPlayStarted = Date.now();
                    } else {
                        var timeToPrepareAudio = Date.now() - startTime;
                        var newDelay = delay - timeToPrepareAudio;
                        if (newDelay > 0) {
                            window.setTimeout(function() {
                                self._audioElement.play();
                                self.isPlaying = true;
                                self.isPaused = false;
                                self.audioPlayStarted = Date.now();
                            }, newDelay);
                        } else {
                            console.warn("Audio was " + newDelay + " late.");
                            self._audioElement.play();
                            self.isPlaying = true;
                            self.isPaused = false;
                            self.audioPlayStarted = Date.now();
                        }
                    }
                };
                console.log("Requested play of audio file " + audioElementToPlay.src);
                audioElementToPlay.addEventListener('ended', window.audioEndListener);
                audioElementToPlay.addEventListener('canplaythrough', window.actuallyPlayAudio);

            } else {
                console.warn("there was no audio element to play");
            }
        }
    },

    pause: {
        value: function() {
            if (this._audioElement) {
                this._audioElement.pause();
                this.isPaused = true;
            }
        }
    },

    stop: {
        value: function() {
            if (this._audioElement) {
                this._audioElement.pause();
                this._audioElement.currentTime = 0;
            }
        }
    },

    audioEvents: {
        value: []
    },
    endAudioEvents: {
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
            var audioFile = whatShouldHappen.substring(whatShouldHappen.indexOf(":::")).replace(":::", "");
            whatShouldHappen = whatShouldHappen.replace(":::" + audioFile, "");
            if (startTime === "end") {
                this.endAudioEvents.push({
                    whatShouldHappen: whatShouldHappen,
                    audioFile: audioFile
                });
            } else {
                this.audioEvents.push({
                    startTime: startTime,
                    endTime: endTime,
                    whatShouldHappen: whatShouldHappen,
                    audioFile: audioFile
                });
            }

            if (this._audioElement) {
                this._audioElement.addEventListener("timeupdate", this.audioTimeUpdateFunction);
            }
        }
    }
});
