/*! core 2015-05-25 */
/**
 * The base module for the Core JS framework.
 * It provides helper methods for implementing OOP methodologies and basic utilities such as browser detection.
 *
 * @module core
 */
(function(scope, document){

    /**
     * Function prototype extension in the core framework.
     *
     * @class Function
     * @constructor
     *
     */
    if(!Function.prototype.bind) {
        /**
         * Added support for older browser. Only applied when the method is not available. Returns a scope bound function.
         *
         * @method bind
         * @param {Object} scope The scope where the function is bound to
         * @return {Function} A scope bound function
         */
        Function.prototype.bind = function(oThis) {
            if( typeof this !== "function") {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {
            }, fBound = function() {
                return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
            return fBound;
        };
    }
    /**
     * Utility method for implementing prototypal inheritance within the core framework.
     *
     * @method inherits
     * @param {Object} obj The object where the prototype is going to be derived from.
     *
     */
    Function.prototype.inherits = function(obj){
        this.prototype = new obj({__inheriting__:true});
    };
    /**
     * Utility method for implementing mixins/augmentation/partial in the core framework
     *
     * @method mixin
     * @param {Object} obj The object where the prototype is going to be mix with.
     *
     */

    Function.prototype.augment = Function.prototype.mixin = Function.prototype.partial = function(obj){
        if(typeof obj == "function"){
            for(var prop in obj.prototype){
                this.prototype[prop] = obj.prototype[prop];
            }
        }
        if(typeof obj == "object"){
            for(var prop in obj){
                this.prototype[prop] = obj[prop];
            }
        }
    }
    if(!scope.core){
        /**
         * The main module and namespace used within the core framework.
         *
         * @class core
         *
         *
         */
        scope.core = {};
    }
    if(typeof navigator !== 'undefined'){
        var N= navigator.appName, ua=navigator.userAgent, tem;
        var M= ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
        if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
        M= M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
        var br = {
            mobile: false,
            ios: false,
            iphone: false,
            ipad: false,
            android: false,
            webos: false,
            mac: false,
            windows: false,
            other: true,
            name: M[0].toLowerCase() == "trident" ? "msie" : M[0].toLowerCase(),
            version: M[1].split(".")[0],
            touch:'ontouchstart' in window,
            full_version:M[1]

        };
        function ver(re, index, replaceA, replaceB) {
            var v = re.exec(ua);
            if(v === null || typeof v !== 'object' || typeof v.length !== 'number') {
                return true;
            } else if(typeof v.length === 'number' && v.length >= (index + 1)) {
                if(replaceA && replaceB) return v[index].replace(replaceA, replaceB);
                else return v[index];
            } else {
                return true;
            }
        }
        if (/mobile/i.test(ua)) {
            br.mobile = true;
        }
        if (/like Mac OS X/.test(ua)) {
            br.ios 		= ver(/CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/, 2, /_/g, '.');
            br.iphone 	= /iPhone/.test(ua);
            br.ipad 		= /iPad/.test(ua);
        }
        if (/Android/.test(ua)) {
            br.android = ver(/Android ([0-9\.]+)[\);]/, 1);
        }

        if (/webOS\//.test(ua)) {
            br.webos = ver(/webOS\/([0-9\.]+)[\);]/, 1);
        }
        if (/(Intel|PPC) Mac OS X/.test(ua)) {
            br.mac = ver(/(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/, 2, /_/g, '.');
        }
        if (/Windows NT/.test(ua)) {
            br.windows = ver(/Windows NT ([0-9\._]+)[\);]/, 1);
        }
        for(var key in br) {
            if(key !== 'Other' && key !== 'Mobile' && br[key] !== false) {
                br.other = false;
            }
        }
        scope.core.browser = br;
        /**
         * Stored browser information based on the detection algorithm implemented within core.
         * @property browser
         * @type Object
         */
        scope.core.browser[M[0].toLowerCase() == "trident" ? "msie" : M[0].toLowerCase()] = {version:M[1].split(".")[0]};
        //
        // ### core.browser ######
        // Browser detection implementation
        // Creates a browser object in the core object containing browser information.

    }
    /**
     * Utility method for generating GUID
     * @method GUID
     * @returns String Returns a GUID string
     */
    scope.core.GUID = function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    };
    /**
     * Utility method for getting the bounding rect of the dom element - also adds support for IE8
     * @method rect
     * @returns Object Contains the rectangular information of a HTMLElement
     */
    scope.core.rect = function(targ){
        var o = {};
        if(targ instanceof Array){
            o = targ[0].getBoundingClientRect()

        }
        o = targ.getBoundingClientRect();
        if(typeof o.width == "undefined"){
            var x = o;
            o = {
                top: x.top,
                left: x.left,
                right: x.right,
                bottom: x.bottom
            }
            o.width = o.right - o.left;
            o.height = o.bottom + o.top;
        }else
        if(typeof o.right == "undefined"){
            o = {
                top: x.top,
                left: x.left,
                width: x.width,
                height: x.height
            }
            o.right = o.left+ o.width;
            o.bottom = o.top + o.height;
        }
        return o;
    };
    /**
     * Utility method for exposing objects in a namespaced fashion.
     * @method registerNamespace
     */
    scope.core.registerNamespace = function(nspace, obj){
        var parts = nspace.split(".");
        var root = parts.shift();

        if(!scope[root]) { scope[root] = {}; }
        var temp = scope[root];
        while(parts.length > 1){
            var sp = parts.shift();
            if(!temp[sp]){
                temp[sp] = {};
            }
            temp = temp[sp];
        }
        if(!parts.length){
            scope[root] = obj;
        }else{
            var last = parts.shift();
            if(last){
                temp[last] = obj || {};
            }
        }
    };
    /**
     * Utility method for referencing objects within the core framework. This also adds existence checking for the objects being referenced on import.
     * @method import
     * @param {String} package The namespace of the object being imported.
     * @returns Object The object being imported
     */
    scope.core._import = function(pack){
        var parts = pack.split(".");
        var sc = scope;
        while(parts.length){
            var sp = parts.shift();
            if(sc[sp]){
                sc = sc[sp];
            }else{
                return null;
            }
        }
        return sc;
    };
    /**
     * Utility method for performing dependency checks on core classes.
     * @method dependency
     * @param {String} object The object to check if its defined.
     * @param {String} message The message to display on warning when the object passed for checking is undefined.
     * @returns Object The object being imported
     */
    scope.core.dependency = function(obj, message){
        if(!scope[obj]){
            console.warn(message);
        }
    };
    /** DOCUMENT READY **/
    scope.core.documentReady = function(win, fn) {
        var done = false, top = true,
            doc = win.document, root = doc.documentElement,
            add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
            rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
            pre = doc.addEventListener ? '' : 'on',
            init = function(e) {
                if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true)) fn.call(win, e.type || e);
            },

            poll = function() {
                try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
                init('poll');
            };

        if (doc.readyState == 'complete') fn.call(win, 'lazy');
        else {
            if (doc.createEventObject && root.doScroll) {
                try { top = !win.frameElement; } catch(e) { }
                if (top) poll();
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }
    }
    // ### addEventListener/removeEventListener/dispatchEvent ## //
    // EventListener implementation for browsers without support
    if(scope == window){
        !window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
            WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
                var target = this;

                registry.unshift([target, type, listener, function (event) {
                    event.currentTarget = target;
                    event.preventDefault = function () { event.returnValue = false };
                    event.stopPropagation = function () { event.cancelBubble = true };
                    event.target = event.srcElement || target;

                    listener.call(target, event);
                }]);

                this.attachEvent("on" + type, registry[0][3]);
            };

            WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
                for (var index = 0, register; register = registry[index]; ++index) {
                    if (register[0] == this && register[1] == type && register[2] == listener) {
                        return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
                    }
                }
            };

            WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
                return this.fireEvent("on" + eventObject.type, eventObject);
            };
        })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
    }
    scope.core.ENV = {};
    scope.core.configure = function(o){
        for(var prop in o){
            this.ENV[prop] = o[prop];
        }
    };
    var __queue__ = [];
    function nameFunction(name, fn){
        return (new Function("return function(call) { return function " + name + "() { return call(this, arguments) }; };")())(Function.apply.bind(fn));
    }
    function retrieveClass(namespace, scope){
        var namespaces = namespace.split(".");
        var len = namespaces.length;
        var cscope = scope;
        for(var i = 0;i<len;i++){
            try{
                cscope = cscope[namespaces[i]];
            }catch(err){
                return null;
            }

        }
        return cscope;
    }
    function manageModuleRegistration(definition){
        var o = {};
        if(!("inherits" in definition)){
            definition.inherits = "core.Core";
        }


        o.base = scope.core._import(definition.inherits);
        if("base" in o){
            try{
                var __super__ = o.base.prototype;
            }catch(err){
                throw new Error("Module "+definition.classname+" failed to inherit " + definition.inherits);
            }

        }

        var classsplit = definition.classname.split(".");
        o.funcname = classsplit[classsplit.length-1];
        o[o.funcname] = nameFunction(o.funcname, function (opts){
            if (opts && opts.__inheriting__) return;
            if(opts && "parent" in opts){
                this.parent = opts.parent;
            }
            if(opts && "el" in opts){
                this.node = this.el = opts.el;
            }
            if(opts && "params" in opts){
                this.params = opts.params;
            }
            if(__super__){
                __super__.constructor.call(this, opts);
            }
        });
        if(o.base){
            o[o.funcname].inherits(o.base);
        }
        var proto = o[o.funcname].prototype;
        proto.dispose = function () {
            //clear
            if("onBeforeDispose" in this && typeof this.onBeforeDispose == "function") {
                this.onBeforeDispose();
                this.onBeforeDispose = null; //TODO: investigate why this is triggered twice
            }
            try{
                __super__.dispose.call(this);
            }catch(err){
                console.log("dispose", err);
            }
        };
        proto.construct = function(opts){
            if("onBeforeConstruct" in this && typeof this.onBeforeConstruct == "function"){
                this.onBeforeConstruct();
                this.onBeforeConstruct = null; //TODO: investigate why this is triggered twice
            }
            try{
                __super__.construct.call(this, opts);

                if("onAfterConstruct" in this && typeof this.onAfterConstruct == "function") {
                    this.onAfterConstruct();
                    this.onAfterConstruct = null; //TODO: investigate why this is triggered twice
                }
            }catch(err){
                console.log("construct", err.stack);
            };
        };
        var tscope = {$super:__super__, $classname: o.funcname};
        var module = definition.module;
        if(module instanceof Array && module.length){
            var mfunc = module.pop();
            var len = module.length;
            while(len--){
                var tclass = retrieveClass(module[len], scope);
                module[len] = tclass;
            }
            if(typeof mfunc == "function"){
                mfunc.apply(tscope, module);
            }else{
                throw new Error("Property module does not contain a function.");
            }

        }else if(typeof module == "function"){
            module.apply(tscope);
        }
        for(var prop in tscope){
            proto[prop] = tscope[prop];
        }
        scope.core.registerNamespace(definition.classname, ("singleton" in definition && definition.singleton) ? new o[o.funcname]() : o[o.funcname]);

    }
    scope.core.mixin = function(base, mix){
        for(var prop in mix){
            base[prop] = mix[prop];
        }
    };
    function checkDIs(definition){
        var module = definition.module;
        if(module instanceof Array && module.length){
            var len = module.length-1;
            while(len--){
                if(typeof module[len] !== "function"){
                    var tclass = retrieveClass(module[len], scope);
                    if(!tclass){
                        return false
                    }
                }

            }
            if(typeof mfunc == "function"){
                return true;
            }

        }else if(typeof module == "function"){
            return true;
        }
        return true;
    }
    scope.core.registerModule = function(definition){
        if(definition.classname){
            if(checkDIs(definition)){
                manageModuleRegistration(definition);
                if(__queue__.length){
                    scope.core.registerModule(__queue__.pop());
                }
            }else{
                __queue__.push(definition); //queue up classes with missing dependencies
            }
        }else if(definition.mixin){
            var base = new Function("return " + definition.mixin)();
            var tscope = {};
            var module = definition.module;
            if(module instanceof Array && module.length){
                var mfunc = module.pop();
                var len = module.length;
                while(len--){
                    module[len] = retrieveClass(module[len], scope);
                }
                mfunc.apply(tscope, module);
            }else if(typeof module == "function"){
                module.apply(tscope);
            }
            for(var prop in tscope){
                if("prototype" in base){
                    base.prototype[prop] = tscope[prop];
                }else{
                    base[prop] = tscope[prop];
                }

            }
        }else{
            throw new Error("Error registering a module");
        }
    };
    scope.core.strapUp = function(func, useclass){
        if(__queue__.length){
            while(__queue__.length){
                manageModuleRegistration(__queue__.pop()); //load remaining definitions without checking dependencies.
            }
        }
        //instantiate body as a module
        //this will trigger instantiation of each child element as core modules.
        if(typeof document !== 'undefined'){
            var found = false;
            var evaluateRootApp = function(root){
                var scope = typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window;
                var cls = useclass ? core._import(useclass) : scope.core.Module;
                var opts = {};
                opts.el = root;
                if(!("__coreapp__" in window)){
                    window.__coreapp__ = new cls(opts);
                }else{
                    if(!(window.__coreapp__ instanceof Array)){
                        window.__coreapp__ = [window.__coreapp__];
                    }
                    window.__coreapp__.push(new cls(opts));
                }
                found = true;
            };
            scope.core.documentReady(window, function docready(){
                evaluateRootApp(document.body);
                func();
            });
        }
    };


})(typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window, document); //supports node js

if(!("console" in window)){
    console = {
        log:function(){},
        warn:function(){},
        trace:function(){}
    }
}

(function(){

    /**
     * The base object of all core based classes. Every object created within the Core framework derives from this class.
     *
     * @class Core
     * @namespace core
     * @constructor
     * @param {Object} opts An object containing configurations required by the Core class.
     * @param {HTMLElement} opts.el The node element included in the class composition.
     *
     */



    function Core(opts){
        //skips all process when instantiated from Function.inherits
        if(opts && opts.__inheriting__) return;
        if(opts){
            //`this.el property` a dom element context
            if(opts.el){
                /**
                 * The selected HTML element node reference.
                 *
                 * @property node
                 * @type HTMLElement
                 *
                 */
                this.node = this.el = opts.el;
                if("rivets" in window){
                    prepareBindings.call(this);
                }

            }
        }
        /**
         * Property for storing proxied function/methods
         *
         * @property proxyHandlers
         * @type Object
         *
         */
        this.proxyHandlers = {};
        if("construct" in this){
            this.construct(opts || {});
        }
        var ref = this;
        setTimeout(function(){
            if(ref.delayedConstruct){
                ref.delayedConstruct(opts || {});
            }
        }, 0);

    }
    var applyBindings = function(){
        this.$bindings = rivets.bind(this.node, this, {
            prefix: 'data-rv',
            preloadData: true,
            rootInterface: '.',
            templateDelimiters: ['{{', '}}']

        });
    };
    var prepareBindings = function(){
        applyBindings.call(this);
    };
    /**
     * Returns a scope bound function and stores it on the proxyHandlers property.
     *
     * @method getProxyHandler
     * @param {String} method The string equivalent of the defined method name of the class.
     * @return {Function} The scope bound function defined on the parameter.
     */
    Core.prototype.handleEvent = Core.prototype._ = Core.prototype.getProxyHandler = function(str){
        if(!this.proxyHandlers[str]){
            if(typeof this[str] === "function" ){
                this.proxyHandlers[str] = this[str].bind(this);
            }else{
                console.warn("Warning: attempt to create non existing method as proxy " + str);
            }

        }
        return this.proxyHandlers[str];
    }
    // ### Core.clearProxyHandler ######
    // Core method for clearing proxied function methods.
    /**
     * Core method for clearing proxied function methods.
     *
     * @method clearProxyHandler
     * @param {String} method The string equivalent of the defined method to clear.
     */
    Core.prototype.clearProxyHandler = function(str){
        var ret = this.proxyHandlers[str];
        if(ret === null){
            console.warn("Warning: attempt to clear a non-existing proxy - "+str);
        }
        this.proxyHandlers[str] = null;
        delete this.proxyHandlers[str];
        return ret;
    }
    /**
     * Core method initialization. This is called automatically on core sub classes.
     *
     * @method construct
     * @param {Object} options The object passed on the constructor of a core based class.
     */
    Core.prototype.construct = function(opts){
    };
    /**
     * Core method initialization. This is called automatically on core sub classes. Adds delay when being called automatically, this allows
     * time to setup all the other classes and manage the sequence of instantiations.
     *
     * @method delayedConstruct
     * @param {Object} options The object passed on the constructor of a core based class.
     */
    Core.prototype.delayedConstruct = function(opts){
    };
    /**
     * Core method for destroying/cleaning up objects.
     *
     * @method dispose
     * @param {Boolean} removeNode If true and there is a node attached in the class (el property) that element is going to be removed upon disposal.
     */
    Core.prototype.dispose = function(removeNode){
        if(removeNode && this.el){
            try{
                this.el.parentNode.removeChild(this.el);
            }catch(err){}
        }
        this.el = null;
        for(var prop in this.proxyHandlers){
            this.proxyHandlers[prop] = null;
            delete this.proxyHandlers[prop];
        }
        this.$bindings.unbind();
        delete this.$bindings;
    };
    /**
     * Core method for searching sub node elements.
     *
     * @method find
     * @param {String} selector The selector used for searching sub nodes.
     * @returns {NodeList} An array of HTMLElements, please note that this is not jQuery selected nodes.
     */
    Core.prototype.find = function(selector){
        var select = null;
        if("jQuery" in window){
            select = window.jQuery;
        }
        return select ? select(this.node).find(selector) : this.node.querySelectorAll(selector);
    };
    /**
     * Core method for searching sub node elements within the document context.
     *
     * @method findAll
     * @param {String} selector The selector used for searching sub nodes within the document.
     * @returns {NodeList} An array of HTMLElements, please note that this is not jQuery selected nodes.
     */
    Core.prototype.findAll = function(selector){
        var select = null;
        if("jQuery" in window){
            select = window.jQuery;
        }
        return select ? select(document).find(selector) : document.querySelectorAll(selector);
    };
    core.registerNamespace("core.Core", Core);

})();
if(typeof module !== 'undefined' && module.exports){
    module.exports = core;
}
/**
 * The main class that implements broadcaster pattern. Ideally subclassed by objects that will perform broadcasting functions.
 *
 * @class EventDispatcher
 * @namespace core.events
 * @extends core.Core
 * @constructor
 * @param {Object} opts An object containing configurations required by the Core derived class.
 * @param {HTMLElement} opts.el The node element included in the class composition.
 * TODO: Refactor and simplify listening function - something like this.on("EVENT", method); but still retain garbage collection
 */
(function(){
    core.registerModule({
        inherits:"core.Core",
        classname:"core.EventDispatcher",
        module:function(){
            this.onAfterConstruct = function(opts){
                this.events = {};
            };
            this.onBeforeDispose = function(){
                this.removeAll();
                this.events = null;
            };
            /**
             * Checks the array of listeners for existing scopes.
             *
             * @method containsScope
             * @param {Array} list Reference to the array of subscribed listeners
             * @param {Object} scope Reference to the scope being queried for existence
             * @private
             * @return {Booleans} Returns boolean indicating the existence of the scope passed on the parameters
             */
            var containsScope = function(arr, scope){

                var len = arr.length;
                for(var i = 0;i<len;i++){
                    if(arr[i].scope === scope){
                        return arr[i];
                    }
                }
                
                scope.__core__signal__id__ = core.GUID();
                return -1;
            };
            /**
             * Private method handler for event registration.
             *
             * @method register
             * @param {String} eventName The event name being added on the listener list.
             * @param {Object} scope Reference to the scope of the event handler
             * @param {Function} method The method used by the scope to handle the event being broadcasted
             * @param {Boolean} once Specify whether the event should only be handled once by the scope and its event handler
             * @private
             */
            var register = function(evt, scope, method, once){

                var __sig_dispose__ = null;
                var exists = containsScope.call(this, this.events[evt+(once ? "_once" : "")], scope);
                if(exists === -1 && scope.dispose){
                    __sig_dispose__ = scope.dispose;

                    scope.dispose = (function(){
                        var meth = Array.prototype.shift.call(arguments);
                        var sig = Array.prototype.shift.call(arguments);
                        sig.removeScope(this, scope);
                        sig = null;
                        meth = null;

                        return __sig_dispose__.apply(this, arguments);
                    }).bind(scope, method, this);
                    //
                    this.events[evt+(once ? "_once" : "")].push({method:method, scope:scope, dispose_orig:__sig_dispose__});
                }else{
                    //if scope already exists, check if the method has already been added.
                    if(exists !== -1){
                        if(exists.method != method){
                            this.events[evt+(once ? "_once" : "")].push({method:method, scope:exists.scope, dispose_orig:exists.dispose_orig});
                        }
                    }else{

                        this.events[evt+(once ? "_once" : "")].push({method:method, scope:scope, dispose_orig:null});
                    }
                }
            };
            /**
             * Subscribe function. Called when adding a subscriber to the broadcasting object.
             *
             * @method on
             * @param {String} eventName The event name being subscribed to
             * @param {Function} method The method handler to trigger when the event specified is dispatched.
             * @param {core.Core} scope Reference to the scope of the event handler
             */
            this.on = function(evt, method, scope){

                if(!("events" in this)){
                    this.events = {};
                }

                if(!this.events[evt]){
                    this.events[evt] = [];
                }

                register.call(this, evt, scope, method);
            };
            /**
             * Subscribe once function. Called when adding a subscriber to the broadcasting object.
             *
             * @method once
             * @param {String} eventName The event name being subscribed to
             * @param {Function} method The method handler to trigger when the event specified is dispatched.
             * @param {core.Core} scope Reference to the scope of the event handler
             */
            this.once = function(evt, method, scope){
                if(!this.events[evt+"_once"]){
                    this.events[evt+"_once"] = [];
                }
                register.call(this, evt, scope, method, true);
            };
            /**
             * Private method handler for unregistering events
             *
             * @method unregister
             * @param {String} eventName The event name being added on the listener list.
             * @param {Object} scope Reference to the scope of the event handler
             * @param {Function} method The method used by the scope to handle the event being broadcasted
             * @param {Boolean} once Specify whether the event should only be handled once by the scope and its event handler
             * @private
             */
            var unregister = function(evt, scope, method){
                if(this.events[evt]){
                    var len = this.events[evt].length;
                    while(len--){
                        if(this.events[evt][len].scope === scope && this.events[evt][len].method === method){
                            var o = this.events[evt].splice(len, 1).pop();
                            if(o.scope.dispose && o.dispose_orig){
                                o.scope.dispose = o.dispose_orig;
                            }
                            delete o.scope.__core__signal__id__;
                            o.scope = null;
                            o.dispose_orig = null;
                            delete o.dispose_orig;
                            o = null;

                        }
                    }
                    if(this.events[evt].length === 0){
                        delete this.events[evt];
                    }
                }
            };
            /**
             * Unsubscribe function. Called when removing a subscriber from the broadcasting object.
             *
             * @method off
             * @param {String} eventName The event name unsubscribing from.
             * @param {Function} method The method handler to trigger when the event specified is dispatched.
             * @param {core.Core} scope Reference to the scope of the event handler
             */
            this.off = function(evt, method, scope){
                unregister.call(this, evt, scope, method);
                unregister.call(this, evt+"_once", scope, method);
            };
            /**
             * Unsubscribe function - scope context. Unsubscribes a specific scope from ALL events
             *
             * @method removeScope
             * @param {core.Core} scope Reference to the scope subscriber being removed.
             */
            this.removeScope = function(scope){
                for(var prop in this.events){
                    var len = this.events[prop].length;
                    while(len--){
                        if(this.events[prop][len].scope === scope){
                            var o = this.events[prop].splice(len, 1).pop();
                            if(o.scope.dispose && o.dispose_orig){
                                o.scope.dispose = o.dispose_orig;
                            }
                            delete o.scope.__core__signal__id__;
                            o = null;
                        }
                    }
                    if(this.events[prop].length === 0){
                        delete this.events[prop];
                    }
                }
            };
            /**
             * Removes all items from the listener list.
             *
             * @method removeAll
             */
            this.removeAll = function(){
                for(var prop in this.events){
                    var len = this.events[prop].length;
                    while(this.events[prop].length){
                        var o = this.events[prop].shift();
                        if(o.scope.dispose && o.dispose_orig){
                            o.scope.dispose = o.dispose_orig;
                        }
                        delete o.__core__signal__id__;
                        o = null;
                    }
                    if(this.events[prop].length === 0){
                        delete this.events[prop];
                    }
                }
                this.events = {};
            };
            /**
             * Broadcast functions. Triggers a broadcast on the EventDispatcher/derived object.
             *
             * @method trigger
             * @param {String} eventName The event name to trigger/broadcast.
             * @param {Object} variables An object to send upon broadcast
             */
            this.trigger = function(evt, vars){
                var dis = vars || {};
                if(!dis.type){
                    dis.type = evt;
                }
                if(this.events && this.events[evt]){
                    var sevents = this.events[evt];
                    var len = sevents.length;
                    for(var i = 0;i<len;i++){
                        var obj = sevents[i];
                        obj.scope[obj.method].call(obj.scope, dis);
                        obj = null;
                    }
                }
                if(this.events && this.events[evt+"_once"]){
                    var oevents = this.events[evt+"_once"];
                    while(oevents.length){
                        var obj = oevents.shift();
                        obj.scope[obj.method].call(obj.scope, dis);
                        obj = null;
                    }
                    if(!oevents.length){
                        delete this.events[evt+"_once"];
                    }
                }
                dis = null;
            };
        }
    });
})();

/**
 * ** Singleton. ** <br>Allows a global object to be utilized for broadcasting events.<br><br>
 * ** Example: ** <br> <pre>EventBroadcaster.instance().on("eventName", scope._("someEvent"), scope);</pre>
 * @class EventBroadcaster
 * @namespace core.events
 * @extends core.events.EventDispatcher
 * @constructor
 * @param {Object} opts An object containing configurations required by the Core derived class.
 *
 */
(function () {
    core.registerModule({
        inherits:"core.EventDispatcher",
        singleton:true,
        classname:"core.EventBroadcaster",
        module:function(){
        }
    });

})();
/**
 * ** Singleton. ** <br>The base object of all core based classes. Every object created within the Core framework derives from this class.
 *
 * @class XHR
 * @namespace core.net
 * @extends core.Core
 * @constructor
 * @param {Object} opts An object containing configurations required by the Core class.
 * @param {Object} opts.el The node element included in the class composition.
 *
 */
/**
 * LIFTED and renamed from qwest
 * TODO: Add httpMock and interceptors
 OPTIONS
 dataType : post (by default), json, text, arraybuffer, blob, document or formdata (you don't need to specify XHR2 types since they're automatically detected)
 responseType : the response type; either auto (default), json, xml, text, arraybuffer, blob or document
 cache : browser caching; default is false for GET requests and true for POST requests
 async : true (default) or false; used to make asynchronous or synchronous requests
 user : the user to access to the URL, if needed
 password : the password to access to the URL, if needed
 headers : javascript object containing headers to be sent
 withCredentials : false by default; sends credentials with your XHR2 request (more info in that post)
 timeout : the timeout for the request in ms; 3000 by default
 attempts : the total number of times to attempt the request through timeouts; 3 by default; if you want to remove the limit set it to null

 xhr.<method>(<url>[, data[, options]])
 .then(function(response){
        // Run when the request is successful
     })
 .error(function(e,url){
        // Process the error
     })
 .complete(function(){
        // Always run
     });


 xhr.limit(NUMBER) - sets simultaneous request limit
 */

(function () {
    core.registerModule({
        inherits:"core.Core",
        classname:"core.XHR",
        singleton:true,
        module:function(){
            var __xhr__ = function () {
                return win.XMLHttpRequest ?
                    new XMLHttpRequest() :
                    new ActiveXObject('Microsoft.XMLHTTP');
            };
            var win = window,
                doc = document,
                before,
                defaultXdrResponseType = 'json',
                limit = null,
                requests = 0,
                request_stack = [],
                xhr2 = (__xhr__().responseType === '');

            var request = function (method, url, data, options, before) {

                // Format
                method = method.toUpperCase();
                data = data || null;
                options = options || {};

                // Define variables
                var nativeResponseParsing = false,
                    crossOrigin,
                    xhr,
                    xdr = false,
                    timeoutInterval,
                    aborted = false,
                    attempts = 0,
                    headers = {},
                    mimeTypes = {
                        text: '*/*',
                        xml: 'text/xml',
                        json: 'application/json',
                        post: 'application/x-www-form-urlencoded'
                    },
                    accept = {
                        text: '*/*',
                        xml: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
                        json: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1'
                    },
                    contentType = 'Content-Type',
                    vars = '',
                    i, j,
                    serialized,
                    then_stack = [],
                    catch_stack = [],
                    complete_stack = [],
                    response,
                    success,
                    error,
                    func,

                    // Define promises
                    promises = {
                        then: function (func) {

                            if (options.async) {
                                then_stack.push(func);
                            }
                            else if (success) {
                                func.call(xhr, response);
                            }
                            return promises;
                        },
                        'error': function (func) {
                            if (options.async) {
                                catch_stack.push(func);
                            }
                            else if (error) {
                                func.call(xhr, response);
                            }
                            return promises;
                        },
                        complete: function (func) {
                            if (options.async) {
                                complete_stack.push(func);
                            }
                            else {
                                func.call(xhr);
                            }
                            return promises;
                        }
                    },
                    promises_limit = {
                        then: function (func) {
                            request_stack[request_stack.length - 1].then.push(func);
                            return promises_limit;
                        },
                        'error': function (func) {
                            request_stack[request_stack.length - 1]['catch'].push(func);
                            return promises_limit;
                        },
                        complete: function (func) {
                            request_stack[request_stack.length - 1].complete.push(func);
                            return promises_limit;
                        }
                    },

                // Handle the response
                    handleResponse = function () {
                        // Verify request's state
                        // --- https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
                        if (aborted) {
                            return;
                        }
                        // Prepare
                        var i, req, p, responseType;
                        --requests;
                        // Clear the timeout
                        clearInterval(timeoutInterval);
                        // Launch next stacked request
                        if (request_stack.length) {
                            req = request_stack.shift();
                            p = qwest(req.method, req.url, req.data, req.options, req.before);
                            for (i = 0; func = req.then[i]; ++i) {
                                p.then(func);
                            }
                            for (i = 0; func = req['catch'][i]; ++i) {
                                p['catch'](func);
                            }
                            for (i = 0; func = req.complete[i]; ++i) {
                                p.complete(func);
                            }
                        }
                        // Handle response
                        try {
                            // Verify status code
                            // --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
                            if ('status' in xhr && !/^2|1223/.test(xhr.status)) {
                                throw xhr.status + ' (' + xhr.statusText + ')';
                            }
                            // Init
                            var responseText = 'responseText',
                                responseXML = 'responseXML',
                                parseError = 'parseError';
                            // Process response
                            if (nativeResponseParsing && 'response' in xhr && xhr.response !== null) {
                                response = xhr.response;
                            }
                            else if (options.responseType == 'document') {
                                var frame = doc.createElement('iframe');
                                frame.style.display = 'none';
                                doc.body.appendChild(frame);
                                frame.contentDocument.open();
                                frame.contentDocument.write(xhr.response);
                                frame.contentDocument.close();
                                response = frame.contentDocument;
                                doc.body.removeChild(frame);
                            }
                            else {
                                // Guess response type
                                responseType = options.responseType;
                                if (responseType == 'auto') {
                                    if (xdr) {
                                        responseType = defaultXdrResponseType;
                                    }
                                    else {
                                        var ct = xhr.getResponseHeader(contentType) || '';
                                        if (ct.indexOf(mimeTypes.json) > -1) {
                                            responseType = 'json';
                                        }
                                        else if (ct.indexOf(mimeTypes.xml) > -1) {
                                            responseType = 'xml';
                                        }
                                        else {
                                            responseType = 'text';
                                        }
                                    }
                                }
                                // Handle response type
                                switch (responseType) {
                                    case 'json':
                                        try {
                                            if ('JSON' in win) {
                                                response = JSON.parse(xhr[responseText]);
                                            }
                                            else {
                                                response = eval('(' + xhr[responseText] + ')');
                                            }
                                        }
                                        catch (e) {
                                            throw "Error while parsing JSON body : " + e;
                                        }
                                        break;
                                    case 'xml':
                                        // Based on jQuery's parseXML() function
                                        try {
                                            // Standard
                                            if (win.DOMParser) {
                                                response = (new DOMParser()).parseFromString(xhr[responseText], 'text/xml');
                                            }
                                            // IE<9
                                            else {
                                                response = new ActiveXObject('Microsoft.XMLDOM');
                                                response.async = 'false';
                                                response.loadXML(xhr[responseText]);
                                            }
                                        }
                                        catch (e) {
                                            response = undefined;
                                        }
                                        if (!response || !response.documentElement || response.getElementsByTagName('parsererror').length) {
                                            throw 'Invalid XML';
                                        }
                                        break;
                                    default:
                                        response = xhr[responseText];
                                }
                            }
                            // Execute 'then' stack
                            success = true;
                            p = response;
                            if (options.async) {
                                for (i = 0; func = then_stack[i]; ++i) {

                                    //console.log(method, url, xhr);
                                    p = func.call(xhr, p);
                                }
                            }
                        }
                        catch (e) {
                            error = true;
                            // Execute 'catch' stack
                            if (options.async) {
                                for (i = 0; func = catch_stack[i]; ++i) {
                                    func.call(xhr, e, url);
                                }
                            }
                        }
                        // Execute complete stack
                        if (options.async) {
                            for (i = 0; func = complete_stack[i]; ++i) {
                                func.call(xhr);
                            }
                        }
                    },

                // Recursively build the query string
                    buildData = function (data, key) {
                        var res = [],
                            enc = encodeURIComponent,
                            p;
                        if (typeof data === 'object' && data != null) {
                            for (p in data) {
                                if (data.hasOwnProperty(p)) {
                                    var built = buildData(data[p], key ? key + '[' + p + ']' : p);
                                    if (built !== '') {
                                        res = res.concat(built);
                                    }
                                }
                            }
                        }
                        else if (data != null && key != null) {
                            res.push(enc(key) + '=' + enc(data));
                        }
                        return res.join('&');
                    };

                // New request
                ++requests;


                // Normalize options
                options.async = 'async' in options ? !!options.async : true;
                options.cache = 'cache' in options ? !!options.cache : (method != 'GET');
                options.dataType = 'dataType' in options ? options.dataType.toLowerCase() : 'post';
                options.responseType = 'responseType' in options ? options.responseType.toLowerCase() : 'auto';
                options.user = options.user || '';
                options.password = options.password || '';
                options.withCredentials = !!options.withCredentials;
                options.timeout = 'timeout' in options ? parseInt(options.timeout, 10) : 3000;
                options.attempts = 'attempts' in options ? parseInt(options.attempts, 10) : 3;

                // Guess if we're dealing with a cross-origin request
                i = url.match(/\/\/(.+?)\//);
                crossOrigin = i && i[1] ? i[1] != location.host : false;

                // Prepare data
                if ('ArrayBuffer' in win && data instanceof ArrayBuffer) {
                    options.dataType = 'arraybuffer';
                }
                else if ('Blob' in win && data instanceof Blob) {
                    options.dataType = 'blob';
                }
                else if ('Document' in win && data instanceof Document) {
                    options.dataType = 'document';
                }
                else if ('FormData' in win && data instanceof FormData) {
                    options.dataType = 'formdata';
                }
                switch (options.dataType) {
                    case 'json':
                        data = JSON.stringify(data);
                        break;
                    case 'post':
                        data = buildData(data);
                }

                // Prepare headers
                if (options.headers) {
                    var format = function (match, p1, p2) {
                        return p1 + p2.toUpperCase();
                    };
                    for (i in options.headers) {
                        headers[i.replace(/(^|-)([^-])/g, format)] = options.headers[i];
                    }
                }
                if (!headers[contentType] && method != 'GET') {
                    if (options.dataType in mimeTypes) {
                        if (mimeTypes[options.dataType]) {
                            headers[contentType] = mimeTypes[options.dataType];
                        }
                    }
                }
                if (!headers.Accept) {
                    headers.Accept = (options.responseType in accept) ? accept[options.responseType] : '*/*';
                }
                if (!crossOrigin && !headers['X-Requested-With']) { // because that header breaks in legacy browsers with CORS
                    headers['X-Requested-With'] = 'XMLHttpRequest';
                }

                // Prepare URL
                if (method == 'GET') {
                    vars += data;
                }
                if (!options.cache) {
                    if (vars) {
                        vars += '&';
                    }
                    vars += '__t=' + (+new Date());
                }
                if (vars) {
                    url += (/\?/.test(url) ? '&' : '?') + vars;
                }

                // The limit has been reached, stock the request
                if (limit && requests == limit) {
                    request_stack.push({
                        method: method,
                        url: url,
                        data: data,
                        options: options,
                        before: before,
                        then: [],
                        'catch': [],
                        complete: []
                    });
                    return promises_limit;
                }

                // Send the request
                var send = function () {
                    // Get XHR object
                    xhr = __xhr__();
                    if (crossOrigin) {
                        if (!('withCredentials' in xhr) && win.XDomainRequest) {
                            xhr = new XDomainRequest(); // CORS with IE8/9
                            xdr = true;
                            if (method != 'GET' && method != 'POST') {
                                method = 'POST';
                            }
                        }
                    }
                    // Open connection
                    if (xdr) {
                        xhr.open(method, url);
                    }
                    else {
                        xhr.open(method, url, options.async, options.user, options.password);
                        if (xhr2 && options.async) {
                            xhr.withCredentials = options.withCredentials;
                        }
                    }
                    // Set headers
                    if (!xdr) {
                        for (var i in headers) {
                            xhr.setRequestHeader(i, headers[i]);
                        }
                    }
                    // Verify if the response type is supported by the current browser
                    if (xhr2 && options.responseType != 'document') { // Don't verify for 'document' since we're using an internal routine
                        try {
                            xhr.responseType = options.responseType;
                            nativeResponseParsing = (xhr.responseType == options.responseType);
                        }
                        catch (e) {
                        }
                    }
                    // Plug response handler
                    if (xhr2 || xdr) {
                        xhr.onload = handleResponse;
                    }
                    else {
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                handleResponse();
                            }
                        };
                    }
                    // Override mime type to ensure the response is well parsed
                    if (options.responseType !== 'auto' && 'overrideMimeType' in xhr) {
                        xhr.overrideMimeType(mimeTypes[options.responseType]);
                    }
                    // Run 'before' callback
                    if (before) {
                        before.call(xhr);
                    }
                    // Send request
                    if (xdr) {
                        setTimeout(function () { // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
                            xhr.send(method != 'GET' ? data : null);
                        }, 0);
                    }
                    else {
                        xhr.send(method != 'GET' ? data : null);
                    }
                };

                // Timeout/attempts
                var timeout = function () {
                    timeoutInterval = setTimeout(function () {
                        aborted = true;
                        xhr.abort();
                        if (!options.attempts || ++attempts != options.attempts) {
                            aborted = false;
                            timeout();
                            send();
                        }
                        else {
                            aborted = false;
                            error = true;
                            response = 'Timeout (' + url + ')';
                            if (options.async) {
                                for (i = 0; func = catch_stack[i]; ++i) {
                                    func.call(xhr, response);
                                }
                            }
                        }
                    }, options.timeout);
                };

                // Start the request
                timeout();
                send();

                // Return promises
                return promises;

            };
            var checkMocks = function(url){
                if(core.ENV.httpMocks){
                    console.log("TODO: implement http mock");
                }
            };
            var handleMockedPromise = function(){

            };
            var create = function (method) {
                return function (url, data, options) {
                    var b = before;
                    before = null;

                    return request(method, url, data, options, b);
                };
            };
            this.before = function(callback) {
                before = callback;
                return this;
            }
            this.get = create('GET');
            this.post = create('POST');
            this.put = create('PUT');
            this['delete'] = create('DELETE');
            this.xhr2 = xhr2;
            this.limit = function(by) {
                limit = by;
            };
            this.setDefaultXdrResponseType = function(type) {
                defaultXdrResponseType = type.toLocaleLowerCase();
            };

        }
    });
})();
/**
 * The base object of all core based classes. Every object created within the Core framework derives from this class.
 *
 * @class Module
 * @namespace core.wirings
 * @extends core.events.EventDispatcher
 * @constructor
 * @param {Object} opts An object containing configurations required by the Core derived class.
 * @param {HTMLElement} opts.el The node element included in the class composition.
 *
 */
(function (scope) {
    core.registerModule({
        inherits:"core.EventDispatcher",
        classname:"core.Module",
        module:["core.XHR", function(xhr){
            this.delayedConstruct = function (opts) {
                //create
                findImmediateClasses.call(this, this.el);
                checkNodeProperties.call(this, this.el);
                if("initialized" in this){
                    this.initialized(opts);
                }

            };
            this.loadViewModule = function(src){
                var fragment;
                xhr.get(src).then((function(res){
                    fragment = res;

                }).bind(this)).error(function(err){

                }).complete((function(res){
                    this.appendFragment(fragment);
                }).bind(this));
            };
            this.appendNode = function(node){
                var wrap = document.createElement("div");
                wrap.appendChild(node);
                findImmediateClasses.call(this, wrap);
                this.el.appendChild(wrap.firstChild);
                wrap = null;
            };
            this.appendFragment = function(str){
                var wrap = document.createElement("div");
                wrap.innerHTML = str;
                findImmediateClasses.call(this, wrap);

                for(var i in wrap.childNodes){
                    try{
                        this.el.appendChild(wrap.childNodes[i]);
                    }catch(err){}

                }
                wrap = null;
            };
            function parseParameters(params){
                var o = {};
                var split = params.split(";");
                if(split[split.length-1] == ""){
                    split.pop();
                }
                var len = split.length;
                while(len--){

                    var pair = split[len].split(":");
                    o[pair[0]] = pair[1];
                }
                return o;
            };
            function checkNodeProperties(node){
                var children = node.childNodes;
                for(var i in children){
                    var child = children[i];
                    if(child.nodeType === 1){
                        if(child.getAttribute("core-module") || child.getAttribute("data-core-module")){
                            break; //stop when encountering another module
                        }
                        if(child.getAttribute("data-core-prop") || child.getAttribute("core-prop")){
                            if(!this.properties){
                                this.properties = {};
                            }
                            var attr = child.getAttribute("data-core-prop") || child.getAttribute("core-prop");
                            if(this.properties[attr] && !(this.properties[attr] instanceof Array)){
                                this.properties[attr] = [this.properties[attr]];
                            }
                            if(this.properties[attr] instanceof Array){
                                this.properties[attr].push(child);
                            }else{
                                this.properties[attr] = child;
                            }

                        }

                        if(child.hasChildNodes()){
                            checkNodeProperties.call(this, child);
                        }


                    }
                }
            };
            function findImmediateClasses(node) {
                var recurse = function(modules) {
                    var i = -1,
                        cls,
                        opts,
                        len = modules.length-1;

                    while(i++ < len){
                        var mod = modules[i];

                        if(mod.nodeType == 1){

                            var cmod = mod.getAttribute("core-module") || mod.getAttribute("data-core-module");
                            var cid = mod.getAttribute("core-id") || mod.getAttribute("data-core-id");
                            var params = mod.getAttribute("core-params") || mod.getAttribute("data-core-params");

                            if(cmod && cid && !this[cid]){
                                cls = Function.apply(scope, ["return "+cmod])();
                                opts = {};
                                opts.params = params ? parseParameters(params) : null;
                                opts.el = mod;
                                opts.parent = this;

                                this[cid] = new cls(opts);
                            }else if(cmod && !cid){
                                cls = Function.apply(scope, ["return "+cmod])();
                                opts = {};
                                opts.params = params ? parseParameters(params) : null;
                                opts.parent = this;
                                opts.el = mod;
                                if(cls){
                                    new cls(opts); //do not assign to any property
                                }else{
                                    throw new Error(cmod + " module not found.")
                                }


                            }else if(cmod && cid && this[cid]){
                                cls = Function.apply(scope, ["return "+cmod])();
                                opts = {};
                                opts.params = params ? parseParameters(params) : null;
                                opts.el = mod;
                                opts.parent = this;
                                var o = new cls(opts);
                                try{
                                    this[cid].push(o);
                                }catch(err){
                                    this[cid] = [this[cid]];
                                    this[cid].push(o);
                                }
                            }else if(mod.hasChildNodes()){
                                recurse.call(this, mod.childNodes);
                            }
                        }
                    }
                };
                recurse.call(this, node.childNodes);
            }


        }]
    });

})(typeof process !== "undefined" && process.arch !== undefined ? GLOBAL : window);
/**
 * The base module for the Core JS framework.
 * It provides helper methods for implementing OOP methodologies and basic utilities such as browser detection.
 *
 * @module addons
 */
(function () {
    core.registerModule({
        inherits:"core.EventDispatcher",
        classname:"core.WindowEvents",
        singleton:true,
        module:function(){
            /**
             * The main class that implements broadcaster pattern. Ideally subclassed by objects that will perform broadcasting functions.
             *
             * @class CoreWindow
             * @extends core.Core
             * @namespace core.addons
             * @constructor
             * @param {Object} opts An object containing configurations required by the Core derived class.
             * @param {HTMLElement} opts.el The node element included in the class composition.
             *
             */
            this.dispatchScroll = function(){
                var scrollLeft = this.scrollLeft =  (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
                var scrollTop = this.scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
                this.trigger("window.scroll", {scrollTop:scrollTop, scrollLeft:scrollLeft});
                this.tick = false;
            };
            this.dispatchResize = function(){
                var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                var t = "mobile";
                if(w >= 992 && w < 1200){
                    t = "medium";
                }else if(w < 992 && w >= 768){
                    t = "small";
                }else if(w >= 1200){
                    t = "large";
                }
                this.trigger("window.resize", {width:w, height:h, type:t});
                this.tickResize = false;
            };
            this.dispatchMotion = function(){
                var evt = this.motionEvent;
                var accelX = evt.accelerationIncludingGravity.x;
                var accelY = evt.accelerationIncludingGravity.y;
                var accelZ = evt.accelerationIncludingGravity.z;
                var rotationAlpha = evt.rotationRate.alpha;
                var rotationGamma = evt.rotationRate.gamma;
                var rotationBeta = evt.rotationRate.beta;
                this.trigger("window.device.motion", {accelX:accelX, accelY:accelY, accelZ:accelZ, rotationAlpha:rotationAlpha, rotationBeta:rotationBeta, rotationGamma:rotationGamma});
                this.tickMotion = false;
                this.motionEvent = null;

            };
            this.onWindowScroll = function(){
                if(!this.tick){
                    this.tick = true;
                    requestAnimationFrame(this._("dispatchScroll"));
                }
            };
            this.onWindowResize = function(){
                if(!this.tickResize){
                    this.tickResize = true;
                    requestAnimationFrame(this._("dispatchResize"));
                }
            };
            this.onDeviceMotion = function(evt){
                this.motionEvent = evt;
                if(!this.tickMotion){
                    this.tickMotion = true;
                    requestAnimationFrame(this._("dispatchMotion"));
                }
            };
            this.onAfterConstruct = function(){

                this.scrollTop = 0;
                this.scrollLeft = 0;
                window.addEventListener("scroll", this._("onWindowScroll"));
                window.addEventListener("resize", this._("onWindowResize"));
                if(core.browser.touch){
                    window.addEventListener("devicemotion", this._("onDeviceMotion"));
                }
                this.$super.onAfterConstruct.call(this);
            };
        }
    });




})();
/**
 * Created by donaldmartinez on 13/05/15.
 */
(function(){
    core.registerModule({
        inherits:"core.Core",
        classname:"core.Parallax",
        singleton:true,
        module:["core.WindowEvents", function(windowevents){
            this.onAfterConstruct = function(){
                this.supportTouch = core.browser.touch;
                this.elements = this.findAll("[core-parallax]");
                if(this.elements.length){
                    windowevents.on("window.scroll", this._("update"), this);
                    windowevents.on("window.device.motion", this._("updateAcceleration"), this);
                    this.tick = true;
                    this.update();
                }
            }
            this.update = function(){
                var len = this.elements.length;
                while(len--){
                    var offset = Number(this.elements[len].getAttribute("scroll-offset")) || .1;
                    var invert = Number(this.elements[len].getAttribute("scroll-invert")) || 0;
                    var top = core.rect(this.elements[len]).top;
                    var value = top*offset;
                    if(invert){
                        value *= -1;
                    }
                    this.elements[len].style.backgroundPosition = "center "+value+"px";
                }
                this.tick = false;
            };
            this.updateAcceleration = function(evt){
                //console.log(evt);
                //untested
                this.update();
            };

        }]
    });
})();