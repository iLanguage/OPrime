var Montage = require("montage").Montage;
var TestPageLoader = require("montage-testing/testpageloader").TestPageLoader;
var specIsRunningTooLong = 1000000;

TestPageLoader.queueTest("audio-test", function(testPage) {
    var test;
    beforeEach(function() {
        test = testPage.test;
    });

    describe("test/audio/audio-spec", function() {
        var audio;

        beforeEach(function() {
            audio = test.audio1;
        });

        describe("when first loaded", function() {
            it("it should do something", function() {
                expect(audio).toBeDefined();
            });
        });


        it('should play audio', function() {
            runs(function() {
                spyOn(audio, 'play');
                audio.play();
                // helper.trigger(window.document, 'deviceready');
            });

            waitsFor(function() {
                return (audio.play.calls.length > 0);
            }, 'calls should be called once', 5000);

            runs(function() {
                expect(audio.play).toHaveBeenCalled();
            });
        });

        it('should play audio after changing the src', function(done) {
            runs(function() {
                audio.src = "http://cordova.apache.org/downloads/BlueZedEx.mp3"; // http://81310752d5730fb4ef3c-221b4998ec12974102282b6d4a8fafbe.r2.cf1.rackcdn.com/3rds.mp3
                spyOn(audio, 'play');
                audio.play();
                // helper.trigger(window.document, 'deviceready');
            });

            waitsFor(function() {
                return (audio.play.calls.length > 0);
            }, 'calls should be called once', 5000);

            runs(function() {
                expect(audio.play).toHaveBeenCalled();
            });
        }, specIsRunningTooLong);


        it('should be able to animate events at points in the audio playback', function(done) {
            runs(function() {
                audio.src = "http://cordova.apache.org/downloads/BlueZedEx.mp3"; // http://81310752d5730fb4ef3c-221b4998ec12974102282b6d4a8fafbe.r2.cf1.rackcdn.com/3rds.mp3
                audio.addAudioEventAtTimePeriod("aneventlistener", 0, 200000);


                spyOn(audio.element, 'ended');
                audio.play();
                // helper.trigger(window.document, 'deviceready');
            });

            waitsFor(function() {
                return (audio.ended.calls.length > 0);
            }, 'calls should be called once', 5000);

            runs(function() {
                expect(audio.ended).toHaveBeenCalled();
            });
        }, specIsRunningTooLong);
    });
});
