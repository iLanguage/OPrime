/**
    @module core/loader-results
 */

var Loader = require("montage/ui/loader.reel").Loader;

/**
 @class LoaderResults
 @extends Loader
 */

exports.LoaderResults = Loader.specialize( /** @lends LoaderResults# */ {

    /**
     * The main module to require
     */
    mainModule: {
        value: "oprime-montage/ui/report.reel/main.reel"
    },

    /**
     * The name of the object to read from the mainModule exports
     */
    mainName: {
        value: "Main"
    }

});
