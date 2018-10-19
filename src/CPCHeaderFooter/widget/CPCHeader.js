define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "dojo/text!CPCHeaderFooter/widget/template/CPCHeader.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, 
    dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";

    return declare("CPCHeaderFooter.widget.CPCHeader", [_WidgetBase, _TemplatedMixin], {

        /* This widget literally only has to load the HTML wherever it's placed and has no other job
         * The footer is where the logic happens
         */

        templateString: widgetTemplate,

        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;
            this._updateRendering(callback);
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");
            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for running a microflow
        _execMf: function(mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function(objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function(error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function(cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        },


        _setupEvents: function() {

            //trying to load from canadapost urls instead of development urls
            this._loadScript("https://canadapost.ca/cpc/assets/cpc/js/lib/modernizr.js", "modernizr");
            this._loadScript("https://canadapost.ca/cpc/assets/cpc/js/lib/jquery.js", "jQuery");
            this._loadScript("https://canadapost.ca/cpc/assets/cpc/js/lib/foundation.min.js", "foundation");  
            this._loadScript("https://canadapost.ca/cwc/components/assets/scripts/cwc.js", "cwc");

        },
         
         // This loadScript function will load the external js file asynchronously without neededing jQuery 
         _loadScript: function(source, name) {

            // DON'T NEED THE LOADSCRIPT FUNCTIONALITY IN THIS WIDGET - IT EXISTS IN THE FOOTER

            // logging callback if the script was loaded successfully
            logger.debug(this.id + "._loadScript loaded: " + name);
         },

        /**
         * execute the specified Microflow, if one exists
         */
        _executeCompletedMicroflow: function(guid) {
            return new Promise(lang.hitch(this, function(resolve, reject) {
                if (this.onUploadComplete) {
                    mx.data.action({
                        params: {
                            actionname: this.onUploadComplete,
                            applyto: "selection",
                            guids: [guid],
                        },
                        origin: this.mxform,
                        callback: resolve,
                        error: reject
                    })
                } else {
                    resolve();
                }

            }))
        }
    });
});

require(["CPCHeaderFooter/widget/CPCHeader"]);