var Montage = require("montage").Montage;
var TestPageLoader = require("montage-testing/testpageloader").TestPageLoader;

TestPageLoader.queueTest("complex-experiment-test", function(testPage) {
    var test;
    beforeEach(function() {
        test = testPage.test;
    });

    describe("test/experiment/complex-experiment/complex-experiment-spec", function() {
        var experiment;

        beforeEach(function() {
            experiment = test.experiment;
        });

        describe("when first loaded", function() {
            it("it should do something", function() {
                expect(experiment).toBeDefined();
            });

            it("it should default to english locale", function() {
                expect(experiment.locale).toBe("en");
            });

            it("it should set the description", function() {
                experiment.locale = "fr-ca"
                expect(experiment.locale).toBe("fr-ca");
            });
        });
    });
});