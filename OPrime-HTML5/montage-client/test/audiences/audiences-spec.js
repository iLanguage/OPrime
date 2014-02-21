var Montage = require("montage").Montage;
var TestPageLoader = require("montage-testing/testpageloader").TestPageLoader;

TestPageLoader.queueTest("audiences-test", function(testPage) {
    var test;
    beforeEach(function() {
        test = testPage.test;
    });

    describe("test/audiences/audiences-spec", function() {
        var audiences;

        beforeEach(function() {
            audiences = test.audiences;
        });

        describe("when first loaded", function() {
            it("it should do something", function() {
                expect(audiences).toBeDefined();
            });

        });
    });
});
