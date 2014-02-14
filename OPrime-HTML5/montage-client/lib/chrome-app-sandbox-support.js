/*
 * Declare functions for a basic PubSub pattern to handle
 * messages between the outside chrome app and the sandboxed context.
 */
var PubSub = {
    debugMode: false,
    debug: function(a, b, c) {
        if (!this.debugMode) {
            return;
        }
        if (a) {
            console.log(a);
        }
        if (b) {
            console.log(b);
        }
        if (c) {
            console.log(c);
        }
    }
};

PubSub.publisher = {
    subscribers: {
        any: []
    },
    subscribe: function(type, fn, context) {
        type = type || 'any';
        fn = typeof fn === "function" ? fn : context[fn];

        if (typeof this.subscribers[type] === "undefined") {
            this.subscribers[type] = [];
        }
        this.subscribers[type].push({
            fn: fn,
            context: context || this
        });
    },
    unsubscribe: function(type, fn, context) {
        this.visitSubscribers('unsubscribe', type, fn, context);
    },
    publish: function(type, publication) {
        this.visitSubscribers('publish', type, publication);
    },
    visitSubscribers: function(action, type, arg, context) {
        var pubtype = type || 'any';
        var subscribers = this.subscribers[pubtype];
        if (!subscribers || subscribers.length === 0) {
            if (PubSub.debugMode) {
                PubSub.debug(pubtype + ": There were no subscribers.");
            }
            return;
        }
        var i;
        var maxUnsubscribe = subscribers ? subscribers.length - 1 : 0;
        var maxPublish = subscribers ? subscribers.length : 0;

        if (action === 'publish') {
            // count up so that older subscribers get the message first
            for (i = 0; i < maxPublish; i++) {
                if (subscribers[i]) {
                    // TODO there is a bug with the subscribers they are getting lost, and
                    // it is trying to call fn of undefiend. this is a workaround until we
                    // figure out why subscribers are getting lost. Update: i changed the
                    // loop to count down and remove subscribers from the ends, now the
                    // size of subscribers isnt changing such that the subscriber at index
                    // i doesnt exist.
                    subscribers[i].fn.call(subscribers[i].context, arg);
                }
            }
            if (PubSub.debugMode) {
                PubSub.debug('Visited ' + subscribers.length + ' subscribers.');
            }

        } else {

            // count down so that subscribers index exists when we remove them
            for (i = maxUnsubscribe; i >= 0; i--) {
                try {
                    if (!subscribers[i].context) {
                        PubSub.debug("This subscriber has no context. should we remove it? " + i);
                    }
                    if (subscribers[i].context === context) {
                        var removed = subscribers.splice(i, 1);
                        if (PubSub.debugMode) {
                            PubSub.debug("Removed subscriber " + i + " from " + type, removed);
                        }
                    } else {
                        if (PubSub.debugMode) {
                            PubSub.debug(type + " keeping subscriber " + i, subscribers[i].context);
                        }
                    }
                } catch (e) {
                    if (PubSub.debugMode) {
                        PubSub.debug("problem visiting Subscriber " + i, subscribers);
                    }
                }
            }
        }
    }
};
PubSub.makePublisher = function(o) {
    var i;
    for (i in PubSub.publisher) {
        if (PubSub.publisher.hasOwnProperty(i) && typeof PubSub.publisher[i] === "function") {
            o[i] = PubSub.publisher[i];
        }
    }
    o.subscribers = {
        any: []
    };
};

PubSub.hub = {};
PubSub.makePublisher(PubSub.hub);

window.addEventListener('message', function(e) {
    var data = e.data;

    if (data.privatechannel) {
        PubSub.hub.publish(data.privatechannel, data);
    } else {
        console.warn("Missing channel for this message", e);
    }

}, false);



/* ============== Sample client code: callbacks ============== */


/*
 * Here is some sample code which sends messages
 * and uses pub sub to respond to the replies.
 *
 */
var debug = false;
if (debug) {

    /*
    Could declare an object with success and fail callbacks, 
    and then use those in the subscribe.
     */
    var tester = {
        id: Date.now(),
        key: 'xhr-file',
        params: {
            filename: 'package.json'
        },
        privatechannel: 'xhr-filepackage.json',
        success: function(result) {
            console.log("success", result);
        },
        failure: function(error) {
            console.log(error);
        }
    };

    /*
    Here in the subscribe the object tester, is passed as the context 'this' 
    so it is the tester's sucess and failure callbacks which are used.

    Note this example unsubsribes the object after there is a succesful result. 
    This doesnt have to be the case... you might want to recieve updates. 
     */
    PubSub.hub.subscribe(tester.privatechannel, function(data) {
        console.log("[app.js] Post Message replied to xhr-file: \n", data);

        if (data.result) {
            this.success(data.result);
            PubSub.hub.unsubscribe(this.privatechannel, null, this);
        } else {
            this.failure(data.error || {
                message: "Empty result"
            });
        }

    }, tester);

    /*
    Send the request to the widow outside of the sandbox. 

    If the window recieves the message, it will run whatever 
    it does for that key, and will post a reply message 
    containing a result.
    
    The PubSub.hub is already set up to publish those messages 
    on the private channel of the message (which triggers 
    the above subscribe routine)
     */
    window.top.postMessage({
        key: tester.key,
        params: tester.params,
        privatechannel: tester.privatechannel
    }, '*');

}

/* ============== Sample client code: promises ============== */


/**
 * This sample show how the above client code can be achieved with Q promises...
 */

if (debug) {
    var Q = Q || {};
    var deffered = Q.defer(),
        url = "package.json";

    var filePlease = {
        key: 'xhr-file',
        params: {
            filename: url
        }
    };
    filePlease.privatechannel = filePlease.key + filePlease.params.filename;

    PubSub.hub.subscribe(filePlease.privatechannel, function(data) {
        var responseText = data.result;
        if (responseText) {
            console.log("[app.js] Post Message replied to xhr-file: \n", data);
            // if (responseText.length > 1000) {
            //     console.log(responseText.substring(0, 1000) + "...");
            // } else {
            //     console.log(responseText);
            // }
            deffered.resolve(responseText);
        } else {
            deffered.reject(new Error("Can't XHR " + JSON.stringify(url)));
        }

        PubSub.hub.unsubscribe(this.privatechannel, null, this);
    }, filePlease);

    //Send the request to the widow outside of the sandbox
    window.top.postMessage(filePlease, '*');

    // return deffered.promise;
}
