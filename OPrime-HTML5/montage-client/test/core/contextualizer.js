var Montage = require("montage").Montage;
var TestPageLoader = require("montage-testing/testpageloader").TestPageLoader;
var bind = require("frb/bind");
var specIsRunningTooLong = 1000000;

TestPageLoader.queueTest("../audio/audio-test", function(testPage) {

    it("can bind after internal changes", function() {
        var object = {
            localizer: {
                currentLocale: "context1",
                data: {
                    "context1": {
                        "contextualized_string": {
                            "message": "this one is for context 1"
                        }
                    },
                    "context2": {
                        "contextualized_string": {
                            "message": "this one is for context 2"
                        }
                    }
                },
                localize: function(context, key) {
                    return this.data[context][key].message;
                }
            }
        };
        var currentContext = "context1";
        bind(object, "average", {
            "<-": "localizer.localize(currentContext, 'contextualized_string')"
        });
        expect(object.average).toEqual("this one is for context 1");
        currentContext = "context2";

        //TODO without binding the second time (re-binding) the test fails
        bind(object, "average", {
            "<-": "localizer.localize(currentContext, 'contextualized_string')"
        });
        expect(object.average).toEqual("this one is for context 2");
    });

});
