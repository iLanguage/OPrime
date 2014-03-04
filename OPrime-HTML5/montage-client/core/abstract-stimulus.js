/**
 * @module ui/stimulus.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
	Confirm = require("ui/confirm.reel").Confirm,
	Response = require("ui/response.reel").Response,
	PressComposer = require("montage/composer/press-composer").PressComposer,
	RangeController = require("montage/core/range-controller").RangeController,
	Promise = require("montage/core/promise").Promise;

/**
 * @class Stimulus
 * @extends Component
 */
exports.AbstractStimulus = Component.specialize( /** @lends Stimulus# */ {
	constructor: {
		value: function Stimulus() {
			this.super();
			this.responses = [];

		}
	},

	currentReinforcementImageSrc: {
		value: "../../assets/img/blank.png"
	},

	/**
	 *  dont draw automatically refs: http://montagejs.github.io/mfiddle/#!/7932746
	 * @type {Object}
	 */
	// willDraw: {
	//        value: function() {
	//			console.log("Stimulus does not draw automatically, instead it is drawn in steps by its child classes.");
	//        }
	//    },

	responsesController: {
		value: null
	},

	responses: {
		value: null
	},
	pauseAudioWhenConfirmingResponse: {
		value: null
	},
	addResponse: {
		value: function(responseEvent, stimulusId) {
			if (!responseEvent) {
				throw "Cannot add response without the x y information found in the touch/click responseEvent";
			}

			var reactionTimeEnd = Date.now();
			var audioDuration = this.application.audioPlayer.getDuration(this.audioFile) || 0;
			if (audioDuration) {
				audioDuration = audioDuration * 1000;
			} else {
				console.log("The audio has no duration.. This is strange.");
			}
			if (this.pauseAudioWhenConfirmingResponse) {
				this.pauseAudio();
			}

			var self = this;
			var continueToNextStimulus = Promise.defer();
			if (this.confirmResponseChoiceMessage) {
				this.application.contextualizer.currentLocale = this.application.interfaceLocale.iso;
				var confirmChoicePrompt = this.application.contextualizer.localize(this.confirmResponseChoiceMessage); 
				var options = {
					iconSrc: self.ownerComponent.iconSrc,
					message: confirmChoicePrompt
				};
				Confirm.show(options, function() {
					continueToNextStimulus.resolve();
				}, function() {
					continueToNextStimulus.reject(new Error("The x prevented the cancel?"));
				});
			} else {
				continueToNextStimulus.resolve();
			}
			continueToNextStimulus.promise.then(function() {
				// self.ownerComponent.templateObjects.reinforcement.next();
				self.stopAudio();
				self.ownerComponent.nextStimulus();
			}, function(reason) {
				console.log("Not continuing to next stimulus");
				if (this.pauseAudioWhenConfirmingResponse) {
					self.playAudio();
				}
			});
			var choice = "";
			if (stimulusId) {
				choice = this[stimulusId].substring(this[stimulusId].lastIndexOf("/") + 1).replace(/\..+$/, "").replace(/\d+_/, "");
				if (choice === this.target.orthographic) {
					choice = this.target;
				} else {
					this.distractors.map(function(distractor) {
						if (choice === distractor.orthographic) {
							choice = distractor;
						}
					});
				}
			}
			var response = {
				"reactionTimeAudioOffset": reactionTimeEnd - this.reactionTimeStart - audioDuration,
				"reactionTimeAudioOnset": reactionTimeEnd - this.reactionTimeStart,
				"x": responseEvent.x,
				"y": responseEvent.y,
				"pageX": responseEvent.pageX,
				"pageY": responseEvent.pageY,
				// "prime": {
				// 	phonemic: this.prime.phonemic,
				// 	orthographic: this.prime.orthographic,
				// 	imageFile: this.prime.imageFile
				// },
				"choice": choice,
				// "target": this.target,
				"score": this.scoreResponse(this.target, choice)
			};
			this.responses.push(response);
			console.log("Recorded response", JSON.stringify(response));
		}
	},

	addOralResponse: {
		value: function(choice, dontAutoAdvance) {
			var reactionTimeEnd = Date.now();
			var audioDuration = this.application.audioPlayer.getDuration(this.audioFile) || 0;
			if (audioDuration) {
				audioDuration = audioDuration * 1000;
			} else {
				console.log("The audio has no duration.. This is strange.");
			}
			if (this.pauseAudioWhenConfirmingResponse) {
				this.pauseAudio();
			}

			var self = this;
			var continueToNextStimulus = Promise.defer();
			if (this.confirmResponseChoiceMessage) {
				this.application.contextualizer.currentLocale = this.application.interfaceLocale.iso;
				var confirmChoicePrompt = this.application.contextualizer.localize(this.confirmResponseChoiceMessage); 
				var options = {
					iconSrc: self.ownerComponent.iconSrc,
					message: confirmChoicePrompt
				};
				Confirm.show(options, function() {
					continueToNextStimulus.resolve();
				}, function() {
					continueToNextStimulus.reject(new Error("The x prevented the cancel?"));
				});
			} else {
				if(!dontAutoAdvance){
					continueToNextStimulus.resolve();
				}
			}
			continueToNextStimulus.promise.then(function() {
				// self.ownerComponent.templateObjects.reinforcement.next();
				self.stopAudio();
				self.ownerComponent.nextStimulus();
			}, function(reason) {
				console.log("Not continuing to next stimulus");
				if (this.pauseAudioWhenConfirmingResponse) {
					self.playAudio();
				}
			});
			
			var response = {
				"reactionTimeAudioOffset": reactionTimeEnd - this.reactionTimeStart - audioDuration,
				"reactionTimeAudioOnset": reactionTimeEnd - this.reactionTimeStart,
				"x": 0,
				"y": 0,
				"pageX": 0,
				"pageY": 0,
				"choice": choice,
				"score": choice.score
			};
			this.responses = this.responses || [];
			this.responses.push(response);
			console.log("Recorded response", JSON.stringify(response));
		}
	},

	scoreResponse: {
		value: function(expectedResponse, actualResponse) {
			if (!actualResponse.orthographic) {
				return "error";
			}
			if (actualResponse.orthographic === expectedResponse.orthographic) {
				return 1;
			} else {
				return 0;
			}
		}
	},

	addNonResponse: {
		value: function(responseEvent) {
			if (!responseEvent) {
				throw "Cannot add response without the x y information found in the touch/click responseEvent";
			}
			var reactionTimeEnd = Date.now();
			var response = {
				"reactionTimeAudioOffset": reactionTimeEnd - this.reactionTimeStart,
				"reactionTimeAudioOnset": reactionTimeEnd - this.reactionTimeStart,
				"x": responseEvent.x,
				"y": responseEvent.y,
				"pageX": responseEvent.pageX,
				"pageY": responseEvent.pageY,
				"chosenVisualStimulus": "none",
				"responseScore": -1
			};
			this.responses = this.responses || [];
			this.nonResponses.push(response);
			console.log("Recorded non-response, the user is confused or not playing the game.", JSON.stringify(response));
		}
	},

	/*
	 * Machinery for Recording stimuli responses.
	 *
	 * Inspired by the digit video reel:
	 * https://github.com/montagejs/digit/tree/master/ui/video.reel
	 */
	enterDocument: {
		value: function(firstTime) {
			this.super();

			if (firstTime) {
				this.setupFirstPlay();
				this.addOwnPropertyChangeListener("src", this);
			}
			this.reactionTimeStart = Date.now();
		}
	},

	handlePress: {
		value: function(touchEvent) {
			// console.log("event " + JSON.stringify(touchEvent.event));
			// console.log("targetElement " + JSON.stringify(touchEvent.targetElement));
			console.log("The stimulus has been pressed: ");
			if (touchEvent && touchEvent.targetElement && touchEvent.targetElement.dataset && touchEvent.targetElement.dataset.montageId && touchEvent.targetElement.classList.contains("Stimulus-record-touch-response")) {
				this.addResponse(touchEvent.event, touchEvent.targetElement.dataset.montageId);
			} else {
				this.addNonResponse(touchEvent.event);
			}
		}
	},

	handleAction: {
		value: function(touchEvent) {
			console.log("The stimulus has been actioned: ");
			this.handlePress(touchEvent);
		}
	},

	handleTouchup: {
		value: function(touchEvent) {
			console.log("The stimulus has been touchuped: ");
			this.handlePress(touchEvent);
		}
	},

	handlePressStart: {
		value: function(touchEvent) {
			console.log("The stimulus has been pressStarted: ");
		}
	},

	handleLongAction: {
		value: function(touchEvent) {
			console.log("The stimulus has been longActioned: ");
		}
	},

	handleLongPress: {
		value: function(touchEvent) {
			console.log("The stimulus has been handleLongPress: ");
			this.handlePress(touchEvent);
		}
	},

	prepareForActivationEvents: {
		value: function() {
			// this._pressComposer.addEventListener("pressStart", this, false);
			this._pressComposer.addEventListener("press", this, false);
			this._pressComposer.addEventListener("touchup", this, false);
			this._pressComposer.addEventListener("action", this, false);
			this._pressComposer.addEventListener("longAction", this, false);
			this._pressComposer.addEventListener("longPress", this, false);
			// this._pressComposer.addEventListener("pressCancel", this, false);
		}
	},

	setupFirstPlay: {
		value: function() {
			// this.element.removeEventListener("touchstart", this, false);
			// this.element.removeEventListener("mousedown", this, false);

			this._pressComposer = PressComposer.create();
			this._pressComposer.identifier = "stimulus";
			this.addComposerForElement(this._pressComposer, this.element);
		}
	},

	/**
	 *  TODO try using a media controller later montage/ui/controller/media-controller
	 * @type {Object}
	 */
	playAudio: {
		value: function(delay) {
			this.application.audioPlayer.play(this.audioFile, delay);
		}
	},

	pauseAudio: {
		value: function() {
			this.application.audioPlayer.pause(this.audioFile);
		}
	},

	stopAudio: {
		value: function() {
			this.application.audioPlayer.stop(this.audioFile);
		}
	},

	load: {
		value: function(details) {
			for (var d in details) {
				if (details.hasOwnProperty(d)) {
					this[d] = details[d];
				}
			}
			if (this.responses === null) {
				this.responses = [];
			}
			if (this.nonResponses === null) {
				this.nonResponses = [];
			}
			this.nonResponses = [];
			this.responsesController = new RangeController().initWithContent(this.responses);

			// Not playing audio by default, child must call it.
			// this.playAudio(2000);
		}
	}
});
