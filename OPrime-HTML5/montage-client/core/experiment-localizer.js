var Localizer = require("montage/core/localizer").Localizer,
    logger = require("montage/core/logger").logger("experiment_localizer"),
	Message = require("montage/core/localizer").Message,
    Serializer = require("montage/core/serialization").Serializer,
    Deserializer = require("montage/core/serialization").Deserializer,
    Bindings = require("montage/core/bindings").Bindings,
    FrbBindings = require("montage/frb/bindings");


var KEY_KEY = "key",
    DEFAULT_MESSAGE_KEY = "default",
	LOCALE_STORAGE_KEY = "experiment_locale",

    // directory name that the locales are stored under
    LOCALES_DIRECTORY = "locale",
    // filename (without extension) of the file that contains the messages
    MESSAGES_FILENAME = "messages",
    // filename of the manifest file
	MANIFEST_FILENAME = "../assets/stimuli/locale/manifest.json";

var EMPTY_STRING_FUNCTION = function() { return ""; };

// This is not a strict match for the grammar in
// http://tools.ietf.org/html/rfc5646, but it's good enough for our purposes.
var reLanguageTagValidator = /^[a-zA-Z]+(?:-[a-zA-Z0-9]+)*$/;


var ExperimentLocalizer = Localizer.specialize( /** @lends Experiment# */ {

	constructor: {
		value: function ExperimentLocalizer() {
			console.log("constructs experiment localizer");
			this.super();
		}
	},

    /**
     * Promise for the manifest
     * @private
     * @type Promise
     * @default null
     */
    _manifest: {
        depends: ["require"],
        get: function() {
            var messageRequire = this.require;

            if (messageRequire.packageDescription.manifest === true) {
                if (this.__manifest) {
                    return this.__manifest;
                } else {
                    return this.__manifest = messageRequire.async(MANIFEST_FILENAME);
                }
            } else {
                return Promise.reject(new Error(
                    "Package has no manifest. " + messageRequire.location +
                    "package.json must contain \"manifest\": true and " +
                    messageRequire.location+MANIFEST_FILENAME+" must exist"
                ));
            }
        }
    }

});
exports.ExperimentLocalizer = ExperimentLocalizer;

/**
 * @class DefaultExperimentLocalizer
 * @extends Localizer
 */
var DefaultExperimentLocalizer = ExperimentLocalizer.specialize( /** @lends DefaultExperimentLocalizer# */ {
	
});

// var defaultLocalizer = exports.defaultLocalizer = new DefaultExperimentLocalizer().init();
var defaultExperimentLocalizer = exports.defaultExperimentLocalizer = new DefaultExperimentLocalizer().init();
exports.localize = defaultExperimentLocalizer.localize.bind(defaultExperimentLocalizer);
var ExperimentationMessage = exports.ExperimentationMessage = Message.specialize( /** @lends ExperimentationMessageLocalizer# */ {
	/**
	 * @method
	 * @param {string|Function} keyOrFunction A messageformat string or a
	 * function that takes an object argument mapping variables to values and
	 * returns a string. Usually the output of Localizer#localize.
	 * @param {Object} data  Value for this data property.
	 * @returns {Message} this.
	 */
	// init: {
	//     value: function(key, defaultMessage, data) {
	//         return this.super();
	//     }
	// },

    _localizer: {
        value: defaultExperimentLocalizer
    }

});

var createMessageBinding = function(object, prop, key, defaultMessage, data, deserializer) {
    var message = new ExperimentationMessage();

    for (var d in data) {
        if (typeof data[d] === "string") {
            message.data.set(d, data[d]);
        } else {
            Bindings.defineBinding(message.data, ".get('"+ d + "')", data[d], {
                components: deserializer
            });
        }
    }

    if (typeof key === "object") {
        Bindings.defineBinding(message, "key", key, {
            components: deserializer
        });
    } else {
        message.key = key;
    }

    if (typeof defaultMessage === "object") {
        //console.log("Define default binding: ", defaultMessage);
        Bindings.defineBinding(message, "defaultMessage", defaultMessage, {
            components: deserializer
        });
        //console.log(FrbBindings.getBindings(message).source, deserializer.getObjectByLabel("source"));
    } else {
        message.defaultMessage = defaultMessage;
    }

    Bindings.defineBinding(object, prop, {
        // TODO: Remove when possible to bind to promises and replace with
        // binding to "localized"
        "<-": "__localizedResolved",
        source: message,
        serializable: false
    });
};

Serializer.defineSerializationUnit("experiment_localizations", function(serializer, object) {
    var bindingDescriptors = FrbBindings.getBindings(object);

    if (bindingDescriptors) {
        var result;
        for (var prop in bindingDescriptors) {
            var desc = bindingDescriptors[prop];
            if (ExperimentationMessage.prototype.isPrototypeOf(desc.source)) {
                if (!result) {
                    result = {};
                }
                var message = desc.source;
                result[prop] = message.serializeForLocalizations(serializer);
            }
        }
        return result;
    }
});

Deserializer.defineDeserializationUnit("experiment_localizations", function(deserializer, object, properties) {
    for (var prop in properties) {
        var desc = properties[prop],
            key,
            defaultMessage;

        if (!(KEY_KEY in desc)) {
            console.error("localized property '" + prop + "' must contain a key property (" + KEY_KEY + "), in ", properties[prop]);
            continue;
        }
        if(logger.isDebug && !(DEFAULT_MESSAGE_KEY in desc)) {
            logger.debug(this, "Warning: localized property '" + prop + "' does not contain a default message property (" + DEFAULT_MESSAGE_KEY + "), in ", object);
        }

        key = desc[KEY_KEY];
        defaultMessage = desc[DEFAULT_MESSAGE_KEY];

        createMessageBinding(object, prop, key, defaultMessage, desc.data, deserializer);
    }
});