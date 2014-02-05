/**
 * @module ui/reinforcement.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Reinforcement
 * @extends Component
 */
exports.Reinforcement = Component.specialize( /** @lends Reinforcement# */ {
    constructor: {
        value: function Reinforcement() {
            this.super();
        }
    },

    images: {
        value: ["/assets/stimuli/image/r00_caterpillars.png"]
    },

    currentImage: {
        value: null
    },

    next: {
        value: function() {
            if (!this.images) {
                return;
            }
            if (this.currentImage === null) {
                this.currentImage = 0;
            }
            console.log("next reinforcement" + this.currentImage);
            if (this.images.length > this.currentImage) {
                this.currentImageSrc = this.images[this.currentImage];
            }
            this.currentImage++;
        }
    },

    previous: {
        value: function() {
            if (!this.images) {
                return;
            }
            if (this.currentImage === null) {
                this.currentImage = 0;
            }
            console.log("previous reinforcement" + this.currentImage);
            if (this.currentImage >= 0) {
                this.currentImageSrc = this.images[this.currentImage];
            }
            this.currentImage--;
        }
    },

    showFirst: {
        value: function() {
            this.currentImage = 0;
            this.currentImageSrc = this.firstImageSrc;
        }
    },

    showLast: {
        value: function() {
            if (this.images && this.images.length) {
                this.currentImage = this.images.length - 1;
            }
            this.currentImageSrc = this.lastImageSrc;
        }
    }
});
