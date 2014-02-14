var iframe = document.getElementById('sandbox-frame'),
    iframeWindow = iframe.contentWindow;

function xhrFile(data) {

    (function(message){
        var filename = message.params.filename,
        request = new XMLHttpRequest();

        request.onload = function() {
            message.result = this.responseText;
            iframeWindow.postMessage(message, '*');
        };

        request.onerror = function(error) {
            console.log("XHR Error", error);
            message.errorType = error.message;
            iframeWindow.postMessage(message, '*');
        };

        request.open("GET", filename, true);
        request.send();

    })(data);
}

window.addEventListener('message', function(e) {
    var data = e.data,
        key = data.key;

    // console.log('[sandbox-frame-bridge.js] Post Message request for ' + key + ' ... ');

    switch (key) {

        case 'xhr-file':
            xhrFile(data);
            break;

        default:
            console.log('[sandbox-frame-bridge.js] unidentified Post Message for "' + key + '" ... ');
    }
}, false);

