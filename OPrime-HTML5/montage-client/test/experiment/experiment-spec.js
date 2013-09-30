var Montage = require("montage").Montage;
var TestPageLoader = require("montage-testing/testpageloader").TestPageLoader;

TestPageLoader.queueTest("experiment-test", function(testPage) {
    var test;
    beforeEach(function() {
        test = testPage.test;
    });

    describe("test/experiment/experiment-spec", function() {
        var experiment;

        beforeEach(function() {
            experiment = test.experiment;
        });

        describe("when first loaded", function() {
            it("it should do something", function() {
                expect(experiment).toBeDefined();
            });
        });
    });
});
