/**
 * @module ui/four-image-stimulus.reel
 * @requires core/contextualizable-component
 */
var ContextualizableComponent = require("core/contextualizable-component").ContextualizableComponent,
	AbstractStimulus = require("core/abstract-stimulus").AbstractStimulus;

/** dealy audio autoplay 
 * Reference from
 * http://stackoverflow.com/questions/11973673/have-audio-tag-play-after-a-delay
 */

/**
 * @class FourImageStimulus
 * @extends AbstractStimulus
 */
exports.FourImageStimulus = AbstractStimulus.specialize( /** @lends FourImageStimulus# */ {
	constructor: {
		value: function FourImageStimulus() {
			this.super();
			this.confirmResponseChoiceMessage = "Are you sure?";
			// this.primeImage = "http://fc09.deviantart.net/fs71/f/2012/338/2/1/wat__dash_by_reallyunimportant-d5gl3y0.png";
			// this.visualChoiceA = "http://th03.deviantart.net/fs70/PRE/f/2012/274/5/0/da_fuk__applejack_by_reallyunimportant-d5gh1zz.png";
			// this.visualChoiceB = "http://fc06.deviantart.net/fs71/f/2013/076/4/a/_vector___svg__go_home_berry__you_are_sober__by_tritebristle-d5yc4zh.svg";
			// this.visualChoiceC = "http://th06.deviantart.net/fs71/PRE/f/2013/025/6/7/moustache_pinkie_pie_by_silentmatten-d5qfrai.png";
			// this.visualChoiceD = "http://th01.deviantart.net/fs70/PRE/f/2012/291/0/f/annoyed_smart_cookie_by_silentmatten-d5i7448.png";
			// this.audioFile = "http://www.freesound.org/data/previews/210/210107_2973509-lq.mp3";
		}
	},

	assetsPath: {
		value: null
	},

	load: {
		value: function(stimulus) {
			var imagePath = this.imageAssetsPath || "missingpath";
			imagePath += "/";
			var audioPath = this.audioAssetsPath || "missingpath";
			audioPath += "/";

			var visualImages = stimulus.distractorImages.join(":::").split(":::");
			visualImages.push(stimulus.targetImage);
			for (var i = 0; i < visualImages.length; i++) {
				var filename = visualImages[i];
				var imagePosition = filename.split("_")[0] % 4;
				switch (imagePosition) {
					case 1:
						stimulus.visualChoiceA = imagePath + filename;
						break;
					case 2:
						stimulus.visualChoiceB = imagePath + filename;
						break;
					case 3:
						stimulus.visualChoiceC = imagePath + filename;
						break;
					case 0:
						stimulus.visualChoiceD = imagePath + filename;
						break;
					default:
						break;
				}
			}
			stimulus.audioFile = audioPath + stimulus.audioFile;
			stimulus.primeImage = imagePath + stimulus.primeImage;

			this.super(stimulus);
		}
	}
});