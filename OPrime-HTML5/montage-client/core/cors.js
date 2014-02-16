var CORS = {
    debugMode: true,
    debug: function(a, b, c) {
        if (this.debugMode) {
            console.log(a, b, c);
        }
    },
    bug: function(message) {
        console.warn(message);
        alert(message);
    }
};

/*
 * Functions for well formed CORS requests
 */
CORS.makeCORSRequest = function(options) {
    var self = this;
    this.debugMode = true;
    if (!options.method) {
        options.method = options.type || "GET";
    }
    if (!options.url) {
        this.bug("There was an error. Please report this.");
    }
    if (!options.data) {
        options.data = "";
    }
    if (options.method == "GET" && options.data) {
        options.dataToSend = JSON.stringify(options.data).replace(/,/g, "&").replace(/:/g, "=").replace(/"/g, "").replace(/[}{]/g, "");
        options.url = options.url + "?" + options.dataToSend;
    }
    if (!options.success) {
        options.success = function(a, b, c) {
            self.debug(a, b, c);
        }
    }
    if (!options.error) {
        options.error = function(a, b, c) {
            self.debug(a, b, c);
        }
    }
    /*
     * Helper function which handles IE
     */
    var createCORSRequest = function(method, url) {

        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    };

    var xhr = createCORSRequest(options.method, options.url);
    if (!xhr) {
        this.bug('CORS not supported, your browser is unable to contact the database.');
        return;
    }

    //  if(options.method == "POST"){
    //xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.withCredentials = true;
    //  }

    xhr.onload = function(e, f, g) {
        var text = xhr.responseText;
        if (self.debugMode) self.debug('Response from CORS request to ' + options.url + ': ' + text);
        if (text) {
            options.success(JSON.parse(text));
        } else {
            self.bug("There was no content in the server's response text. Please report self.");
            options.error(e, f, g);
        }
        self.debugMode = false;
    };

    xhr.onerror = function(e, f, g) {
        if (self.debugMode) self.debug(e, f, g);
        self.bug('There was an error making the CORS request to ' + options.url + " from " + window.location.href + " the app will not function normally. Please report this.");
        options.error(e, f, g);
    };
    if (options.method == "POST") {
        xhr.send(JSON.stringify(options.data));
    } else {
        xhr.send();
    }
};

exports.CORS = CORS;
