/**
 * @module ui/user.reel
 * @requires core/contextualizable-component
 */
var ContextualizableComponent = require("core/contextualizable-component").ContextualizableComponent;

/**
 * @class User
 * @extends ContextualizableComponent
 */
exports.User = ContextualizableComponent.specialize( /** @lends User# */ {
    constructor: {
        value: function User(options) {
            console.log("Creating user ", options);
            this.super();
            if(!this.id){
                this.id = Date.now();
            }
            if(!this.username){
                if(!window[this.jsonType+"Count"]){
                    window[this.jsonType+"Count"] = 0;
                }
                window[this.jsonType+"Count"]++;
                this.username = this.jsonType + window[this.jsonType+"Count"];
            }
        }
    },
    jsonType: {
        value: "user"
    },
    id: {
        value: null
    },
    username: {
        value: null
    },
    gravatar: {
        value: null
    },
    gravatarUrl: {
        get: function() {
            return this.gravatar ? "https://secure.gravatar.com/avatar/324567576432376453214532?d=identicon" : "gravatar.png";
        },
        set: function() {
            //no op
        }
    },
    email: {
        value: null
    },
    firstname: {
        value: null
    },
    lastname: {
        value: null
    },
    _name: {
        value: null
    },
    name: {
        get: function() {
            var firstnameLastname = (this.firstname + " " + this.lastname).replace(/null/g, "").trim();
            return  this._name || firstnameLastname || this.username || this.id;
        },
        set: function(name) {
            this._name = name;
            if (this.firstname && this.lastname) {
                return;
            }
            var names = name.split(" ");
            if (names.length > 2) {
                this.lastname = names.pop();
                this.firstname = names.shift();
                this.middlename = names.join(" ");
                return;
            }
            if (names.length === 2) {
                this.firstname = names[0];
                this.lastname = names[1];
                return;
            }
            this.firstname = name;
            this.lastname = "";
        }
    }
});