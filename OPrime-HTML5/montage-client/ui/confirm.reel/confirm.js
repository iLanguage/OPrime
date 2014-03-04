/**
    @module "matte/ui/popup/confirm.reel"
*/

var Component = require("montage/ui/component").Component,
    Popup = require("matte/ui/popup/popup.reel").Popup;

/**
 @class module:"matte/ui/popup/confirm.reel".Confirm
 @extends module:montage/ui/component.Component
 */

var Confirm = exports.Confirm = Component.specialize( /** @lends module:"matte/ui/popup/confirm.reel".Confirm# */ {
    hasTemplate: {
        value: true
    },

    title: {
        value: 'Confirm'
    },
    /**
        Text of message to display on the confirm popup
        @type {Property}
        @default {String} 'Are you sure?'
    */
    msg: {
        value: 'Are you sure?'
    },

    /**
        Text to display on the OK button
        @type {Property}
        @default {String} 'OK'
    */
    okLabel: {
        value: 'OK'
    },

    /**
        Text to display on the Cancel button
        @type {Property}
        @default {String} 'Cancel'
    */
    cancelLabel: {
        value: 'Cancel'
    },

    /**
  Description TODO
  @private
*/
    _popup: {
        value: null
    },


    okCallback: {
        value: null
    },
    cancelCallback: {
        value: null
    },

    enterDocument: {
        value: function(firstTime) {
            if (firstTime) {
                this.element.addEventListener("keyup", this, false);
            }
        }
    },
    /**
    Description TODO
    @function
    */
    draw: {
        value: function() {}
    },
    /**
    Description TODO
    @function
    @param {Event} evt The event keyCode.
    */
    handleKeyup: {
        value: function(evt) {
            if (evt.keyCode === 13 /*Enter*/ ) {
                this.handleOkAction(evt);
            } else if (evt.keyCode === 27 /*Escape*/ ) {
                this.handleCancelAction(evt);
            }
        }
    },
    /**
    Description TODO
    @function
    @param {Event} evt The event keyCode.
    */
    handleOkAction: {
        value: function(evt) {
            if (this.okCallback) {
                this.okCallback.call(this, evt);
            }
            var anEvent = document.createEvent("CustomEvent");
            anEvent.initCustomEvent("montage_confirm_ok", true, true, null);
            this.dispatchEvent(anEvent);

            this.popup.hide();
        }
    },

    handleOkLongAction: {
        value: function(evt) {
            this.handleOkAction(evt);
        }
    },

    /**
    Description TODO
    @function
    @param {Event} evt The event keyCode.
    */
    handleCancelAction: {
        value: function(evt) {
            if (this.cancelCallback) {
                this.cancelCallback.call(this, evt);
            }
            var anEvent = document.createEvent("CustomEvent");
            anEvent.initCustomEvent("montage_confirm_cancel", true, true, null);
            this.dispatchEvent(anEvent);

            this.popup.hide();
        }
    },

    handleCancelLongAction: {
        value: function(evt) {
            this.handleCancelAction(evt);
        }
    }

    // Static method to show a Confirmation dialog
    /**
     Displays a confirm dialog with OK and Cancel buttons.
     @function
     @param {String} msg A message to display in the dialog.
     @param {Function} okCallback Function that's invoked when the user clicks OK
     @param {Function} cancelCallback Function that's invoked if the user clicks Cancel.
     @example
     ...
     */
}, {
    /**
        Description TODO
        @type {Function}
        @default null
    */
    popup: {
        set: function(value) {
            this._popup = value;
        },
        get: function() {
            return this._popup;
        }
    },

    show: {
        value: function(options, okCallback, cancelCallback) {
            var popup = this.application._confirmPopup,
                confirm;
            if (!popup) {
                popup = new Popup();
                this.popup = popup;

                popup.type = 'confirm';
                popup.title = 'Confirmation 2';
                popup.modal = true;
                this.application._confirmPopup = popup;

                confirm = new Confirm();
                popup.content = confirm;
            }

            confirm = popup.content;

            if (this.application.contextualizer) {
                this.application.contextualizer.currentLocale = this.application.interfaceLocale.iso;
                this.okLabel = this.application.contextualizer.localize("okay");
                this.cancelLabel = this.application.contextualizer.localize("cancel");
            } else {
                console.log("Not localizing the confirm buttons");
            }
            if (typeof(options) === "string") {
                confirm.msg = options;
                confirm.okLabel = this.okLabel;
                confirm.cancelLabel = this.cancelLabel;
            } else {
                confirm.iconSrc = options.iconSrc;
                confirm.msg = options.message;
                confirm.okLabel = options.okLabel || this.okLabel;
                confirm.cancelLabel = options.cancelLabel || this.cancelLabel;
            }

            confirm.okCallback = okCallback || null;
            confirm.cancelCallback = cancelCallback || null;

            popup.show();
        }
    }
});
