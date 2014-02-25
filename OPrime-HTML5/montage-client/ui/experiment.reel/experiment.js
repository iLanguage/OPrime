/**
 * @module ui/experiment.reel
 * @requires core/contextualizable-component
 */
var ContextualizableComponent = require("core/contextualizable-component").ContextualizableComponent,
	Confirm = require("ui/confirm.reel").Confirm,
	RangeController = require("montage/core/range-controller").RangeController,
	PromiseController = require("montage/core/promise-controller").PromiseController,
	Promise = require("montage/core/promise").Promise,
	AudioPlayer = require("core/audio-player").AudioPlayer,
	Database = require("core/data/database");

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
			this.application.audioPlayer = new AudioPlayer();

		}
	},

	iconSrc: {
		value: "../../assets/img/blank.png"
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
			// this.application.audioPlayer.play("assets/gammatone.wav");

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
					message: confirmChoicePrompt
					// okLabel: "OK",
					// cancelLabel: "Annuler"
				};
				Confirm.show(options, function() {
					promiseForConfirm.resolve();
				}, function() {

					// promiseForConfirm.reject("The user clicked cancel.");
					// [Q] Unhandled rejection reasons (should be empty): ["(no stack) The user clicked cancel."] 
					// https://github.com/kriskowal/q/issues/292
					// https://github.com/kriskowal/q/issues/238 TODO seems to be nothing i can do about it...
					console.log("The user clicked cancel.");
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
			if (firstTime) {
				this.currentlyPlaying = false;
				this.experimentDisplayTimeStart = Date.now();

				this.application.addEventListener("changeinterfaceLocale", this);
				this.application.addEventListener("changeCurrentAudience", this);
			}

			this.super(firstTime);
		}
	},

	toggleTutorialArea: {
		value: function() {
			this.tutorialMode = !this.tutorialMode;
			console.log("Show tutorial: " + this.tutorialMode);
		}
	},

	run: {
		value: function() {
			this.currentlyPlaying = true;
			console.log("currentlyPlaying: " + this.currentlyPlaying);

			this.experimentalDesign.jsonType = "experiment";
			this.experimentalDesign.experimentType = this.experimentType;
			this.experimentalDesign.timestamp = Date.now();

			this._currentStimulus = this.templateObjects.currentStimulus;
			this._currentStimulus.imageAssetsPath = this.experimentalDesign.imageAssetsPath;
			this._currentStimulus.audioAssetsPath = this.experimentalDesign.audioAssetsPath;
			// this.templateObjects.currentStimulus.templateObjects.reinforcement = this.templateObjects.reinforcement;
			this.loadTestBlock(0);

			this.templateObjects.tutorial.playInstructions();
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
			this._currentTestBlock.trials[this._currentStimulusIndex].id = this._currentTestBlock.label + "_" + this._currentStimulusIndex;
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
				this.confirm(this.contextualizer.localize(this._currentTestBlock.promptUserBeforeContinuing.text)).then(function() {
					self.nextStimulus();
				}).fail(function(reason) {
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


			this.experimentalDesign.timestamp = Date.now();
			Database.databaseUrl = this.experimentalDesign.database;
			Database.set(this.experimentalDesign.experimentType + this.experimentalDesign.timestamp, this.experimentalDesign);

			this.currentlyPlaying = false;

			this.confirm(this.contextualizer.localize(this.experimentalDesign.end_instructions.for_child)).then(function() {
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
			console.log("resultsReportMode " + this.resultsReportMode);
			if (this.templateObjects.resultReport) {
				this.templateObjects.resultReport.calculateScore();
			}
		}
	},


	pause: {
		value: function() {}
	},

	handleLocaleChange: {
		value: function(now, previous) {
			console.log("handleLocaleChange");
			if (!now || now.length === 0 || !now[0]) {
				return;
			}
			console.log("Locale changed from: " + (previous[0] ? previous[0].label : "nothing") + " -> " + (now[0] ? now[0].label : "nothing"));
		}
	},

	handleChangeinterfaceLocale: {
		value: function() {
			if (this.application && this.application.interfaceLocale) {
				console.log("handleChangeinterfaceLocale", this.application.interfaceLocale);
				this.contextualizer.currentLocale = this.application.interfaceLocale.iso;
				this.needsDraw = true;
				this.setContextualizedText("description");
				this.setContextualizedText("instructions");
				this.setTitle();
			} else {
				console.log("Not setting the experiments contextualizer locale");
			}
		}
	},

	handleChangeCurrentAudience: {
		value: function() {
			this.handleChangeinterfaceLocale();
		}
	},

	getTextFor: {
		value: function(key, audience, dialect) {
			console.log("getTextFor", key, audience, dialect);
			return this[key];
		}
	},

	/*
	TODO change the labelPropertyName to use an FRB contingent on gamify
	*/
	gamify: {
		value: null
	},

	description: {
		value: null
	},
	setContextualizedText: {
		value: function(key) {
			var contextualizedKey = "";
			if (!this.experimentalDesign || !this.experimentalDesign[key]) {
				return key;
			}
			if (this.application && this.application.currentAudience) {
				var context = this.application.currentAudience.key;
				if (this.gamify && this.application.currentAudience.gamifiedKey) {
					context = this.application.currentAudience.gamifiedKey;
				}
				contextualizedKey = this.experimentalDesign[key]["for_" + context];
				console.log("Contextualizing key for " + key);
			}
			if (!contextualizedKey) {
				contextualizedKey = this.experimentalDesign[key]["default"] || "";
			}

			var localized = this.contextualizer.localize(contextualizedKey);
			if (key === "instructions") {
				this.instructionsAudioDetails = this.contextualizer.audio(contextualizedKey);
				this.instructionsAudioDetails.path = this.experimentalDesign.audioAssetsPath;
			}
			this[key] = localized;
			return localized;
		}
	},

	title: {
		value: null
	},
	setTitle: {
		value: function() {
			var title = "";
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
			this.title = localized;
			return localized;
		}
	}
});
