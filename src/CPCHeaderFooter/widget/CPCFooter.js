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
    //"ImageEditor/lib/fabric",
    //"ImageEditor/lib/canvas-to-blob",


    "dojo/text!CPCHeaderFooter/widget/template/CPCFooter.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, 
    dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";

    return declare("CPCHeaderFooter.widget.CPCFooter", [_WidgetBase, _TemplatedMixin], {

        templateString: widgetTemplate,

        // nodes
        canvasNode: null,
        widgetBase: null,
        addTextButtonNode: null,
        addArrowButtonNode: null,
        saveButtonNode: null,
        deleteButtonNode: null,
        increaseFontButtonNode: null,
        makeBlueButton7Node: null,
        textFontSizeNode: null,
        fontFamilyNode: null,

        //modeler variables
        canvasHeight: 500,
        canvasWidth: 900,
        imAttribute: null,
        imageMapping: null, // {imKey: string, imImage: image}
        pathToParent: null,
        onUploadComplete: null,

        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            logger.debug(this.id + ".postCreate");

           // this.canvas = new fabric.Canvas(this.canvasNode);



            // fabric.Image.fromURL('/img/MyFirstModule$_16_base_back.png', function (oImg) {
            //     this.canvas.add(oImg);
            // }.bind(this));


            // _setupEvents contains the logic for loading the scripts
            //this._setupEvents();




            //this.saveButtonNode.innerText = this.SaveText;
           // this.cancelButtonNode.innerText = this.CancelText;
           // this.addTextButtonNode.innerText = this.AddTextText;
           // this.addArrowButtonNode.innerText = this.AddArrowText;
           // this.deleteButtonNode.innerText = this.RemoveItemText;
           // this.annotateTextNode.innerText = this.AnnotateOptionsText;
           // this.ColorTextNode.innerText = this.ColorText;
           // this.FontSizeTextNode.innerText = this.FontSizeText;

            },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");

            
            /* not sure if anything needs to be called in update
             * Going to try putting setup events in postCreate then here to see if there is a difference
             */
            var cpcComponents = document.getElementsByClassName("cpc-component");

            if (cpcComponents != null) {
                console.log("cpc-components exist");
            }
            this._contextObj = obj;
            this._setupEvents();
            this._updateRendering(callback);
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
            // this._resizeCanvas(); // could resize to window?
            //this._updateRendering();
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");
            //this._resizeCanvas();
            //this._drawCanvasBackground();
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
        /* 
         * This loadScript function will load the external js file asynchronously without neededing jQuery and 
         * is updated to ES6 standards
         */
         _loadScript: function (source, name) {
            var script = document.createElement('script');
            var prior = document.getElementsByTagName('script')[0];
            script.async = 1;

            script.onload = script.onreadystatechange = function( _, isAbort ) {
                if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
                    script.onload = script.onreadystatechange = null;
                    script = undefined;

                    if (!isAbort) {
                        // logging callback if the script was loaded successfully
                        logger.debug(this.id + "._loadScript loaded: " + name);
                     }
                }
            };

            script.src = source;
            prior.parentNode.insertBefore(script, prior);
            
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

require(["CPCHeaderFooter/widget/CPCFooter"]);