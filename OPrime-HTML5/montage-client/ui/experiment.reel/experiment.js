/**
 * @module ui/experiment.reel
 * @requires core/contextualizable-component
 */
var ContextualizableComponent = require("core/contextualizable-component").ContextualizableComponent,
	Confirm = require("ui/confirm.reel").Confirm,
	PressComposer = require("montage/composer/press-composer").PressComposer,
	RangeController = require("montage/core/range-controller").RangeController,
	PromiseController = require("montage/core/promise-controller").PromiseController,
	Promise = require("montage/core/promise").Promise;

/**
 * @class Experiment
 * @extends ContextualizableComponent
 */
exports.Experiment = ContextualizableComponent.specialize( /** @lends Experiment# */ {

	_currentStimulus: {
		value: null
	},

	_currentTestBlock: {
		value: null
	},

	_currentStimulusIndex: {
		value: null
	},

	_currentTestBlockIndex: {
		value: null
	},

	constructor: {
		value: function Experiment() {
			this.super();
		}
	},

	loadDesign: {
		value: function(designToForceIncludeInMop) {
			if (!this.experimentalDesignSrc) {
				throw "Experimential design source file is undefined, not loading the experiment";
			}
			var self = this;


			// console.log(" Loaded in the experimental Design." + designToForceIncludeInMop);
			// self.experimentalDesign = JSON.parse(designToForceIncludeInMop);
			self.experimentalDesign = designToForceIncludeInMop;

			self.iconSrc = self.experimentalDesign.iconSrc;
			console.log("iconSrc" + self.iconSrc);

			this.gamify = true;
			this.tutorialMode = false;
			this.currentlyPlaying = false;
			this.resultsReportMode = false;

			/* This makes essentially a slideshow of images, useful for debugging and reviewing */
			this.autoPlaySlideshowOfStimuli = false;

			this.audiencesController = RangeController.create().initWithContent(this.audiences);
			this.audiencesController.selection = [];
			this.audiencesController.addRangeAtPathChangeListener(
				"selection", this, "handleAudienceChange");

			this.localesController = RangeController.create().initWithContent([{
				"iso": "en",
				"label": "English",
			}, {
				"iso": "fr",
				"label": "français",
			}, {
				"iso": "iu",
				"label": "ᐃᓄᒃᑎᑐᑦ",
			}]);
			this.localesController.selection = [];
			this.localesController.addRangeAtPathChangeListener(
				"selection", this, "handleLocaleChange");
		}
	},

	draw: {
		value: function() {
			this.super();
			var self = this;
			window.setTimeout(function() {
				/* hack to make the tutorial mode seem like its working */
				if (!self.currentlyPlaying) {
					self.confirm("Do you want to have a tutorial?").then(function() {
						console.log("Showing tutorial mode");
						self.toggleTutorialArea();
					}, function(reason) {
						console.log("Not showing tutorial");
					});
				}
			}, 30000);
		}
	},
	/**
	 *  Shows a dialog box with the message, returns a promise which will resolve
	 *  if the user gives a positive repsonse, and reject if the user gives a negative response
	 *
	 *
	 * @param {String} confirmChoicePrompt A message to be shown to the user
	 * @type {Promise}
	 */
	confirm: {
		value: function(confirmChoicePrompt) {
			var promiseForConfirm = Promise.defer();
			if (confirmChoicePrompt) {
				var options = {
					iconSrc: this.iconSrc,
					message: confirmChoicePrompt,
					okLabel: "Yes",
					cancelLabel: "No"
				};
				Confirm.show(options, function() {
					promiseForConfirm.resolve();
				}, function() {
					promiseForConfirm.reject(new Error("The x prevented the cancel?"));
				});
			} else {
				Promise.nextTick(function() {
					promiseForConfirm.resolve();
				});
			}
			return promiseForConfirm.promise;
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
				this.setupFirstDisplay();
				// this.addOwnPropertyChangeListener("src", this);
			}
			this.experimentDisplayTimeStart = Date.now();
		}
	},

	handlePress: {
		value: function(e) {
			console.log("The experiment has been pressed: ");
			if (e.targetElement.dataset.montageId === "playGame") {
				this.run();
			}

			/* if the user touches the screen, stop slideshow */
			this.autoPlaySlideshowOfStimuli = false;
		}
	},

	prepareForActivationEvents: {
		value: function() {
			this._pressComposer.addEventListener("pressStart", this, false);
			this._pressComposer.addEventListener("press", this, false);
			this._pressComposer.addEventListener("pressCancel", this, false);
		}
	},

	setupFirstDisplay: {
		value: function() {
			this.element.removeEventListener("touchstart", this, false);
			this.element.removeEventListener("mousedown", this, false);
			// this._firstPlay = true;
			// this.videoController.stop();

			// this.classList.add("digit-Video--firstPlay");
			// this.classList.remove("digit-Video--showControls");

			this._pressComposer = PressComposer.create();
			this._pressComposer.identifier = "experiment";
			/* TODO try to make this listen to only what needs a press composer? */
			this.addComposerForElement(this._pressComposer, this.element);
			this.showPlayButton();
		}
	},

	showPlayButton: {
		value: function() {
			this.templateObjects.playGame.element.hidden = false;
			/*TODO the conditions dont seem to have any connection to hiding and showing their elements 
			this is a brute force hack to make them not show. */
			this.templateObjects.showGameCondition.element.hidden = true;
			this.templateObjects.showResultReportCondition.element.hidden = true;
			this.templateObjects.showGameDetailsCondition.element.hidden = true;
		}
	},

	toggleTutorialArea: {
		value: function() {
			this.showTutorial = !this.showTutorial;
			this.templateObjects.showGameDetailsCondition.element.hidden = !this.showTutorial;
			console.log("Show tutorial:" + this.showTutorial);
		}
	},

	run: {
		value: function() {
			this.currentlyPlaying = true;
			this.templateObjects.showGameCondition.element.hidden = false;
			this.templateObjects.playGame.element.hidden = true;
			this.templateObjects.showResultReportCondition.element.hidden = true;
			this._currentStimulus = this.templateObjects.currentStimulus;
			this._currentStimulus.imageAssetsPath = this.experimentalDesign.imageAssetsPath;
			this._currentStimulus.audioAssetsPath = this.experimentalDesign.audioAssetsPath;
			// this.templateObjects.currentStimulus.templateObjects.reinforcement = this.templateObjects.reinforcement;
			this.loadTestBlock(0);
		}
	},


	autoPlaySlideshowOfStimuli: {
		value: null
	},

	/**
	 * 
	 *
	 * var example = {
			"auditoryStimulus": "practice_1_auditory_stimuli",
			"audioFile": "1.wav",
			"primeImage": "animal1.png",
			"targetImage": "practice1.png",
			"distractorImages": ["distractor1.png", "distractor2.png", "distractor3.png"],
			"response": {
				"reactionTimeAudioOffset": -234,
				"reactionTimeAudioOnset": 123,
				"x": 43,
				"y": 23
			}
		}
	 */
	nextStimulus: {
		value: function() {
			var self = this;

			if (!this._currentTestBlock || !this._currentTestBlock.trials || !this._currentTestBlock.trials.length) {
				console.warn("Something is wrong, there are no stimuli so I can't go to the next. ");
				return;
			}
			if (this._currentStimulusIndex >= this._currentTestBlock.trials.length - 1) {
				this.templateObjects.reinforcement.showLast();
				this.loadTestBlock(this._currentTestBlockIndex + 1);
				return;
			}

			this._currentStimulusIndex++;
			console.log("Showing stimulus " + this._currentStimulusIndex + " of block " + this._currentTestBlockIndex);

			if (!this._currentTestBlock.trials[this._currentStimulusIndex]) {
				console.warn("Something is wrong, there was no stimulus.");
				return;
			}

			this.templateObjects.reinforcement.next();
			this._currentTestBlock.trials[this._currentStimulusIndex].id = this._currentTestBlock.label + this._currentStimulusIndex;
			this._currentStimulus.load(this._currentTestBlock.trials[this._currentStimulusIndex]);

			if (this.autoPlaySlideshowOfStimuli) {
				window.setTimeout(function() {
					console.log("Slideshow play...");
					self.nextStimulus();
				}, 5000);
			}
		}
	},

	previousStimulus: {
		value: function() {

			if (!this._currentTestBlock || !this._currentTestBlock.trials || !this._currentTestBlock.trials.length) {
				console.warn("Something is wrong, there are no stimuli so I can't go to the next. ");
				return;
			}
			if (this._currentStimulusIndex > 0) {
				this.loadTestBlock(this._currentTestBlockIndex - 1);
				return;
			}

			this._currentStimulusIndex--;
			console.log("Showing stimulus " + this._currentStimulusIndex + " of block " + this._currentTestBlockIndex);

			this.templateObjects.reinforcement.previous();
			this._currentStimulus.load(this._currentTestBlock.trials[this._currentStimulusIndex]);
		}
	},

	loadTestBlock: {
		value: function(blockIndexToLoad) {

			if (!this.experimentalDesign || !this.experimentalDesign.subexperiments || blockIndexToLoad === undefined) {
				console.warn("Something is wrong, there are no subexperiments so I can't go to the next. ");
				return;
			}
			if (blockIndexToLoad < 0) {
				this.confirm("At the beginning!").then(function() {
					console.log("Doing nothing");
				}, function(reason) {
					console.log("Doing nothing");
				});
				return;
			}
			if (blockIndexToLoad >= this.experimentalDesign.subexperiments.length) {
				this.experimentCompleted();
				return;
			}
			if (!this.experimentalDesign.subexperiments[blockIndexToLoad]) {
				console.warn("Something is wrong, there are no test bock so I can't go to the next. ");
				return;
			}

			this._currentTestBlockIndex = blockIndexToLoad;
			this._currentTestBlock = this.experimentalDesign.subexperiments[blockIndexToLoad];
			console.log("Loaded block " + blockIndexToLoad);
			this.experimentBlockLoaded();
		}
	},

	/**
	 * By default when an experiment block is loaded,
	 * it prompts the user if they are ready,
	 * and then shows the first stimulus.
	 *
	 * This can be customized by experiements by overriding the experimentBlockLoaded function.
	 */
	experimentBlockLoaded: {
		value: function() {
			var self = this;

			this._currentStimulusIndex = -1;
			this.templateObjects.reinforcement.showFirst();
			if (this._currentTestBlock.promptUserBeforeContinuing) {
				this.confirm(this._currentTestBlock.promptUserBeforeContinuing.text).then(function() {
					self.nextStimulus();
				}, function(reason) {
					console.log("TODO add a button for resume?");
				});
			} else {
				this.nextStimulus();
			}
		}
	},

	experimentCompleted: {
		value: function() {
			var self = this;

			this.confirm(this.experimentalDesign.end_instructions.for_child).then(function() {
				console.log("Experiment is complete.");
				self.showResultReport();
			}, function(reason) {
				console.log("TODO add a button for resume?");
			});
		}
	},

	showResultReport: {
		value: function() {
			this.resultsReportMode = !this.resultsReportMode;
			if (this.resultsReportMode) {
				var duration = 2000;
				// this.templateObjects.showGameCondition.element.style["-webkit-animation"] = "Introduce-target-image "+duration+"s";
				// this.templateObjects.showGameCondition.element.hidden = true; // TODO add a class list to reduce its size, but still keep it :)
				// this.templateObjects.playGame.element.hidden = true;
				this.templateObjects.showResultReportCondition.element.hidden = false;
			} else {
				// this.templateObjects.showGameCondition.element.style["-webkit-animation"] = "";
				// this.templateObjects.showGameCondition.element.hidden = false; // TODO add a class list to reduce its size, but still keep it :)
				// this.templateObjects.playGame.element.hidden = true;
				this.templateObjects.showResultReportCondition.element.hidden = true;
			}

		}
	},

	calculateScore: {
		value: function() {
			return "10/10";
		}
	},


	pause: {
		value: function() {}
	},

	/* Using an object and a select: http://montagejs.github.io/mfiddle/#!/7884716 */
	_targetAudience: {
		value: null
	},
	targetAudience: {
		get: function() {
			return this._targetAudience;
		},
		set: function(value) {
			if (this._targetAudience === value) {
				return;
			}
			this._targetAudience = value;
			this.needsDraw = true;
		}
	},
	audiences: {
		value: [{
			"gameLabel": "Child",
			"experimentLabel": "Participant",
			"key": "participant"
		}, {
			"gameLabel": "Teacher",
			"experimentLabel": "Administrator",
			"key": "experimentAdministrator"
		}, {
			"gameLabel": "Parent",
			"experimentLabel": "Parent",
			"key": "parent"
		}, {
			"gameLabel": "SLP",
			"experimentLabel": "Administrator",
			"key": "experimentAdministratorSpecialist"
		}, {
			"gameLabel": "School Records",
			"experimentLabel": "Report",
			"key": "report"
		}, {
			"gameLabel": "Default",
			"experimentLabel": "Default",
			"key": "default"
		}]
	},
	/**
	 *
	 * References:
	 * https://github.com/montagejs/montage/pull/1103
	 *
	 * @type {Object}
	 */
	handleAudienceChange: {
		value: function(now, previous) {
			if (!now || now.length === 0 || !now[0]) {
				return;
			}
			var label = this.gamify ? "gameLabel" : "experimentLabel";
			console.log("Audience changed from: " + (previous[0] ? previous[0][label] : "nothing") + " -> " + (now[0] ? now[0][label] : "nothing"));
			this.targetAudience = now[0].key;
			/*cause the title and description to change based on the audience. */
			console.log(this.description);
			console.log(this.title);
		}
	},

	handleLocaleChange: {
		value: function(now, previous) {
			if (!now || now.length === 0 || !now[0]) {
				return;
			}
			console.log("Locale changed from: " + (previous[0] ? previous[0].label : "nothing") + " -> " + (now[0] ? now[0].label : "nothing"));
		}
	},
	/*
	TODO change the labelPropertyName to use an FRB contingent on gamify
	*/
	gamify: {
		value: null
	},

	_description: {
		value: null
	},
	description: {
		get: function() {
			var description = this._description || "";
			if (!this.experimentalDesign || !this.experimentalDesign.description) {
				return description;
			}
			if (this.targetAudience) {
				description = this.experimentalDesign.description["for_" + this.targetAudience];
			}
			if (!description) {
				description = this.experimentalDesign.description["default"] || "";
			}
			var localized = this.contextualizer.localize(description);
			return localized;
		},
		set: function(value) {
			if (this._description === value) {
				return;
			}
			this._description = value;
		}
	},

	_title: {
		value: null
	},
	title: {
		get: function() {
			var title = this._title || "";
			if (!this.experimentalDesign || !this.experimentalDesign.title) {
				return title;
			}
			if (this.gamify) {
				title = this.experimentalDesign.title["gamified_title"] || ""; //jshint ignore:line
			}
			if (!title) {
				title = this.experimentalDesign.title["default"] || "";
			}
			var localized = this.contextualizer.localize(title);
			return localized;
		},
		set: function(value) {
			if (this._title === value) {
				return;
			}
			this._title = value;
		}
	},

	handleAction: {
		value: function(e) {
			console.log("handleAction has been triggered: ", e);

		}
	}
});
