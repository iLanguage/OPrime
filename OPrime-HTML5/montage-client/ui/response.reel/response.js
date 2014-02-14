/**
 * @module ui/response.reel
 * @requires core/contextualizable-component
 */
var ContextualizableComponent = require("core/contextualizable-component").ContextualizableComponent;

/**
 * @class Response
 * @extends ContextualizableComponent
 */
exports.Response = ContextualizableComponent.specialize( /** @lends Response# */ {
	constructor: {
		value: function Response() {
			this.super();
		}
	},

	enterDocument: {
		value: function(firstTime) {
			this.super();

			if (firstTime) {
				this.displayAsTouchPoint();
			}
		}
	},

	displayAsTouchPoint: {
		value: function() {
			if (this.displayInline || !this.json) {
				return;
			}
			this._element.style.position = "fixed";
			this._element.style.left = this.json.pageX + "px";
			this._element.style.top = this.json.pageY +"px";
			this._element.style["z-index"] = "200";
			this._element.style["background-color"] = this.colorAsAFunctionOfReactionTime(this.json.reactionTimeAudioOffset);
		}
	},

	colorAsAFunctionOfReactionTime: {
		value: function(reactionTime) {
			if (reactionTime > 555555) {
				return "#ff0000";
			}

			console.log(reactionTime);
			if (reactionTime < 10000 ) {
				return "#" + "00"+ reactionTime;
			}
			if (reactionTime < 100000 ) {
				return "#" + "0"+ reactionTime;
			}
			return "#" + reactionTime;
		}
	}

});
