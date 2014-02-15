var CordovaAudio = {};
// device APIs are available
//
CordovaAudio.onDeviceReady = function() {
    this.play("assets/gammatone.wav");
    console.log("Device is ready.");
}

// Audio player
//
CordovaAudio.my_media = null;
CordovaAudio.mediaTimer = null;
CordovaAudio.library = "Cordova";

// Play audio
//
CordovaAudio.play = function(src) {
    // Create Media object from src
    this.my_media = new Media(src, this.onSuccess, this.onError);
    this.duration = 0;
    this.src = src;

    // Play audio
    this.my_media.play();

    var self = this;
    // Update this.my_media position every second
    if (this.mediaTimer == null) {
        this.mediaTimer = setInterval(function() {
            // get this.my_media position
            self.my_media.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                        self.setAudioPosition((position) + " sec");
                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    self.setAudioPosition("Error: " + e);
                }
            );
        }, 1000);
    }
}

// Pause audio
//
CordovaAudio.pause = function() {
    if (this.my_media) {
        this.my_media.pause();
    }
}

// Stop audio
//
CordovaAudio.stop = function() {
    if (this.my_media) {
        this.my_media.stop();
    }
    clearInterval(this.mediaTimer);
    this.mediaTimer = null;
}

// onSuccess Callback
//
CordovaAudio.onSuccess = function() {
    console.log("CordovaAudio.play():Audio Success");
}

// onError Callback
//
CordovaAudio.onError = function(error) {
    console.warn('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

// Set audio position
//
CordovaAudio.setAudioPosition = function(position) {
    if (document.getElementById('audio_position')) {
        document.getElementById('audio_position').innerHTML = position;
    } else {
        console.log("current audio position " + position);
        if (position > 0) {
            this.duration = position;
            console.log("setting audio duration to " + position);
        } else {
            clearInterval(this.mediaTimer);
            this.mediaTimer = null;
        }
    }
}

CordovaAudio.duration = 0;

exports.CordovaAudio = CordovaAudio;
// Wait for device API libraries to load
//
// document.addEventListener("deviceready", CordovaAudio.onDeviceReady, false);
